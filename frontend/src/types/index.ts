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
  id: number;
  title: string;
  description: string;
  genre: string;
  duration?: number;
  releaseDate: string;
  country?: string;
  imageUrl?: string;
  rating?: number;
}

export interface Cinema {
  id: number;
  name: string;
  location: string;
  capacity: number;
}

export interface Seat {
  id: number;
  cinemaId: number;
  seatNumber: string;
  rowNumber: string;
  isAvailable: boolean;
}

export interface Schedule {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;
  endTime: string;
  price: number;
  movie?: Movie;
  cinema?: Cinema;
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
}
