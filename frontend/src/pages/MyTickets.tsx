import { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Calendar, Clock, MapPin } from 'lucide-react';
import { Ticket } from '../types';
import { ticketService } from '../services/ticket.service';

export function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const data = await ticketService.getMyTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Tickets</h1>
        <p className="text-gray-600 mt-2">View your booking history</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <TicketIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">You haven't booked any tickets yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <TicketIcon className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Ticket #{ticket.id}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ticket.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar className="w-5 h-5" />
                        <span>
                          Booked: {new Date(ticket.bookingDate).toLocaleDateString()}
                        </span>
                      </div>
                      {ticket.schedule && (
                        <>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Clock className="w-5 h-5" />
                            <span>
                              {new Date(ticket.schedule.startTime).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <MapPin className="w-5 h-5" />
                            <span>Cinema {ticket.schedule.cinemaId}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-3">
                      {ticket.seat && (
                        <div className="text-gray-700">
                          <span className="font-medium">Seat:</span>{' '}
                          {ticket.seat.rowNumber}
                          {ticket.seat.seatNumber}
                        </div>
                      )}
                      <div className="text-gray-700">
                        <span className="font-medium">Total Price:</span> $
                        {ticket.totalPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
