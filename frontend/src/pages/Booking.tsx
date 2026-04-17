import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import { Movie, Schedule, Seat, Cinema } from '../types';
import { scheduleService } from '../services/schedule.service';
import { seatService } from '../services/seat.service';
import { cinemaService } from '../services/cinema.service';
import { ticketService } from '../services/ticket.service';
import { Button } from '../components/Button';

interface BookingProps {
  movie: Movie;
  onBack: () => void;
  onBookingSuccess: () => void;
}

export function Booking({ movie, onBack, onBookingSuccess }: BookingProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [schedulesData, cinemasData] = await Promise.all([
        scheduleService.getAll(),
        cinemaService.getAll(),
      ]);

      const movieSchedules = schedulesData.filter((s) => s.movieId === movie.movieId);
      setSchedules(movieSchedules);
      setCinemas(cinemasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load booking data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSeatsForCinema = async (cinemaId: number) => {
    try {
      const seatsData = await seatService.getByCinema(cinemaId);
      setSeats(seatsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load seats');
      setSeats([]);
    }
  };

  const handleBooking = async () => {
    if (!selectedSchedule || !selectedSeat) return;

    try {
      setIsBooking(true);
      await ticketService.create({
        scheduleId: selectedSchedule.scheduleId,
        seatId: selectedSeat.seatId,
        movieId: movie.movieId,
        cinemaId: selectedSchedule.cinemaId,
      });
      onBookingSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const availableSeats = selectedSchedule
    ? seats.filter((s) => !s.isOccupied)
    : [];

  const getCinemaName = (id: number) => cinemas.find((cinema) => cinema.cinemaId === id)?.cinemaName || `Cinema ${id}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Movies</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{movie.movieName}</h1>
        <p className="text-gray-600">{movie.description}</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Showtime</h2>

          {schedules.length === 0 ? (
            <p className="text-gray-500">No showtimes available</p>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule) => {
                const scheduleDateTime = new Date(`${schedule.date}T${schedule.startTime}`);

                return (
                  <button
                    key={schedule.scheduleId}
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      setSelectedSeat(null);
                      loadSeatsForCinema(schedule.cinemaId);
                    }}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedSchedule?.scheduleId === schedule.scheduleId
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">
                            {scheduleDateTime.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Clock className="w-4 h-4" />
                          <span>
                            {scheduleDateTime.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <MapPin className="w-4 h-4" />
                          <span>{getCinemaName(schedule.cinemaId)}</span>
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm font-medium">
                        {schedule.availableSeats} seats left
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Seat</h2>

          {!selectedSchedule ? (
            <p className="text-gray-500">Please select a showtime first</p>
          ) : availableSeats.length === 0 ? (
            <p className="text-gray-500">
              {selectedSchedule?.availableSeats > 0
                ? `No available seat inventory loaded for ${getCinemaName(selectedSchedule.cinemaId)} yet, but ${selectedSchedule.availableSeats} seats remain.`
                : 'No seats available for this showtime'}
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {availableSeats.map((seat) => (
                  <button
                    key={seat.seatId}
                    onClick={() => setSelectedSeat(seat)}
                    className={`p-3 rounded-lg border-2 transition-all font-medium ${
                      selectedSeat?.seatId === seat.seatId
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    {seat.row}
                    {seat.seatNumber}
                  </button>
                ))}
              </div>

              {selectedSeat && selectedSchedule && (
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Seat:</span>
                      <span className="font-medium">
                        {selectedSeat.row}
                        {selectedSeat.seatNumber}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Showtime:</span>
                      <span className="font-medium">
                        {new Date(`${selectedSchedule.date}T${selectedSchedule.startTime}`).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' - '}
                        {new Date(`${selectedSchedule.date}T${selectedSchedule.endTime}`).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleBooking}
                    isLoading={isBooking}
                    className="w-full"
                  >
                    Confirm Booking
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
