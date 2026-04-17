import { api } from './api';
import { Movie } from '../types';

interface BackendMovie {
  movieId: number;
  movieName: string;
  year: number;
  country: string;
  genre: string;
  description: string;
}

const mapMovie = (backendMovie: BackendMovie): Movie => ({
  movieId: backendMovie.movieId,
  movieName: backendMovie.movieName,
  genre: backendMovie.genre,
  description: backendMovie.description,
  year: backendMovie.year,
  country: backendMovie.country,
  imageUrl: undefined,
  rating: undefined,
});

const toBackendMovie = (movie: Omit<Movie, 'movieId'>) => ({
  movieName: movie.movieName,
  year: movie.year,
  country: movie.country || 'Unknown',
  genre: movie.genre,
  description: movie.description,
});

export const movieService = {
  async getAll(): Promise<Movie[]> {
    const backendMovies = await api.get<BackendMovie[]>('/api/v1/movies');
    return backendMovies.map(mapMovie);
  },

  async getById(id: number): Promise<Movie> {
    const backendMovie = await api.get<BackendMovie>(`/api/v1/movies/${id}`);
    return mapMovie(backendMovie);
  },

  async create(movie: Omit<Movie, 'movieId'>): Promise<Movie> {
    const backendMovie = toBackendMovie(movie);
    return api.post<Movie>('/api/v1/movies', backendMovie);
  },

  async update(id: number, movie: Partial<Movie>): Promise<Movie> {
    const backendUpdate = {
      movieName: movie.movieName,
      year: movie.year,
      country: movie.country,
      genre: movie.genre,
      description: movie.description,
    };
    return api.put<Movie>(`/api/v1/movies/${id}`, backendUpdate);
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/api/v1/movies/${id}`);
  },
};
