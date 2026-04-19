export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: 'ROLE_ADMIN' | 'ROLE_USER';
}

export interface AuthResponse {
  token: string;
  userDTO: User;
}

export interface Movie {
  movieId: number;
  movieName: string;
  description: string;
  genre: string;
  year: number;
  country?: string;
  imageUrl?: string;
  rating?: number;
}

export interface Cinema {
  cinemaId: number;
  cinemaName: string;
  cinemaLocation: string;
}

export interface Seat {
  seatId: number;
  seatNumber: number;
  row: string;
  type: string;
  cinemaId: number;
  isOccupied: boolean;
}

export interface SeatAvailability {
  seatId: number;
  seatNumber: number;
  row: string;
  type: string;
  cinemaId: number;
  isReserved: boolean;
}

export interface Schedule {
  scheduleId: number;
  date: string;
  startTime: string;
  endTime: string;
  availableSeats: number;
  cinemaId: number;
  movieId: number;
}

export interface Ticket {
  ticketId: number;
  userId: number;
  movieId: number;
  cinemaId: number;
  seatId: number;
  scheduleId: number;
  price: number;
  date: string;
}

export interface CreateTicketRequest {
  scheduleId: number;
  seatId: number;
  movieId: number;
  cinemaId: number;
}
