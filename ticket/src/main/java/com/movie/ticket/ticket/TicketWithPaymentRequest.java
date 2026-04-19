package com.movie.ticket.ticket;

import jakarta.validation.constraints.*;

public class TicketWithPaymentRequest {

    @NotNull(message = "MovieId id is required")
    private Long movieId;

    @NotNull(message = "CinemaId id is required")
    private Long cinemaId;

    @NotNull(message = "Seat id is required")
    private Long seatId;

    @NotNull(message = "ScheduleId id is required")
    private Long scheduleId;

    // Payment details
    @NotBlank(message = "Card number is required")
    private String cardNumber;

    @NotNull(message = "Expiration month is required")
    @Min(1)
    @Max(12)
    private Integer expMonth;

    @NotNull(message = "Expiration year is required")
    @Min(2025)
    private Integer expYear;

    @NotBlank(message = "CVC is required")
    @Size(min = 3, max = 4, message = "CVC must be 3-4 digits")
    private String cvc;

    public TicketWithPaymentRequest() {}

    public TicketWithPaymentRequest(Long movieId, Long cinemaId, Long seatId, Long scheduleId,
                                    String cardNumber, Integer expMonth, Integer expYear, String cvc) {
        this.movieId = movieId;
        this.cinemaId = cinemaId;
        this.seatId = seatId;
        this.scheduleId = scheduleId;
        this.cardNumber = cardNumber;
        this.expMonth = expMonth;
        this.expYear = expYear;
        this.cvc = cvc;
    }

    // Getters and Setters
    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public Long getCinemaId() { return cinemaId; }
    public void setCinemaId(Long cinemaId) { this.cinemaId = cinemaId; }

    public Long getSeatId() { return seatId; }
    public void setSeatId(Long seatId) { this.seatId = seatId; }

    public Long getScheduleId() { return scheduleId; }
    public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public Integer getExpMonth() { return expMonth; }
    public void setExpMonth(Integer expMonth) { this.expMonth = expMonth; }

    public Integer getExpYear() { return expYear; }
    public void setExpYear(Integer expYear) { this.expYear = expYear; }

    public String getCvc() { return cvc; }
    public void setCvc(String cvc) { this.cvc = cvc; }
}
