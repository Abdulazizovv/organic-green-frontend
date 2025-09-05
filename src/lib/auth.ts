import axios from 'axios';
import { setAuthService } from './api';

const API_BASE_URL = 'https://api.organicgreen.uz/api';

// Auth API interface types
export interface RegisterRequest {
  first_name: string;
  last_name?: string;
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  // Added admin related flags
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface AuthTokens {
  refresh: string;
  access: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export type LoginResponse = AuthResponse;
export type RegisterResponse = AuthResponse;

// Create axios instance for auth (doesn't use the main API instance to avoid circular dependencies)
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth service functions
export const authService = {
  // Register new user
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await authApi.post<RegisterResponse>('/auth/register/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        interface ErrShape { message?: string }
        const data = error.response.data as ErrShape;
        throw new Error(data.message || 'Registration failed');
      }
      throw new Error('Network error occurred');
    }
  },

  // Login user
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await authApi.post<LoginResponse>('/auth/login/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        interface ErrShape { message?: string }
        const data = error.response.data as ErrShape;
        throw new Error(data.message || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  },

  // Refresh access token
  async refreshToken(): Promise<{ access: string }> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.post<{ access: string }>('/auth/refresh/', {
        refresh: refreshToken,
      });
      
      // Update stored access token
      this.saveTokens({
        access: response.data.access,
        refresh: refreshToken,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        interface ErrShape { message?: string }
        const data = error.response.data as ErrShape;
        throw new Error(data.message || 'Token refresh failed');
      }
      throw new Error('Network error occurred');
    }
  },

  // Logout user (clear tokens from storage)
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('cart_session_key'); // Clear cart session when logging out
    }
  },

  // Save tokens to localStorage
  saveTokens(tokens: AuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
    }
  },

  // Get access token from localStorage
  getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  // Get refresh token from localStorage
  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  },

  // Save user data to localStorage
  saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  // Get user data from localStorage
  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  },
};

// Set the auth service instance for the API client
setAuthService(authService);

// Add request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authService;
