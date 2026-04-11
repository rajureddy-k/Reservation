package com.movie.ticket.ticket;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

/**
 * @author DMITRII LEVKIN on 24/12/2024
 * @project Movie-Reservation-System
 */
@Entity
@Table(name = "ticket")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
    @Id
    @SequenceGenerator(
            name = "ticket_id_seq",
            sequenceName = "ticket_id_seq"
    )
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long ticketId;
    @NotNull
    @Column(
            nullable = false
    )
    private Long userId;
    @NotNull
    @Column(
            nullable = false
    )
    private Long movieId;
    @NotNull
    @Column(
            nullable = false
    )
    private Long cinemaId;
    @NotNull
    @Column(
            nullable = false
    )
    private Long seatId;
    @NotNull
    @Column(
            nullable = false
    )
    private Long scheduleId;
    @NotNull
    @Column(
            nullable = false
    )
    private BigDecimal price;
    @NotNull
    @Column(
            nullable = false
    )
    private Date date;

    public Ticket() {
    }

    public Ticket(Long ticketId, Long userId, Long movieId, Long cinemaId, Long seatId, Long scheduleId, BigDecimal price, Date date) {
        this.ticketId = ticketId;
        this.userId = userId;
        this.movieId = movieId;
        this.cinemaId = cinemaId;
        this.seatId = seatId;
        this.scheduleId = scheduleId;
        this.price = price;
        this.date = date;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public Long getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Long cinemaId) {
        this.cinemaId = cinemaId;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public static TicketBuilder builder() {
        return new TicketBuilder();
    }

    public static class TicketBuilder {
        private Long ticketId;
        private Long userId;
        private Long movieId;
        private Long cinemaId;
        private Long seatId;
        private Long scheduleId;
        private BigDecimal price;
        private Date date;

        public TicketBuilder ticketId(Long ticketId) {
            this.ticketId = ticketId;
            return this;
        }

        public TicketBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public TicketBuilder movieId(Long movieId) {
            this.movieId = movieId;
            return this;
        }

        public TicketBuilder cinemaId(Long cinemaId) {
            this.cinemaId = cinemaId;
            return this;
        }

        public TicketBuilder seatId(Long seatId) {
            this.seatId = seatId;
            return this;
        }

        public TicketBuilder scheduleId(Long scheduleId) {
            this.scheduleId = scheduleId;
            return this;
        }

        public TicketBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public TicketBuilder date(Date date) {
            this.date = date;
            return this;
        }

        public Ticket build() {
            return new Ticket(ticketId, userId, movieId, cinemaId, seatId, scheduleId, price, date);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Ticket ticket = (Ticket) o;
        return Objects.equals(ticketId, ticket.ticketId) && Objects.equals(userId, ticket.userId) && Objects.equals(movieId, ticket.movieId) && Objects.equals(cinemaId, ticket.cinemaId) && Objects.equals(seatId, ticket.seatId) && Objects.equals(scheduleId, ticket.scheduleId) && Objects.equals(price, ticket.price) && Objects.equals(date, ticket.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ticketId, userId, movieId, cinemaId, seatId, scheduleId, price, date);
    }
}
