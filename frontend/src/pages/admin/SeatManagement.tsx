import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { Seat, Cinema } from '../../types';
import { seatService } from '../../services/seat.service';
import { cinemaService } from '../../services/cinema.service';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export function SeatManagement() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSeat, setEditingSeat] = useState<Seat | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    cinemaId: '',
    seatNumber: '',
    rowNumber: '',
    isAvailable: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [seatsData, cinemasData] = await Promise.all([
        seatService.getAll(),
        cinemaService.getAll(),
      ]);
      setSeats(seatsData);
      setCinemas(cinemasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const seatData = {
        cinemaId: parseInt(formData.cinemaId),
        seatNumber: formData.seatNumber,
        rowNumber: formData.rowNumber,
        isAvailable: formData.isAvailable,
      };

      if (editingSeat) {
        await seatService.update(editingSeat.id, seatData);
      } else {
        await seatService.create(seatData);
      }

      setShowForm(false);
      setEditingSeat(null);
      resetForm();
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleEdit = (seat: Seat) => {
    setEditingSeat(seat);
    setFormData({
      cinemaId: seat.cinemaId.toString(),
      seatNumber: seat.seatNumber,
      rowNumber: seat.rowNumber,
      isAvailable: seat.isAvailable,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this seat?')) return;

    try {
      await seatService.delete(id);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      cinemaId: '',
      seatNumber: '',
      rowNumber: '',
      isAvailable: true,
    });
  };

  const getCinemaName = (id: number) => cinemas.find((c) => c.id === id)?.name || 'Unknown';

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

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Seats</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingSeat(null);
            resetForm();
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Seat
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cinema
            </label>
            <select
              value={formData.cinemaId}
              onChange={(e) => setFormData({ ...formData, cinemaId: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a cinema</option>
              {cinemas.map((cinema) => (
                <option key={cinema.id} value={cinema.id}>
                  {cinema.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Row Number"
              value={formData.rowNumber}
              onChange={(e) => setFormData({ ...formData, rowNumber: e.target.value })}
              required
            />
            <Input
              label="Seat Number"
              value={formData.seatNumber}
              onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) =>
                setFormData({ ...formData, isAvailable: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
              Available
            </label>
          </div>

          <div className="flex space-x-3">
            <Button type="submit">{editingSeat ? 'Update' : 'Create'} Seat</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setEditingSeat(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                Seat {seat.rowNumber}
                {seat.seatNumber}
              </h3>
              <p className="text-gray-600">{getCinemaName(seat.cinemaId)}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  seat.isAvailable
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {seat.isAvailable ? 'Available' : 'Occupied'}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(seat)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(seat.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
