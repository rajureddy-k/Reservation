import { api } from './api';
import { Ticket, CreateTicketRequest } from '../types';

export const ticketService = {
  getMyTickets(): Promise<Ticket[]> {
    return api.get<Ticket[]>('/api/v1/ticket/myTickets');
  },

  getAll(): Promise<Ticket[]> {
    return api.get<Ticket[]>('/api/v1/ticket');
  },

  create(data: CreateTicketRequest): Promise<Ticket> {
    return api.post<Ticket>('/api/v1/ticket', data);
  },

  update(id: number, data: Partial<Ticket>): Promise<Ticket> {
    return api.put<Ticket>(`/api/v1/ticket/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return api.delete<void>(`/api/v1/ticket/${id}`);
  },
};
