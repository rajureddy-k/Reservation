import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { Movie } from '../../types';
import { movieService } from '../../services/movie.service';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export function MovieManagement() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    releaseDate: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setIsLoading(true);
      const data = await movieService.getAll();
      setMovies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const movieData = {
        ...formData,
        duration: parseInt(formData.duration),
      };

      if (editingMovie) {
        await movieService.update(editingMovie.id, movieData);
      } else {
        await movieService.create(movieData);
      }

      setShowForm(false);
      setEditingMovie(null);
      resetForm();
      loadMovies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      duration: movie.duration.toString(),
      releaseDate: movie.releaseDate,
      imageUrl: movie.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    try {
      await movieService.delete(id);
      loadMovies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      genre: '',
      duration: '',
      releaseDate: '',
      imageUrl: '',
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
        <h2 className="text-2xl font-bold text-gray-900">Movies</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingMovie(null);
            resetForm();
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Movie
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              label="Genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              required
            />
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
            <Input
              label="Release Date"
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              required
            />
            <Input
              label="Image URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div className="flex space-x-3">
            <Button type="submit">{editingMovie ? 'Update' : 'Create'} Movie</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setEditingMovie(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-lg text-gray-900">{movie.title}</h3>
              <p className="text-gray-600 text-sm">{movie.description}</p>
              <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                <span>{movie.genre}</span>
                <span>{movie.duration} min</span>
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(movie)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(movie.id)}
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
