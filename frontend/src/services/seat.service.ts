import { api } from './api';
import { Seat } from '../types';

export const seatService = {
  getAll(): Promise<Seat[]> {
    return api.get<Seat[]>('/api/v1/seats');
  },

  create(seat: Omit<Seat, 'id'>): Promise<Seat> {
    return api.post<Seat>('/api/v1/seats', seat);
  },

  update(id: number, seat: Partial<Seat>): Promise<Seat> {
    return api.put<Seat>(`/api/v1/seats/${id}`, seat);
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/api/v1/seats/${id}`);
  },
};
