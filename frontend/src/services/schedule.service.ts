import { api } from './api';
import { Schedule } from '../types';

export const scheduleService = {
  getAll(): Promise<Schedule[]> {
    return api.get<Schedule[]>('/api/v1/schedules');
  },

  create(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
    return api.post<Schedule>('/api/v1/schedules', schedule);
  },

  update(id: number, schedule: Partial<Schedule>): Promise<Schedule> {
    return api.put<Schedule>(`/api/v1/schedules/${id}`, schedule);
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/api/v1/schedules/${id}`);
  },
};
