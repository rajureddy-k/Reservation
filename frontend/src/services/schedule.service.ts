import { api } from './api';
import { Schedule } from '../types';

interface ScheduleRequest {
  date: string;
  start_time: string;
  end_time: string;
  cinema_id: number;
  movie_id: number;
}

const mapScheduleToRequest = (schedule: Omit<Schedule, 'scheduleId' | 'availableSeats'>): ScheduleRequest => ({
  date: schedule.date,
  start_time: schedule.startTime,
  end_time: schedule.endTime,
  cinema_id: schedule.cinemaId,
  movie_id: schedule.movieId,
});

export const scheduleService = {
  getAll(): Promise<Schedule[]> {
    return api.get<Schedule[]>('/api/v1/schedules');
  },

  create(schedule: Omit<Schedule, 'scheduleId' | 'availableSeats'>): Promise<Schedule> {
    const request = mapScheduleToRequest(schedule);
    return api.post<Schedule>('/api/v1/schedules', request);
  },

  update(id: number, schedule: Partial<Schedule>): Promise<Schedule> {
    const request = mapScheduleToRequest(schedule as Omit<Schedule, 'scheduleId' | 'availableSeats'>);
    return api.put<Schedule>(`/api/v1/schedules/${id}`, request);
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/api/v1/schedules/${id}`);
  },
};
