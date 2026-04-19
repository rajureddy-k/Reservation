package com.movie.ticket.ticket;


import com.movie.amqp.RabbitMqMessageProducer;
import com.movie.client.movieClient.MovieClient;
import com.movie.client.notification.NotificationRequest;
import com.movie.client.paymentClient.PaymentClient;
import com.movie.client.scheduleClient.ScheduleClient;
import com.movie.client.seatClient.SeatClient;
import com.movie.client.userClient.UserClient;
import com.movie.common.ScheduleDTO;
import com.movie.common.SeatDTO;
import com.movie.common.UserDTO;
import com.movie.exceptions.AlreadyOccupiedException;
import com.movie.exceptions.HandleRuntimeException;
import com.movie.exceptions.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author DMITRII LEVKIN on 24/12/2024
 * @project Movie-Reservation-System
 */
@Service
@Slf4j
public class TicketService {
    private static final Logger log = LoggerFactory.getLogger(TicketService.class);

    private final TicketDAO ticketDAO;


    private final TicketDTOMapper ticketDTOMapper;

    private final RabbitMqMessageProducer rabbitMqMessageProducer;

    private final UserClient userClient;

    private final MovieClient movieClient;

    private final SeatClient seatClient;

    private final ScheduleClient scheduleClient;

    private final PaymentClient paymentClient;


    public TicketService(@Qualifier("ticketJdbc") TicketDAO ticketDAO, TicketDTOMapper ticketDTOMapper, RabbitMqMessageProducer rabbitMqMessageProducer, UserClient userClient, MovieClient movieClient, SeatClient seatClient, ScheduleClient scheduleClient, PaymentClient paymentClient) {
        this.ticketDAO = ticketDAO;
        this.ticketDTOMapper = ticketDTOMapper;
        this.rabbitMqMessageProducer = rabbitMqMessageProducer;
        this.userClient = userClient;
        this.movieClient = movieClient;
        this.seatClient = seatClient;
        this.scheduleClient = scheduleClient;
        this.paymentClient = paymentClient;
    }


    public List<TicketDTO> getAllTickets() {

        return ticketDAO.selectAllTickets().stream()
                .map(ticketDTOMapper)
                .collect(Collectors.toList());
    }

    public List<TicketDTO> getTicketsForAuthenticatedUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new HandleRuntimeException("Unauthorized user. Please login before proceeding.");
        }
        String username = (String) authentication.getPrincipal();
        UserDTO userDTO = userClient.getUserByUsername(username);

        List<TicketDTO> tickets = ticketDAO.selectTicketsByUser(userDTO.userId())
                .stream()
                .map(ticketDTOMapper)
                .collect(Collectors.toList());


        return new ArrayList<>(tickets);
    }

    public List<Long> getReservedSeatIdsBySchedule(Long scheduleId) {
        return ticketDAO.selectTicketsBySchedule(scheduleId)
                .stream()
                .map(Ticket::getSeatId)
                .collect(Collectors.toList());
    }

    public boolean isSeatReservedForSchedule(Long scheduleId, Long seatId) {
        return ticketDAO.selectTicketByScheduleAndSeat(scheduleId, seatId).isPresent();
    }

    public void createTicket(TicketRegistrationRequest ticketRegistrationRequest) {

        Ticket ticket = new Ticket();

        // Get the current auth_user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new HandleRuntimeException("Unauthorized user. Please login before proceeding.");
        }
        String username = (String) authentication.getPrincipal();


        // Retrieve user
        UserDTO userDTO = userClient.getUserByUsername(username);
        if (userDTO == null) {
            throw new ResourceNotFoundException("User not found.");
        }


        //fetch seat
        SeatDTO seatDTO = seatClient.getSeatById(ticketRegistrationRequest.seatId());
        if (seatDTO == null) {
            throw new ResourceNotFoundException("Seat not found.");
        }

        // retrieve price
        BigDecimal price = seatClient.getSeatPriceById(ticketRegistrationRequest.seatId());
        if (price == null) {
            throw new ResourceNotFoundException("Price not found for the selected seat.");
        }


        ScheduleDTO scheduleDTO = scheduleClient.getScheduleById(ticketRegistrationRequest.scheduleId());
        if (scheduleDTO == null) {
            throw new ResourceNotFoundException("Schedule not found.");
        }

        // validation

        try {
            boolean movieExists = movieClient.existsById(ticketRegistrationRequest.movieId());
            if (!movieExists) {
                throw new ResourceNotFoundException("Movie with ID " + ticketRegistrationRequest.movieId() + " does not exist.");
            }
        } catch (HandleRuntimeException e) {
            log.error("Authorization error when accessing movie client: {}", e.getMessage());
            throw new HandleRuntimeException("Cannot validate movie existence due to authorization restrictions.");
        } catch (ResourceNotFoundException e) {
            log.error("Movie resource not found: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error occurred when accessing movie service: {}", e.getMessage());
            throw new HandleRuntimeException("Unable to process the ticket at this time. Please try again later.");
        }

        Long cinemaId = ticketRegistrationRequest.cinemaId();
        Long seatId = ticketRegistrationRequest.seatId();
        boolean isSeatValid = seatClient.getSeatsByCinema(cinemaId)
                .stream()
                .anyMatch(seat -> seat.seatId().equals(seatId));
        //validation
        if (!isSeatValid) {
            throw new IllegalArgumentException("Invalid seatId for the provided cinemaId.");
        }

        // validation
        if (scheduleDTO.availableSeats() <= 0) {
            List<Long> reservedSeatIds = Optional.ofNullable(getReservedSeatIdsBySchedule(ticketRegistrationRequest.scheduleId()))
                    .orElse(Collections.emptyList());
            int totalSeatCount = seatClient.getTotalSeatsByCinemaId(scheduleDTO.cinemaId()).totalSeats();
            int actualAvailableSeats = totalSeatCount - reservedSeatIds.size();

            if (actualAvailableSeats <= 0) {
                throw new AlreadyOccupiedException("Tickets are sold out for this schedule.");
            }

            log.warn("Schedule {} reported availableSeats=0; using actual computed availability {} from totalSeats={} reserved={}",
                    ticketRegistrationRequest.scheduleId(), actualAvailableSeats, totalSeatCount, reservedSeatIds.size());
        }

        //validation
        if (!scheduleDTO.cinemaId().equals(ticketRegistrationRequest.cinemaId())) {
            throw new AlreadyOccupiedException("The schedule does not belong to the selected cinema.");
        }

        if (isSeatReservedForSchedule(ticketRegistrationRequest.scheduleId(), ticketRegistrationRequest.seatId())) {
            throw new AlreadyOccupiedException("The selected seat is already reserved for this showtime.");
        }

        // decrease available seats
        scheduleClient.decreaseAvailableSeats(ticketRegistrationRequest.scheduleId());

        String movieName = movieClient.getMovieNameById(ticketRegistrationRequest.movieId());

        String startTime = scheduleClient.getStartTime(ticketRegistrationRequest.scheduleId());

        ticket.setUserId(userDTO.userId());
        ticket.setMovieId(ticketRegistrationRequest.movieId());
        ticket.setCinemaId(ticketRegistrationRequest.cinemaId());
        ticket.setSeatId(ticketRegistrationRequest.seatId());
        ticket.setScheduleId(ticketRegistrationRequest.scheduleId());
        ticket.setPrice(price);
        ticket.setDate(new Date());

        log.info("NEW TICKET: {}", ticket);

        ticketDAO.createOneTicket(ticket);
        NotificationRequest notificationRequest = new NotificationRequest(
                ticket.getTicketId(),
                "Ticket Purchased Successfully",
                String.format("Dear %s, your ticket for the movie '%s' has been successfully booked." +
                        "The price is '%s'.The start time is '%s'. " +
                        "Enjoy the movie!",username,movieName,price,startTime)
        );

        rabbitMqMessageProducer.publish(
                notificationRequest,
                "internal.exchange",
                "internal.notification.routing-key"
        );
    }

    public void createTicketWithPayment(TicketWithPaymentRequest ticketWithPaymentRequest) {
        Ticket ticket = new Ticket();

        // Get the current auth_user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new HandleRuntimeException("Unauthorized user. Please login before proceeding.");
        }
        String username = (String) authentication.getPrincipal();

        // Retrieve user
        UserDTO userDTO = userClient.getUserByUsername(username);
        if (userDTO == null) {
            throw new ResourceNotFoundException("User not found.");
        }

        // Fetch seat
        SeatDTO seatDTO = seatClient.getSeatById(ticketWithPaymentRequest.getSeatId());
        if (seatDTO == null) {
            throw new ResourceNotFoundException("Seat not found.");
        }

        // Retrieve price
        BigDecimal price = seatClient.getSeatPriceById(ticketWithPaymentRequest.getSeatId());
        if (price == null) {
            throw new ResourceNotFoundException("Price not found for the selected seat.");
        }

        ScheduleDTO scheduleDTO = scheduleClient.getScheduleById(ticketWithPaymentRequest.getScheduleId());
        if (scheduleDTO == null) {
            throw new ResourceNotFoundException("Schedule not found.");
        }

        // Validation
        try {
            boolean movieExists = movieClient.existsById(ticketWithPaymentRequest.getMovieId());
            if (!movieExists) {
                throw new ResourceNotFoundException("Movie with ID " + ticketWithPaymentRequest.getMovieId() + " does not exist.");
            }
        } catch (HandleRuntimeException e) {
            log.error("Authorization error when accessing movie client: {}", e.getMessage());
            throw new HandleRuntimeException("Cannot validate movie existence due to authorization restrictions.");
        } catch (ResourceNotFoundException e) {
            log.error("Movie resource not found: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error occurred when accessing movie service: {}", e.getMessage());
            throw new HandleRuntimeException("Unable to process the ticket at this time. Please try again later.");
        }

        Long cinemaId = ticketWithPaymentRequest.getCinemaId();
        Long seatId = ticketWithPaymentRequest.getSeatId();
        boolean isSeatValid = seatClient.getSeatsByCinema(cinemaId)
                .stream()
                .anyMatch(seat -> seat.seatId().equals(seatId));
        
        if (!isSeatValid) {
            throw new IllegalArgumentException("Invalid seatId for the provided cinemaId.");
        }

        // Validation
        if (scheduleDTO.availableSeats() <= 0) {
            List<Long> reservedSeatIds = Optional.ofNullable(getReservedSeatIdsBySchedule(ticketWithPaymentRequest.getScheduleId()))
                    .orElse(Collections.emptyList());
            int totalSeatCount = seatClient.getTotalSeatsByCinemaId(scheduleDTO.cinemaId()).totalSeats();
            int actualAvailableSeats = totalSeatCount - reservedSeatIds.size();

            if (actualAvailableSeats <= 0) {
                throw new AlreadyOccupiedException("Tickets are sold out for this schedule.");
            }

            log.warn("Schedule {} reported availableSeats=0; using actual computed availability {} from totalSeats={} reserved={}",
                    ticketWithPaymentRequest.getScheduleId(), actualAvailableSeats, totalSeatCount, reservedSeatIds.size());
        }

        // Validation
        if (!scheduleDTO.cinemaId().equals(ticketWithPaymentRequest.getCinemaId())) {
            throw new AlreadyOccupiedException("The schedule does not belong to the selected cinema.");
        }

        if (isSeatReservedForSchedule(ticketWithPaymentRequest.getScheduleId(), ticketWithPaymentRequest.getSeatId())) {
            throw new AlreadyOccupiedException("The selected seat is already reserved for this showtime.");
        }

        // Get movie and start time info before payment
        String movieName = movieClient.getMovieNameById(ticketWithPaymentRequest.getMovieId());
        String startTime = scheduleClient.getStartTime(ticketWithPaymentRequest.getScheduleId());

        // Process payment BEFORE decreasing available seats
        Long amountInCents = price.multiply(new BigDecimal("100")).longValue();
        PaymentClient.PaymentRequest paymentRequest = new PaymentClient.PaymentRequest();
        paymentRequest.setScheduleId(ticketWithPaymentRequest.getScheduleId());
        paymentRequest.setAmount(amountInCents);
        paymentRequest.setCurrency("USD");
        paymentRequest.setDescription(String.format("Movie ticket for %s at schedule %d", movieName, ticketWithPaymentRequest.getScheduleId()));
        paymentRequest.setCardNumber(ticketWithPaymentRequest.getCardNumber());
        paymentRequest.setExpMonth(ticketWithPaymentRequest.getExpMonth());
        paymentRequest.setExpYear(ticketWithPaymentRequest.getExpYear());
        paymentRequest.setCvc(ticketWithPaymentRequest.getCvc());

        try {
            PaymentClient.PaymentResponse paymentResponse = paymentClient.createPayment(paymentRequest);
            
            if (paymentResponse == null || !"succeeded".equalsIgnoreCase(paymentResponse.getStatus())) {
                throw new HandleRuntimeException("Payment processing failed. Status: " + 
                    (paymentResponse != null ? paymentResponse.getStatus() : "unknown"));
            }

            log.info("Payment successful. Payment ID: {}", paymentResponse.getPaymentId());

        } catch (Exception e) {
            log.error("Payment processing error: {}", e.getMessage());
            throw new HandleRuntimeException("Payment failed: " + e.getMessage());
        }

        // ONLY after payment succeeds, decrease available seats and book the ticket
        scheduleClient.decreaseAvailableSeats(ticketWithPaymentRequest.getScheduleId());

        ticket.setUserId(userDTO.userId());
        ticket.setMovieId(ticketWithPaymentRequest.getMovieId());
        ticket.setCinemaId(ticketWithPaymentRequest.getCinemaId());
        ticket.setSeatId(ticketWithPaymentRequest.getSeatId());
        ticket.setScheduleId(ticketWithPaymentRequest.getScheduleId());
        ticket.setPrice(price);
        ticket.setDate(new Date());

        log.info("NEW TICKET (with payment): {}", ticket);

        ticketDAO.createOneTicket(ticket);
        NotificationRequest notificationRequest = new NotificationRequest(
                ticket.getTicketId(),
                "Ticket Purchased Successfully",
                String.format("Dear %s, your ticket for the movie '%s' has been successfully booked with payment confirmed. " +
                        "The price is '%s'. The start time is '%s'. Enjoy the movie!",
                        username, movieName, price, startTime)
        );

        rabbitMqMessageProducer.publish(
                notificationRequest,
                "internal.exchange",
                "internal.notification.routing-key"
        );
    }

    public void updateTicket(Long ticketId, TicketUpdateRequest ticketUpdateRequest) {
       //auth
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new HandleRuntimeException("Unauthorized user. Please login before proceeding.");
        }
        String username = (String) authentication.getPrincipal();
        Ticket ticket = ticketDAO.selectTicketById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket with [%s] not found.".formatted(ticketId)));

        Long oldSeatId = ticket.getSeatId();
        Long effectiveMovieId = ticketUpdateRequest.movieId() != null ? ticketUpdateRequest.movieId() : ticket.getMovieId();
        String movieName = movieClient.getMovieNameById(effectiveMovieId);

        if (!ticket.getScheduleId().equals(ticketUpdateRequest.scheduleId())) {
            throw new IllegalArgumentException("Schedule ID cannot be changed.");
        }

        boolean changes = false;

        if (ticketUpdateRequest.movieId() != null && !ticketUpdateRequest.movieId().equals(ticket.getMovieId())) {
            ticket.setMovieId(ticketUpdateRequest.movieId());
            changes = true;
        }

        if (ticketUpdateRequest.cinemaId() != null && !ticketUpdateRequest.cinemaId().equals(ticket.getCinemaId())) {
            ticket.setCinemaId(ticketUpdateRequest.cinemaId());
            changes = true;
        }

        if (ticketUpdateRequest.seatId() != null && !ticketUpdateRequest.seatId().equals(ticket.getSeatId())) {
            SeatDTO seatDTO = seatClient.getSeatById(ticketUpdateRequest.seatId());
            if (seatDTO == null) {
                throw new ResourceNotFoundException("Seat not found.");
            }
            if (isSeatReservedForSchedule(ticket.getScheduleId(), ticketUpdateRequest.seatId())) {
                throw new AlreadyOccupiedException("The selected seat is already reserved for this showtime.");
            }
            ticket.setSeatId(ticketUpdateRequest.seatId());
            changes = true;
        }

        Long effectiveCinemaId = ticketUpdateRequest.cinemaId() != null ? ticketUpdateRequest.cinemaId() : ticket.getCinemaId();
        Long effectiveSeatId = ticketUpdateRequest.seatId() != null ? ticketUpdateRequest.seatId() : ticket.getSeatId();
        boolean isSeatValid = seatClient.getSeatsByCinema(effectiveCinemaId)
                .stream()
                .anyMatch(seat -> seat.seatId().equals(effectiveSeatId));

        if (!isSeatValid) {
            throw new IllegalArgumentException("Invalid seatId for the provided cinemaId.");
        }

        if (ticketUpdateRequest.price() != null && !ticketUpdateRequest.price().equals(ticket.getPrice())) {
            ticket.setPrice(ticketUpdateRequest.price());
            changes = true;
        }

        if (ticketUpdateRequest.date() != null && !ticketUpdateRequest.date().equals(ticket.getDate())) {
            ticket.setDate(ticketUpdateRequest.date());
            changes = true;
        }

        if (!changes) {
            throw new ResourceNotFoundException("No changes were made.");
        }

        ticketDAO.updateTicket(ticket);

        NotificationRequest notificationRequest = new NotificationRequest(
                ticket.getTicketId(),
                "Ticket Changed Successfully",
                String.format("Dear %s, your ticket for the movie '%s' has been successfully changed.", username, movieName)
        );

        rabbitMqMessageProducer.publish(
                notificationRequest,
                "internal.exchange",
                "internal.notification.routing-key"
        );
    }

    public void deleteTicket(Long ticketId) {
        if (!ticketDAO.existTicketWithId(ticketId)) {
            throw new ResourceNotFoundException(
                    "Ticket with id [%s] not found.".formatted(ticketId));
        }
        ticketDAO.deleteTicket(ticketId);
        }
    }

