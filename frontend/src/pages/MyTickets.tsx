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
      // Ensure we always have an array, even if API returns unexpected data
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
      setTickets([]); // Set empty array on error
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
              key={ticket.ticketId}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <TicketIcon className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Ticket #{ticket.ticketId}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                      CONFIRMED
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar className="w-5 h-5" />
                        <span>
                          Booked: {new Date(ticket.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <MapPin className="w-5 h-5" />
                        <span>Cinema ID: {ticket.cinemaId}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-gray-700">
                        <span className="font-medium">Seat ID:</span> {ticket.seatId}
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Schedule ID:</span> {ticket.scheduleId}
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Price:</span> ${ticket.price}
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
