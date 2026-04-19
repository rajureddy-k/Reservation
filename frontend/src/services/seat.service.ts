import { api } from './api';
import { Seat, SeatAvailability } from '../types';

export const seatService = {
  getAll(): Promise<Seat[]> {
    return api.get<Seat[]>('/api/v1/seats');
  },

  getByCinema(cinemaId: number): Promise<Seat[]> {
    return api.get<Seat[]>(`/api/v1/seats/cinema/${cinemaId}`);
  },

  getBySchedule(scheduleId: number): Promise<SeatAvailability[]> {
    return api.get<SeatAvailability[]>(`/api/v1/seats/schedule/${scheduleId}`);
  },

  create(seat: Omit<Seat, 'seatId'>): Promise<Seat> {
    return api.post<Seat>('/api/v1/seats', seat);
  },

  update(id: number, seat: Partial<Seat>): Promise<Seat> {
    return api.put<Seat>(`/api/v1/seats/${id}`, seat);
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/api/v1/seats/${id}`);
  },
};
