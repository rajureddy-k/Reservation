import { useState, useEffect } from 'react';
import { Seat, Cinema } from '../../types';
import { seatService } from '../../services/seat.service';
import { cinemaService } from '../../services/cinema.service';
import { Button } from '../../components/Button';

export function SeatManagement() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const cinemasData = await cinemaService.getAll();
      setCinemas(Array.isArray(cinemasData) ? cinemasData : []);

      const initialCinemaId = Array.isArray(cinemasData) && cinemasData.length > 0
        ? cinemasData[0].cinemaId
        : null;
      setSelectedCinemaId(initialCinemaId);

      if (initialCinemaId !== null) {
        await loadSeats(initialCinemaId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setSeats([]);
      setCinemas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSeats = async (cinemaId: number) => {
    try {
      setIsLoading(true);
      const seatsData = await seatService.getByCinema(cinemaId);
      setSeats(Array.isArray(seatsData) ? seatsData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load seats');
      setSeats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCinemaChange = async (cinemaId: number) => {
    setSelectedCinemaId(cinemaId);
    await loadSeats(cinemaId);
  };

  const getCinemaName = (id: number) => cinemas.find((c) => c.cinemaId === id)?.cinemaName || 'Unknown';

  const groupedRows = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const sortedRows = Object.keys(groupedRows).sort((a, b) => a.localeCompare(b));

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Seats</h2>
        <Button onClick={() => selectedCinemaId !== null && loadSeats(selectedCinemaId)}>
          Refresh Seat Inventory
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cinema</label>
          <select
            value={selectedCinemaId ?? ''}
            onChange={(event) => handleCinemaChange(Number(event.target.value))}
            className="w-full max-w-sm px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {cinemas.map((cinema) => (
              <option key={cinema.cinemaId} value={cinema.cinemaId}>
                {cinema.cinemaName}
              </option>
            ))}
          </select>
        </div>

        <p className="mb-4 text-sm text-gray-600">
          Seat inventory is generated automatically for each cinema. Manual seat creation and editing has been removed from the workflow.
        </p>

        {seats.length === 0 ? (
          <div className="text-gray-500">No seats found. Default inventory will be generated when a cinema is selected.</div>
        ) : (
          <div className="space-y-6">
            {sortedRows.map((row) => (
              <div key={row} className="space-y-3">
                <div className="text-sm font-semibold text-gray-700">Row {row}</div>
                <div className="grid grid-cols-8 gap-3">
                  {groupedRows[row]
                    .sort((a, b) => a.seatNumber - b.seatNumber)
                    .map((seat) => (
                      <div
                        key={seat.seatId}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center"
                      >
                        <div className="text-sm font-semibold text-gray-900">
                          {seat.row}
                          {seat.seatNumber}
                        </div>
                        <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
                          {seat.type}
                        </div>
                        <div className="mt-2 text-xs font-medium text-gray-600">
                          {seat.isOccupied ? 'Occupied' : 'Available'}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
