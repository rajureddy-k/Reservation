package com.movie.movie.movie;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;

/**
 * @author DMITRII LEVKIN on 30/09/2024
 * @project MovieReservationSystem
 */

@Entity
@Table(name = "movies",
        uniqueConstraints = {
                @UniqueConstraint(name = "movie_movieName_unique",
                        columnNames = "movieName")
        })
public class Movie {

    @Id
    @SequenceGenerator(
            name = "movies_id_seq",
            sequenceName = "movies_id_seq"
    )
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(
            nullable = false
    )
    private Long movieId;
    @NotNull
    @Column(
            nullable = false
    )
    private String movieName;
    @NotNull
    @Column(
            nullable = false
    )
    private Integer year;
    @NotNull
    @Column(
            nullable = false
    )
    private String country;
    @NotNull
    @Column(
            nullable = false
    )
    private String genre;
    @NotNull
    @Column(
            nullable = false
    )
    private String description;

    // Constructors
    public Movie() {
    }

    public Movie(Long movieId, String movieName, Integer year, String country, String genre, String description) {
        this.movieId = movieId;
        this.movieName = movieName;
        this.year = year;
        this.country = country;
        this.genre = genre;
        this.description = description;
    }

    // Getters
    public Long getMovieId() {
        return movieId;
    }

    public String getMovieName() {
        return movieName;
    }

    public Integer getYear() {
        return year;
    }

    public String getCountry() {
        return country;
    }

    public String getGenre() {
        return genre;
    }

    public String getDescription() {
        return description;
    }

    // Setters
    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Movie{" +
                "movieId=" + movieId +
                ", movieName='" + movieName + '\'' +
                ", year=" + year +
                ", country='" + country + '\'' +
                ", genre='" + genre + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Movie movie = (Movie) o;
        return Objects.equals(movieId, movie.movieId) && Objects.equals(movieName, movie.movieName) && Objects.equals(year, movie.year) && Objects.equals(country, movie.country) && Objects.equals(genre, movie.genre) && Objects.equals(description, movie.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(movieId, movieName, year, country, genre, description);
    }

    // Builder pattern
    public static MovieBuilder builder() {
        return new MovieBuilder();
    }

    public static class MovieBuilder {
        private Long movieId;
        private String movieName;
        private Integer year;
        private String country;
        private String genre;
        private String description;

        public MovieBuilder movieId(Long movieId) {
            this.movieId = movieId;
            return this;
        }

        public MovieBuilder movieName(String movieName) {
            this.movieName = movieName;
            return this;
        }

        public MovieBuilder year(Integer year) {
            this.year = year;
            return this;
        }

        public MovieBuilder country(String country) {
            this.country = country;
            return this;
        }

        public MovieBuilder genre(String genre) {
            this.genre = genre;
            return this;
        }

        public MovieBuilder description(String description) {
            this.description = description;
            return this;
        }

        public Movie build() {
            return new Movie(movieId, movieName, year, country, genre, description);
        }
    }
}
