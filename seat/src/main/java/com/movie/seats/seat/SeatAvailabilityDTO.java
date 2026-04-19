package com.movie.seats.seat;

/**
 * @author GitHub Copilot
 */
public record SeatAvailabilityDTO(
        Long seatId,
        Integer seatNumber,
        String row,
        String type,
        Long cinemaId,
        boolean isReserved
) {
}
