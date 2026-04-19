import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Movie, Schedule, SeatAvailability, Cinema } from '../types';
import { scheduleService } from '../services/schedule.service';
import { seatService } from '../services/seat.service';
import { cinemaService } from '../services/cinema.service';
import { paymentService } from '../services/payment.service';
import { ticketService } from '../services/ticket.service';
import { Button } from '../components/Button';
import { CheckoutModal } from '../components/CheckoutModal';

interface BookingProps {
  movie: Movie;
  onBack: () => void;
  onBookingSuccess: () => void;
}

export function Booking({ movie, onBack, onBookingSuccess }: BookingProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [seats, setSeats] = useState<SeatAvailability[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<SeatAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [seatPrice, setSeatPrice] = useState(0);

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

  const loadSeatsForSchedule = async (scheduleId: number) => {
    try {
      const seatsData = await seatService.getBySchedule(scheduleId);
      setSeats(seatsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load seats');
      setSeats([]);
    }
  };

  const handlePaymentSuccess = async (cardDetails: {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  }) => {
    if (!selectedSchedule || !selectedSeat) return;

    try {
      setIsProcessing(true);
      setPaymentError('');
      
      await paymentService.createTicketWithPayment({
        scheduleId: selectedSchedule.scheduleId,
        seatId: selectedSeat.seatId,
        movieId: movie.movieId,
        cinemaId: selectedSchedule.cinemaId,
        ...cardDetails,
      });

      setTimeout(() => {
        setCheckoutModalOpen(false);
        onBookingSuccess();
      }, 3000);
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenCheckout = async () => {
    if (!selectedSchedule || !selectedSeat) return;

    try {
      const normalizedType = selectedSeat.type?.toLowerCase() ?? 'standard';
      const price = normalizedType === 'vip' ? 15 : 10;
      setSeatPrice(Math.round(price * 100)); // Convert to cents
      setCheckoutModalOpen(true);
      setPaymentError('');
    } catch (err) {
      setError('Failed to load seat price');
    }
  };

  const handleCloseCheckout = () => {
    setCheckoutModalOpen(false);
    setPaymentError('');
  };

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

  const groupedSeats = seats.reduce((groups, seat) => {
    if (!groups[seat.row]) {
      groups[seat.row] = [];
    }
    groups[seat.row].push(seat);
    return groups;
  }, {} as Record<string, SeatAvailability[]>);

  const sortedRows = Object.keys(groupedSeats).sort((a, b) => a.localeCompare(b));

  const getSeatClassName = (seat: SeatAvailability) => {
    const hasSelected = selectedSeat?.seatId === seat.seatId;
    const isVipRow = seat.row?.toUpperCase() === 'E';

    if (seat.isReserved) {
      return 'w-full py-3 rounded-lg border-2 border-red-300 bg-red-50 text-red-500 cursor-not-allowed';
    }
    if (hasSelected) {
      return 'w-full py-3 rounded-lg border-2 border-blue-600 bg-blue-50 text-blue-700';
    }
    if (isVipRow) {
      return 'w-full py-3 rounded-lg border-2 border-amber-300 bg-amber-50 text-amber-700 hover:border-amber-500';
    }
    return 'w-full py-3 rounded-lg border-2 border-green-300 bg-green-50 text-green-700 hover:border-green-500';
  };

  const selectedCinema = selectedSchedule ? cinemas.find(c => c.cinemaId === selectedSchedule.cinemaId) : null;

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

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Select Showtime</h2>

          {schedules.length === 0 ? (
            <p className="text-gray-500">No showtimes available</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {schedules.map((schedule) => {
                const scheduleDateTime = new Date(`${schedule.date}T${schedule.startTime}`);
                const isSelected = selectedSchedule?.scheduleId === schedule.scheduleId;

                return (
                  <button
                    key={schedule.scheduleId}
                    type="button"
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      setSelectedSeat(null);
                      loadSeatsForSchedule(schedule.scheduleId);
                    }}
                    className={`min-w-[180px] p-3 rounded-2xl border-2 text-left transition-all ${
                      isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900">
                      {scheduleDateTime.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {scheduleDateTime.toLocaleDateString()}
                    </div>
                    <div className="mt-3 text-sm text-gray-700">
                      {schedule.availableSeats} seats left
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Seat Map</h2>

          {!selectedSchedule ? (
            <p className="text-gray-500">Please select a showtime above to load the seat layout.</p>
          ) : seats.length === 0 ? (
            <p className="text-gray-500">
              {selectedSchedule.availableSeats > 0
                ? `Loading seats for ${getCinemaName(selectedSchedule.cinemaId)}...`
                : 'No seats available for this showtime'}
            </p>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 text-green-700 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                  Available
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-red-50 text-red-700 text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Reserved
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 text-blue-700 text-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Selected
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-amber-50 text-amber-700 text-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  VIP (Row E)
                </span>
              </div>

              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-4xl rounded-full bg-gray-200 py-2 text-center text-sm font-semibold text-gray-700">
                  SCREEN
                </div>
              </div>

              <div className="space-y-4">
                {sortedRows.map((row) => {
                  const rowSeats = groupedSeats[row].sort((a, b) => a.seatNumber - b.seatNumber);
                  return (
                    <div key={row} className="flex items-center gap-3">
                      <div className="w-10 text-sm font-semibold text-gray-700">{row}</div>
                      <div className="grid grid-cols-8 gap-3 flex-1">
                        {rowSeats.map((seat) => (
                          <button
                            key={seat.seatId}
                            type="button"
                            onClick={() => !seat.isReserved && setSelectedSeat(seat)}
                            disabled={seat.isReserved}
                            className={getSeatClassName(seat)}
                          >
                            <div className="text-sm font-semibold">{seat.seatNumber}</div>
                            <div className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                              {seat.row?.toUpperCase() === 'E' ? 'VIP' : 'Standard'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedSeat && selectedSchedule && (
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-3 mb-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between text-gray-700">
                      <span>Seat:</span>
                      <span className="font-medium">
                        {selectedSeat.row}
                        {selectedSeat.seatNumber}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between text-gray-700">
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
                    onClick={handleOpenCheckout}
                    isLoading={isProcessing}
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

      <CheckoutModal
        isOpen={checkoutModalOpen}
        movie={movie}
        cinema={selectedCinema ?? { cinemaId: 0, cinemaName: '', cinemaLocation: '' }}
        schedule={selectedSchedule ?? { scheduleId: 0, movieId: 0, cinemaId: 0, date: '', startTime: '', endTime: '', availableSeats: 0 }}
        selectedSeat={selectedSeat ?? { seatId: 0, row: '', seatNumber: 0, isReserved: false, type: 'standard', cinemaId: 0 }}
        seatPrice={seatPrice}
        onClose={handleCloseCheckout}
        onPaymentSuccess={handlePaymentSuccess}
        isProcessing={isProcessing}
        error={paymentError}
      />
    </div>
  );
}
