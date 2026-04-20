package com.movie.seats.seat;

import com.movie.exceptions.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * @author DMITRII LEVKIN on 26/09/2024
 * @project MovieReservationSystem
 */
@Repository("seatJdbc")
@Slf4j
public class SeatAccessService implements SeatDAO{

    private  final JdbcTemplate jdbcTemplate;

    private final DataSource dataSource;
    private final SeatRowMapper seatRowMapper;

    public SeatAccessService(JdbcTemplate jdbcTemplate, DataSource dataSource, SeatRowMapper seatRowMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.dataSource = dataSource;
        this.seatRowMapper = seatRowMapper;
    }


    @Override
    public List<Seat> selectAllSeats() {

        var sql= """
                SELECT seat_id,seat_number,row,type,cinema_id,schedule_id,is_occupied
                FROM seats
                
                """;
        return jdbcTemplate.query(sql,seatRowMapper);
    }



    @Override
    public Optional<Seat> selectSeatById(Long seatId) {
        var sql= """
                SELECT * FROM seats WHERE seat_id = ?
                
                """;
        try {
            Seat seat = jdbcTemplate.queryForObject(sql, seatRowMapper, seatId);
            return Optional.ofNullable(seat);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public void insertSeat(Seat seat) {
        var sql = """
        INSERT INTO seats (seat_number, row, type, cinema_id, schedule_id, is_occupied) VALUES (?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql, seat.getSeatNumber(), seat.getRow(), seat.getType(), seat.getCinemaId(), seat.getScheduleId(), seat.isOccupied());

    }



    @Override

    public List<Seat> selectSeatsByCinemaId(Long cinemaId) {
        // Only return template seats (seats not associated with any specific schedule)
        // These are the cinema's "default" seats that are copied when creating seats for a new schedule
        var sql = """
                SELECT seat_id, seat_number, row, type,cinema_id,schedule_id,is_occupied
                FROM seats
                WHERE cinema_id = ? AND schedule_id IS NULL
                """;
        return jdbcTemplate.query(sql, seatRowMapper, cinemaId);
    }

    @Override
    public List<Seat> selectSeatsByScheduleId(Long scheduleId) {
        var sql = """
                SELECT seat_id, seat_number, row, type, cinema_id, schedule_id, is_occupied
                FROM seats
                WHERE schedule_id = ?
                """;
        return jdbcTemplate.query(sql, seatRowMapper, scheduleId);
    }

    @Override
    public int countSeatsByCinemaId(Long cinemaId) {
        // Only count template seats (seats not associated with any specific schedule)
        // This ensures correct available seats count when creating new schedules
        var sql = """
                SELECT COUNT(*) FROM seats WHERE cinema_id = ? AND schedule_id IS NULL
                """;

        try (Connection connection = dataSource.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

            preparedStatement.setLong(1, cinemaId);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt(1);
            }
        } catch (SQLException e) {

            e.printStackTrace();
        }

        return 0;

    }

    @Override
    public int countSeatsByScheduleId(Long scheduleId) {
        var sql = """
                SELECT COUNT(*) FROM seats WHERE schedule_id = ?
                """;

        try (Connection connection = dataSource.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

            preparedStatement.setLong(1, scheduleId);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return resultSet.getInt(1);
            }
        } catch (SQLException e) {

            e.printStackTrace();
        }

        return 0;

    }

    @Override
    public void deleteSeatsById(Long movieId) {
        var sql = """
                    DELETE FROM seats where seat_id = ?
                    """;
        int res = jdbcTemplate.update(sql,movieId);
        System.out.println("Delete seat: " + res);
    }

    @Override
    public boolean existSeatWithId(Long movieId) {
        var sql= """
                SELECT count(seat_id)FROM seats
               where seat_id=?
               """;
        Integer count = jdbcTemplate.queryForObject(sql,Integer.class,movieId);
        return count!=null && count>0;
    }


    @Override
    public boolean isSeatOccupied(Long seatId) {
        var sql = """
            SELECT is_occupied FROM seats WHERE seat_id = ?
            """;

        Boolean isOccupied = jdbcTemplate.queryForObject(sql, Boolean.class, seatId);
        if (isOccupied == null) {
            throw new ResourceNotFoundException("Seat with id [" + seatId + "] not found");
        }
            return isOccupied;

        }

    @Override
    public void updateSeat(Seat updateSeat) {
        if(updateSeat.getSeatNumber()!=null){
            var sql = """
                    UPDATE seats SET seat_number=? where seat_id=?
                    """;
        jdbcTemplate.update(sql,updateSeat.getSeatNumber(),updateSeat.getSeatId());
        }

        if(updateSeat.getRow()!=null){
            var sql = """
                    UPDATE seats SET row=? where seat_id=?
                    """;
            jdbcTemplate.update(sql,updateSeat.getRow(),updateSeat.getSeatId());
        }

        if(updateSeat.getType()!=null){
            var sql = """
                    UPDATE seats SET type=? where seat_id=?
                    """;
            jdbcTemplate.update(sql,updateSeat.getType(),updateSeat.getSeatId());
        }

        if(updateSeat.getCinemaId()!=null){
            var sql = """
                    UPDATE seats SET cinema_id=? where seat_id=?
                    """;
            jdbcTemplate.update(sql,updateSeat.getCinemaId(),updateSeat.getSeatId());
        }

        if(updateSeat.getScheduleId()!=null){
            var sql = """
                    UPDATE seats SET schedule_id=? where seat_id=?
                    """;
            jdbcTemplate.update(sql,updateSeat.getScheduleId(),updateSeat.getSeatId());
        }

        // occupied is boolean and don t need to check for null
            var sql = """
                UPDATE seats SET is_occupied=? WHERE seat_id=?
                """;
            jdbcTemplate.update(sql, updateSeat.isOccupied(), updateSeat.getSeatId());
        }


}
