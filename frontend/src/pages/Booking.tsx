import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';
import { Movie, Schedule, Seat } from '../types';
import { scheduleService } from '../services/schedule.service';
import { seatService } from '../services/seat.service';
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
      const [schedulesData, seatsData] = await Promise.all([
        scheduleService.getAll(),
        seatService.getAll(),
      ]);

      const movieSchedules = schedulesData.filter((s) => s.movieId === movie.id);
      setSchedules(movieSchedules);
      setSeats(seatsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load booking data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSchedule || !selectedSeat) return;

    try {
      setIsBooking(true);
      await ticketService.create({
        scheduleId: selectedSchedule.id,
        seatId: selectedSeat.id,
      });
      onBookingSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const availableSeats = selectedSchedule
    ? seats.filter((s) => s.cinemaId === selectedSchedule.cinemaId && s.isAvailable)
    : [];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{movie.title}</h1>
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
              {schedules.map((schedule) => (
                <button
                  key={schedule.id}
                  onClick={() => {
                    setSelectedSchedule(schedule);
                    setSelectedSeat(null);
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedSchedule?.id === schedule.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {new Date(schedule.startTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(schedule.startTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <MapPin className="w-4 h-4" />
                        <span>Cinema {schedule.cinemaId}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600 font-bold">
                      <DollarSign className="w-5 h-5" />
                      <span>{schedule.price}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Seat</h2>

          {!selectedSchedule ? (
            <p className="text-gray-500">Please select a showtime first</p>
          ) : availableSeats.length === 0 ? (
            <p className="text-gray-500">No seats available for this showtime</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {availableSeats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => setSelectedSeat(seat)}
                    className={`p-3 rounded-lg border-2 transition-all font-medium ${
                      selectedSeat?.id === seat.id
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    {seat.rowNumber}
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
                        {selectedSeat.rowNumber}
                        {selectedSeat.seatNumber}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Price:</span>
                      <span className="font-medium">${selectedSchedule.price}</span>
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
