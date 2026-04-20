package com.movie.seats.seat;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * @author DMITRII LEVKIN on 25/09/2024
 * @project MovieReservationSystem
 */
@Entity
@Table(name = "seats")
public class Seat {
    @Id
    @SequenceGenerator(
            name = "seats_id_seq",
            sequenceName = "seats_id_seq"
    )
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long seatId;
    @NotNull
    @Column(
            nullable = false
    )
    private Integer seatNumber;
    @NotNull
    @Column(
            nullable = false
    )

    private String row;
    @NotNull
    @Column(
            nullable = false
    )

    private String type;

    @Column(name = "cinema_id")
    private Long cinemaId;

    @Column(name = "schedule_id")
    private Long scheduleId;

    @Column(name = "is_occupied")
    private boolean isOccupied;

    // Constructors
    public Seat() {
    }

    public Seat(Long seatId, Integer seatNumber, String row, String type, Long cinemaId, Long scheduleId, boolean isOccupied) {
        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.row = row;
        this.type = type;
        this.cinemaId = cinemaId;
        this.scheduleId = scheduleId;
        this.isOccupied = isOccupied;
    }

    // Getters
    public Long getSeatId() {
        return seatId;
    }

    public Integer getSeatNumber() {
        return seatNumber;
    }

    public String getRow() {
        return row;
    }

    public String getType() {
        return type;
    }

    public Long getCinemaId() {
        return cinemaId;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public boolean isOccupied() {
        return isOccupied;
    }

    // Setters
    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public void setSeatNumber(Integer seatNumber) {
        this.seatNumber = seatNumber;
    }

    public void setRow(String row) {
        this.row = row;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setCinemaId(Long cinemaId) {
        this.cinemaId = cinemaId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public void setOccupied(boolean occupied) {
        isOccupied = occupied;
    }

    @Override
    public String toString() {
        return "Seat{" +
                "seatId=" + seatId +
                ", seatNumber=" + seatNumber +
                ", row='" + row + '\'' +
                ", type='" + type + '\'' +
                ", cinemaId=" + cinemaId +
                ", scheduleId=" + scheduleId +
                ", isOccupied=" + isOccupied +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Seat seat = (Seat) o;
        return Objects.equals(seatId, seat.seatId) && Objects.equals(seatNumber, seat.seatNumber) && Objects.equals(row, seat.row) && Objects.equals(type, seat.type) && Objects.equals(cinemaId, seat.cinemaId) && Objects.equals(scheduleId, seat.scheduleId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(seatId, seatNumber, row, type, cinemaId, scheduleId);
    }

    // Builder pattern
    public static SeatBuilder builder() {
        return new SeatBuilder();
    }

    public static class SeatBuilder {
        private Long seatId;
        private Integer seatNumber;
        private String row;
        private String type;
        private Long cinemaId;
        private Long scheduleId;
        private boolean isOccupied;

        public SeatBuilder seatId(Long seatId) {
            this.seatId = seatId;
            return this;
        }

        public SeatBuilder seatNumber(Integer seatNumber) {
            this.seatNumber = seatNumber;
            return this;
        }

        public SeatBuilder row(String row) {
            this.row = row;
            return this;
        }

        public SeatBuilder type(String type) {
            this.type = type;
            return this;
        }

        public SeatBuilder cinemaId(Long cinemaId) {
            this.cinemaId = cinemaId;
            return this;
        }

        public SeatBuilder scheduleId(Long scheduleId) {
            this.scheduleId = scheduleId;
            return this;
        }

        public SeatBuilder isOccupied(boolean isOccupied) {
            this.isOccupied = isOccupied;
            return this;
        }

        public Seat build() {
            return new Seat(seatId, seatNumber, row, type, cinemaId, scheduleId, isOccupied);
        }
    }

}