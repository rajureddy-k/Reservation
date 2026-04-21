
CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    seat_number INTEGER NOT NULL,
    row VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL,
    cinema_id BIGINT,
    schedule_id BIGINT,  -- Allow NULL for template seats
    is_occupied BOOLEAN DEFAULT false
);

-- Create index on schedule_id for better query performance
CREATE INDEX idx_seats_schedule_id ON seats(schedule_id);

-- Add a unique constraint on (schedule_id, seat_number, row) to prevent duplicate seats in the same schedule
ALTER TABLE seats ADD CONSTRAINT unique_seat_per_schedule UNIQUE(schedule_id, seat_number, row);