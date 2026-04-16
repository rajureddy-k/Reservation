import { useState, useEffect } from 'react';
import { Film, Star, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Movie } from '../types';
import { movieService } from '../services/movie.service';
import { MovieCarousel } from '../components/MovieCarousel';
import { DemoCarousel } from '../components/DemoCarousel';
import { MovieCard } from '../components/MovieCard';

interface LandingProps {
  onGetStarted: () => void;
  onSelectMovie: (movie: Movie) => void;
}

export function Landing({ onGetStarted, onSelectMovie }: LandingProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await movieService.getAll();
      setMovies(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load movies:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Film className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CineBook</span>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      <section className="relative min-h-[600px] bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 text-white mb-8 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Book Your Favorite
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Movies Now
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              Discover the latest blockbusters, select your seats, and enjoy an unforgettable cinema experience with just a few clicks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-4 px-8 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                className="border-2 border-white hover:bg-white/10 text-white font-bold py-4 px-8 rounded-lg transition-all"
              >
                Learn More
              </button>
            </div>

            <div className="flex gap-8 mt-12 text-white/90 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm">Movies</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Showtimes</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm">Cinemas</div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-3xl transform rotate-6"></div>
            <div className="absolute inset-0 bg-white/10 rounded-3xl transform -rotate-3 backdrop-blur-sm"></div>
            <div className="absolute inset-8 bg-gradient-to-br from-blue-300 to-blue-600 rounded-2xl shadow-2xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles className="w-24 h-24 text-white/30 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {!isLoading && movies.length > 0 && (
        <>
          <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Movies</h2>
              <p className="text-gray-600 text-lg">Check out our latest releases and coming attractions</p>
            </div>
            <MovieCarousel movies={movies.slice(0, 5)} onSelectMovie={onSelectMovie} />
          </section>

          <section className="bg-gray-50 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Now</h2>
                <p className="text-gray-600 text-lg">Browse our most popular movies this week</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {movies.slice(0, 4).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {!isLoading && movies.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Movies</h2>
            <p className="text-gray-600 text-lg">Check out our latest releases and coming attractions</p>
          </div>
          <DemoCarousel onExplore={onGetStarted} />
        </section>
      )}

      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Film className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Vast Selection</h3>
              <p className="text-white/80">Browse thousands of movies across all genres</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Multiple Locations</h3>
              <p className="text-white/80">Find showtimes at cinemas near you</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Quick Booking</h3>
              <p className="text-white/80">Reserve your seats in seconds</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to book your next movie?
          </h2>
          <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            Sign up today and start exploring our complete collection of movies and showtimes.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg transition-all inline-flex items-center space-x-2 shadow-lg"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 text-white font-bold mb-4">
                <Film className="w-6 h-6" />
                <span>CineBook</span>
              </div>
              <p className="text-sm">Your ultimate destination for movie bookings.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#" className="hover:text-white transition">Movies</a></li>
                <li><a href="#" className="hover:text-white transition">Cinemas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2024 CineBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
