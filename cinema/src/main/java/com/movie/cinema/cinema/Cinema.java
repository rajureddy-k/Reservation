package com.movie.cinema.cinema;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;


/**
 * @author DMITRII LEVKIN on 24/09/2024
 * @project MovieReservationSystem
 */

@Entity
@Table(name = "cinemas"
        , uniqueConstraints = {
        @UniqueConstraint(name = "cinema_name_unique",
                columnNames = "cinemaName")})
public class Cinema {

    @Id
    @SequenceGenerator(
            name = "cinemas_id_seq",
            sequenceName = "cinemas_id_seq"
    )
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long cinemaId;
    @NotNull
    @Column(
            nullable = false
    )
    private String cinemaName;
    @NotNull
    @Column(
            nullable = false
    )
    private String cinemaLocation;

    // Constructors
    public Cinema() {
    }

    public Cinema(Long cinemaId, String cinemaName, String cinemaLocation) {
        this.cinemaId = cinemaId;
        this.cinemaName = cinemaName;
        this.cinemaLocation = cinemaLocation;
    }

    // Getters
    public Long getCinemaId() {
        return cinemaId;
    }

    public String getCinemaName() {
        return cinemaName;
    }

    public String getCinemaLocation() {
        return cinemaLocation;
    }

    // Setters
    public void setCinemaId(Long cinemaId) {
        this.cinemaId = cinemaId;
    }

    public void setCinemaName(String cinemaName) {
        this.cinemaName = cinemaName;
    }

    public void setCinemaLocation(String cinemaLocation) {
        this.cinemaLocation = cinemaLocation;
    }

    @Override
    public String toString() {
        return "Cinema{" +
                "cinemaId=" + cinemaId +
                ", cinemaName='" + cinemaName + '\'' +
                ", cinemaLocation='" + cinemaLocation + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cinema cinema = (Cinema) o;
        return Objects.equals(cinemaId, cinema.cinemaId) && Objects.equals(cinemaName, cinema.cinemaName) && Objects.equals(cinemaLocation, cinema.cinemaLocation);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cinemaId, cinemaName, cinemaLocation);
    }

    // Builder pattern
    public static CinemaBuilder builder() {
        return new CinemaBuilder();
    }

    public static class CinemaBuilder {
        private Long cinemaId;
        private String cinemaName;
        private String cinemaLocation;

        public CinemaBuilder cinemaId(Long cinemaId) {
            this.cinemaId = cinemaId;
            return this;
        }

        public CinemaBuilder cinemaName(String cinemaName) {
            this.cinemaName = cinemaName;
            return this;
        }

        public CinemaBuilder cinemaLocation(String cinemaLocation) {
            this.cinemaLocation = cinemaLocation;
            return this;
        }

        public Cinema build() {
            return new Cinema(cinemaId, cinemaName, cinemaLocation);
        }
    }
}
