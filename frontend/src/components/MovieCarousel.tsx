import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Movie } from '../types';

interface MovieCarouselProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export function MovieCarousel({ movies, onSelectMovie }: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay || movies.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, movies.length]);

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div
      className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="absolute inset-0">
        {currentMovie.imageUrl ? (
          <img
            src={currentMovie.imageUrl}
            alt={currentMovie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-2xl font-bold">{currentMovie.title}</p>
              <p className="text-sm mt-2">No image available</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {currentMovie.title}
        </h2>

        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-medium">
              {currentMovie.rating || 'N/A'}
            </span>
          </div>
          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
            {currentMovie.genre}
          </span>
          <span className="text-white text-sm">
            {currentMovie.duration} mins
          </span>
        </div>

        <p className="text-white/90 text-lg max-w-2xl leading-relaxed mb-8 line-clamp-3">
          {currentMovie.description}
        </p>

        <button
          onClick={() => onSelectMovie(currentMovie)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all w-fit"
        >
          Book Now
        </button>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlay(false);
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 w-2 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
