import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { Cinema } from '../../types';
import { cinemaService } from '../../services/cinema.service';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export function CinemaManagement() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCinema, setEditingCinema] = useState<Cinema | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
  });

  useEffect(() => {
    loadCinemas();
  }, []);

  const loadCinemas = async () => {
    try {
      setIsLoading(true);
      const data = await cinemaService.getAll();
      setCinemas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cinemas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const cinemaData = {
        ...formData,
        capacity: parseInt(formData.capacity),
      };

      if (editingCinema) {
        await cinemaService.update(editingCinema.id, cinemaData);
      } else {
        await cinemaService.create(cinemaData);
      }

      setShowForm(false);
      setEditingCinema(null);
      resetForm();
      loadCinemas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleEdit = (cinema: Cinema) => {
    setEditingCinema(cinema);
    setFormData({
      name: cinema.name,
      location: cinema.location,
      capacity: cinema.capacity.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this cinema?')) return;

    try {
      await cinemaService.delete(id);
      loadCinemas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      capacity: '',
    });
  };

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
        <h2 className="text-2xl font-bold text-gray-900">Cinemas</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingCinema(null);
            resetForm();
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Cinema
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <Input
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            required
          />

          <div className="flex space-x-3">
            <Button type="submit">{editingCinema ? 'Update' : 'Create'} Cinema</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setEditingCinema(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {cinemas.map((cinema) => (
          <div
            key={cinema.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-lg text-gray-900">{cinema.name}</h3>
              <p className="text-gray-600">{cinema.location}</p>
              <p className="text-sm text-gray-500 mt-1">Capacity: {cinema.capacity}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(cinema)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(cinema.id)}
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
