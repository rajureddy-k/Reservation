package com.movie.schedules.movieschedules;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

/**
 * @author DMITRII LEVKIN on 01/10/2024
 * @project MovieReservationSystem
 */
@Entity
@Table(name = "schedules")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieSchedule {
    @Id
    @SequenceGenerator(
            name = "schedule_id_seq",
            sequenceName = "schedule_id_seq"
    )
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long scheduleId;
    @NotNull
    @Column(nullable = false)
    private LocalDate date;
    @NotNull
    @Column(nullable = false)
    private LocalTime startTime;
    @NotNull
    @Column(nullable = false)
    private LocalTime endTime;
    @NotNull
    @Column(name = "available_seats")
    private Integer availableSeats;
    @Column(name = "cinema_id")
    private Long cinemaId;
    @Column(name = "movie_id")
    private Long movieId;

    public MovieSchedule() {
    }

    public MovieSchedule(Long scheduleId, LocalDate date, LocalTime startTime, LocalTime endTime, Integer availableSeats, Long cinemaId, Long movieId) {
        this.scheduleId = scheduleId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.availableSeats = availableSeats;
        this.cinemaId = cinemaId;
        this.movieId = movieId;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Long getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Long cinemaId) {
        this.cinemaId = cinemaId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public static MovieScheduleBuilder builder() {
        return new MovieScheduleBuilder();
    }

    public static class MovieScheduleBuilder {
        private Long scheduleId;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        private Integer availableSeats;
        private Long cinemaId;
        private Long movieId;

        public MovieScheduleBuilder scheduleId(Long scheduleId) {
            this.scheduleId = scheduleId;
            return this;
        }

        public MovieScheduleBuilder date(LocalDate date) {
            this.date = date;
            return this;
        }

        public MovieScheduleBuilder startTime(LocalTime startTime) {
            this.startTime = startTime;
            return this;
        }

        public MovieScheduleBuilder endTime(LocalTime endTime) {
            this.endTime = endTime;
            return this;
        }

        public MovieScheduleBuilder availableSeats(Integer availableSeats) {
            this.availableSeats = availableSeats;
            return this;
        }

        public MovieScheduleBuilder cinemaId(Long cinemaId) {
            this.cinemaId = cinemaId;
            return this;
        }

        public MovieScheduleBuilder movieId(Long movieId) {
            this.movieId = movieId;
            return this;
        }

        public MovieSchedule build() {
            return new MovieSchedule(scheduleId, date, startTime, endTime, availableSeats, cinemaId, movieId);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MovieSchedule that = (MovieSchedule) o;
        return Objects.equals(scheduleId, that.scheduleId) && Objects.equals(date, that.date) && Objects.equals(startTime, that.startTime) && Objects.equals(endTime, that.endTime) && Objects.equals(availableSeats, that.availableSeats) && Objects.equals(cinemaId, that.cinemaId) && Objects.equals(movieId, that.movieId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(scheduleId, date, startTime, endTime, availableSeats, cinemaId, movieId);
    }
}
