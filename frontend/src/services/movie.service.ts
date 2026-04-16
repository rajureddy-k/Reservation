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
  id: backendMovie.movieId,
  title: backendMovie.movieName,
  genre: backendMovie.genre,
  description: backendMovie.description,
  releaseDate: `${backendMovie.year}-01-01`,
  country: backendMovie.country,
  duration: undefined,
  imageUrl: undefined,
  rating: undefined,
});

const toBackendMovie = (movie: Omit<Movie, 'id'>) => ({
  movieName: movie.title,
  year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : undefined,
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

  async create(movie: Omit<Movie, 'id'>): Promise<void> {
    const backendMovie = toBackendMovie(movie as Omit<Movie, 'id'>);
    return api.post<void>('/api/v1/movies', backendMovie);
  },

  async update(id: number, movie: Partial<Movie>): Promise<void> {
    const backendUpdate = {
      movieName: movie.title,
      year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : undefined,
      country: movie.country,
      genre: movie.genre,
      description: movie.description,
    };
    return api.put<void>(`/api/v1/movies/${id}`, backendUpdate);
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/api/v1/movies/${id}`);
  },
};
