import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Movie } from '../types';
import { movieService } from '../services/movie.service';
import { MovieCarousel } from '../components/MovieCarousel';
import { MovieCard } from '../components/MovieCard';

interface MoviesProps {
  onSelectMovie: (movie: Movie) => void;
}

export function Movies({ onSelectMovie }: MoviesProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading movies...</p>
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

  const upcomingMovies = movies.slice(0, 5);
  const allMovies = movies;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {movies.length > 0 && (
        <>
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <MovieCarousel movies={upcomingMovies} onSelectMovie={onSelectMovie} />
          </div>

          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center space-x-3 mb-8">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
                <p className="text-gray-600 text-sm mt-1">Most popular movies this week</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allMovies.slice(0, 4).map((movie) => (
                <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center space-x-3 mb-8">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">All Movies</h2>
                <p className="text-gray-600 text-sm mt-1">Complete collection of available films</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
              ))}
            </div>
          </div>
        </>
      )}

      {movies.length === 0 && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Clock className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No movies available at the moment</p>
          <p className="text-gray-400 text-sm mt-2">Check back soon for new releases</p>
        </div>
      )}
    </div>
  );
}
