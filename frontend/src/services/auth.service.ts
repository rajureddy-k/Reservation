import { api } from './api';
import { AuthResponse, User } from '../types';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/v1/auth/login', { userName: credentials.email, password: credentials.password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.userDTO));
    }
    return response;
  },

  async register(data: RegisterRequest): Promise<User> {
    return api.post<User>('/api/v1/users', data);
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }

    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.warn('Failed to parse stored user from localStorage:', error, userStr);
      localStorage.removeItem('user');
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};
