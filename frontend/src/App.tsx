import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Landing } from './pages/Landing';
import { Movies } from './pages/Movies';
import { Booking } from './pages/Booking';
import { MyTickets } from './pages/MyTickets';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Movie } from './types';

type Page = 'landing' | 'login' | 'register' | 'movies' | 'booking' | 'tickets' | 'admin';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  if (!isAuthenticated) {
    if (currentPage === 'landing') {
      return (
        <Landing
          onGetStarted={() => setCurrentPage('login')}
          onSelectMovie={(movie) => {
            setSelectedMovie(movie);
            setCurrentPage('login');
          }}
        />
      );
    }

    return currentPage === 'register' ? (
      <Register
        onNavigateToLogin={() => setCurrentPage('login')}
        onRegisterSuccess={() => setCurrentPage('login')}
      />
    ) : (
      <Login
        onNavigateToRegister={() => setCurrentPage('register')}
        onLoginSuccess={() => setCurrentPage('movies')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {currentPage === 'movies' && (
        <Movies
          onSelectMovie={(movie) => {
            setSelectedMovie(movie);
            setCurrentPage('booking');
          }}
        />
      )}

      {currentPage === 'booking' && selectedMovie && (
        <Booking
          movie={selectedMovie}
          onBack={() => setCurrentPage('movies')}
          onBookingSuccess={() => setCurrentPage('tickets')}
        />
      )}

      {currentPage === 'tickets' && <MyTickets />}

      {currentPage === 'admin' && <AdminDashboard />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
