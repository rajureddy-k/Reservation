import { Star, Clock, Calendar, Play } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export function MovieCard({ movie, onSelect }: MovieCardProps) {
  return (
    <div className="group cursor-pointer h-full">
      <div
        className="relative h-64 rounded-xl overflow-hidden mb-4 transition-all duration-300"
        onClick={() => onSelect(movie)}
      >
        {movie.imageUrl ? (
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No image</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        <button
          onClick={() => onSelect(movie)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="bg-white rounded-full p-4 shadow-lg">
            <Play className="w-6 h-6 text-blue-600 fill-blue-600" />
          </div>
        </button>

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-gray-900">
            {movie.rating || 'N/A'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {movie.title}
        </h3>

        <div className="flex items-center space-x-2">
          <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            {movie.genre}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {movie.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{movie.duration} mins</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          </div>
        </div>

        <button
          onClick={() => onSelect(movie)}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 active:scale-95"
        >
          Book Tickets
        </button>
      </div>
    </div>
  );
}
