import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface DemoCarouselProps {
  onExplore: () => void;
}

const demoMovies = [
  {
    id: 1,
    title: 'Cosmic Adventure',
    genre: 'Sci-Fi',
    duration: 148,
    rating: 8.5,
    description: 'Embark on an epic journey through the stars in this groundbreaking sci-fi masterpiece',
    color: 'from-purple-600 to-blue-600',
  },
  {
    id: 2,
    title: 'Hearts Collide',
    genre: 'Romance',
    duration: 125,
    rating: 8.2,
    description: 'A passionate love story that defies all odds in a world of endless possibilities',
    color: 'from-rose-600 to-pink-600',
  },
  {
    id: 3,
    title: 'The Last Stand',
    genre: 'Action',
    duration: 156,
    rating: 8.8,
    description: 'In a world on the brink of collapse, one hero must make the ultimate sacrifice',
    color: 'from-orange-600 to-red-600',
  },
  {
    id: 4,
    title: 'Midnight Mystery',
    genre: 'Thriller',
    duration: 134,
    rating: 8.4,
    description: 'When night falls, secrets emerge. A gripping tale of deception and truth',
    color: 'from-indigo-600 to-purple-600',
  },
];

export function DemoCarousel({ onExplore }: DemoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % demoMovies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % demoMovies.length);
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + demoMovies.length) % demoMovies.length);
  };

  const currentMovie = demoMovies[currentIndex];

  return (
    <div
      className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="absolute inset-0">
        <div className={`w-full h-full bg-gradient-to-br ${currentMovie.color} flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white z-10">
              <div className="text-8xl font-bold opacity-30 mb-4">🎬</div>
              <p className="text-2xl font-bold">{currentMovie.title}</p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {currentMovie.title}
        </h2>

        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-medium">{currentMovie.rating}</span>
          </div>
          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
            {currentMovie.genre}
          </span>
          <span className="text-white text-sm">{currentMovie.duration} mins</span>
        </div>

        <p className="text-white/90 text-lg max-w-2xl leading-relaxed mb-8">
          {currentMovie.description}
        </p>

        <button
          onClick={onExplore}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all w-fit"
        >
          Explore Now
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
        {demoMovies.map((_, index) => (
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
