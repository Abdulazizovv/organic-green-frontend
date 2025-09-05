import axios from 'axios';

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

// Create axios instance for auth
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
        console.log(error.response.data);
        throw new Error(error.response.data.message || 'Registration failed');
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
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  },

  // Logout user (clear tokens from storage)
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Save tokens to localStorage
  saveTokens(tokens: AuthTokens): void {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
  },

  // Get access token from localStorage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  // Get refresh token from localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },

  // Save user data to localStorage
  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get user data from localStorage
  getUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  },
};

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
