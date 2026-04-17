import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { Schedule, Movie, Cinema } from '../../types';
import { scheduleService } from '../../services/schedule.service';
import { movieService } from '../../services/movie.service';
import { cinemaService } from '../../services/cinema.service';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export function ScheduleManagement() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    movieId: '',
    cinemaId: '',
    startTime: '',
    endTime: '',
    price: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [schedulesData, moviesData, cinemasData] = await Promise.all([
        scheduleService.getAll(),
        movieService.getAll(),
        cinemaService.getAll(),
      ]);
      setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
      setMovies(Array.isArray(moviesData) ? moviesData : []);
      setCinemas(Array.isArray(cinemasData) ? cinemasData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setSchedules([]);
      setMovies([]);
      setCinemas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const scheduleData = {
        movieId: parseInt(formData.movieId),
        cinemaId: parseInt(formData.cinemaId),
        startTime: formData.startTime,
        endTime: formData.endTime,
        date: new Date(formData.startTime).toISOString().split('T')[0],
      };

      if (editingSchedule) {
        await scheduleService.update(editingSchedule.scheduleId, scheduleData);
      } else {
        await scheduleService.create(scheduleData);
      }

      setShowForm(false);
      setEditingSchedule(null);
      resetForm();
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      movieId: schedule.movieId.toString(),
      cinemaId: schedule.cinemaId.toString(),
      startTime: schedule.startTime.slice(0, 16),
      endTime: schedule.endTime.slice(0, 16),
      price: '', // Backend doesn't provide price in DTO
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    try {
      // Backend doesn't support delete by id, need to check implementation
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      movieId: '',
      cinemaId: '',
      startTime: '',
      endTime: '',
      price: '',
    });
  };

  const getMovieTitle = (id: number) => movies.find((m) => m.movieId === id)?.movieName || 'Unknown';
  const getCinemaName = (id: number) => {
    const cinema = cinemas.find((c) => c.cinemaId === id);
    return cinema?.cinemaName || 'Unknown';
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
        <h2 className="text-2xl font-bold text-gray-900">Schedules</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingSchedule(null);
            resetForm();
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Schedule
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Movie
              </label>
              <select
                value={formData.movieId}
                onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie.movieId} value={movie.movieId}>
                    {movie.movieName}
                  </option>
                ))}
              </select>
            </div>

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
                  <option key={cinema.cinemaId} value={cinema.cinemaId}>
                    {cinema.cinemaName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Start Time"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <Input
              label="End Time"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
            <Input
              label="Price (optional)"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div className="flex space-x-3">
            <Button type="submit">
              {editingSchedule ? 'Update' : 'Create'} Schedule
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setEditingSchedule(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.scheduleId}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {getMovieTitle(schedule.movieId)}
              </h3>
              <p className="text-gray-600">{getCinemaName(schedule.cinemaId)}</p>
              <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                <span>{new Date(schedule.date).toLocaleDateString()}</span>
                <span>{new Date(`${schedule.date}T${schedule.startTime}`).toLocaleTimeString()}</span>
                <span>Available: {schedule.availableSeats}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(schedule)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(schedule.scheduleId)}
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
