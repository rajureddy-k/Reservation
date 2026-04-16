import { api } from './api';
import { Cinema } from '../types';

export const cinemaService = {
  getAll(): Promise<Cinema[]> {
    return api.get<Cinema[]>('/api/v1/cinemas');
  },

  create(cinema: Omit<Cinema, 'id'>): Promise<Cinema> {
    return api.post<Cinema>('/api/v1/cinemas', cinema);
  },

  update(id: number, cinema: Partial<Cinema>): Promise<Cinema> {
    return api.put<Cinema>(`/api/v1/cinemas/${id}`, cinema);
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/api/v1/cinemas/${id}`);
  },
};
