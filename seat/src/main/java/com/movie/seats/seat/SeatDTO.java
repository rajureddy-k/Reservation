package com.movie.seats.seat;

/**
 * @author DMITRII LEVKIN on 26/09/2024
 * @project MovieReservationSystem
 */
public record SeatDTO(
        Long seatId,
        Integer seatNumber,
        String row,
        String type,
        Long cinemaId,
        Boolean isOccupied

) { }
