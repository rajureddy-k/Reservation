package com.movie.ticket.ticket;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author DMITRII LEVKIN on 24/12/2024
 * @project Movie-Reservation-System
 */
@Slf4j
@RestController
@RequestMapping(path = "api/v1/ticket")
public class TicketController {
    private static final Logger log = LoggerFactory.getLogger(TicketController.class);

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<?> getAllTickets(){
        List<TicketDTO> ticketDTO = ticketService.getAllTickets();
        return ResponseEntity.ok(ticketDTO);
    }
    @GetMapping("/myTickets")
    public ResponseEntity<?> getTicketsForAuthenticatedUser(){
        List<TicketDTO> ticketDTO = ticketService.getTicketsForAuthenticatedUser();
        return ResponseEntity.ok(ticketDTO);
    }

    @GetMapping("/schedule/{scheduleId}/seat-ids")
    public ResponseEntity<List<Long>> getReservedSeatIds(@PathVariable Long scheduleId) {
        List<Long> reservedSeatIds = ticketService.getReservedSeatIdsBySchedule(scheduleId);
        return ResponseEntity.ok(reservedSeatIds);
    }

    @PostMapping
    public ResponseEntity<?> createTicket(@Valid @RequestBody TicketRegistrationRequest ticketRegistrationRequest,
                                               BindingResult bindingResult) {
        List<String> errorMessage= new ArrayList<>();
        if (bindingResult.hasErrors()) {
            for (ObjectError error : bindingResult.getAllErrors()) {
                errorMessage.add(error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errorMessage);
        }

     ticketService.createTicket(ticketRegistrationRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/with-payment")
    public ResponseEntity<?> createTicketWithPayment(@Valid @RequestBody TicketWithPaymentRequest ticketWithPaymentRequest,
                                                      BindingResult bindingResult) {
        List<String> errorMessage = new ArrayList<>();
        if (bindingResult.hasErrors()) {
            for (ObjectError error : bindingResult.getAllErrors()) {
                errorMessage.add(error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errorMessage);
        }

        ticketService.createTicketWithPayment(ticketWithPaymentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{ticketId}")
        public ResponseEntity<?> updateTicket(@PathVariable("ticketId") Long ticketId,@RequestBody TicketUpdateRequest ticketUpdateRequest,
                                              BindingResult bindingResult){
        log.info("Update ticket: {} " ,ticketUpdateRequest);
        List<String> errorMessage= new ArrayList<>();
        if (bindingResult.hasErrors()) {
            for (ObjectError error : bindingResult.getAllErrors()) {
                errorMessage.add(error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errorMessage);
        }
        ticketService.updateTicket(ticketId,ticketUpdateRequest);
        return  ResponseEntity.ok().build();
    }

    @DeleteMapping ("/{ticketId}")
    public ResponseEntity<?> deleteTicket(@PathVariable("ticketId") Long ticketId){
        ticketService.deleteTicket(ticketId);
        return  ResponseEntity.ok().build();
    };
}
