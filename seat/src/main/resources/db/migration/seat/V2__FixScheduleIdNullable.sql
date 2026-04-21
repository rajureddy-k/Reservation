-- Fix schedule_id to allow NULL values for template seats
ALTER TABLE seats ALTER COLUMN schedule_id DROP NOT NULL;

-- Drop the existing unique constraint that includes schedule_id
ALTER TABLE seats DROP CONSTRAINT IF EXISTS unique_seat_per_schedule;

-- Create a new unique constraint that allows NULL schedule_id for template seats
-- Template seats (schedule_id IS NULL) can have duplicates across cinemas
-- Schedule-specific seats must be unique within their schedule
ALTER TABLE seats ADD CONSTRAINT unique_seat_per_schedule_or_template
    UNIQUE(schedule_id, seat_number, row, cinema_id);
