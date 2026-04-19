import { api } from './api';
import { CreateTicketWithPaymentRequest } from '../types';

export interface PaymentResponse {
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  message: string;
}

export const paymentService = {
  createTicketWithPayment(request: CreateTicketWithPaymentRequest): Promise<PaymentResponse> {
    return api.post<PaymentResponse>('/api/v1/ticket/with-payment', request);
  },
};
