package com.movie.seats.seat;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * @author DMITRII LEVKIN on 26/09/2024
 * @project MovieReservationSystem
 */
public interface SeatDAO {
    List<Seat> selectAllSeats();
    Optional<Seat> selectSeatById(Long seatId);

    void insertSeat(Seat seat);

    boolean isSeatOccupied(Long seatId);


    void  updateSeat(Seat updateSeat);

    List<Seat> selectSeatsByCinemaId(Long cinemaId);

    List<Seat> selectSeatsByScheduleId(Long scheduleId);

    int countSeatsByCinemaId(Long cinemaId);

    int countSeatsByScheduleId(Long scheduleId);

    void deleteSeatsById(Long seatId);

    boolean  existSeatWithId(Long seatId);
}
