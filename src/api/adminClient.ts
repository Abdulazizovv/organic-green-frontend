'use client';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { authService } from '@/lib/auth';

export interface ApiErrorShape {
  message?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
}

export const adminClient: AxiosInstance = axios.create({
  baseURL: 'http://api.organicgreen.uz/api/admin/',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

adminClient.interceptors.request.use((config) => {
  const token = authService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiErrorShape>) => {
    if (error.response?.status === 401) {
      return authService
        .refreshToken()
        .then(() => {
          const newToken = authService.getAccessToken();
          if (newToken && error.config) {
            // Always mutate existing headers object (AxiosHeaders implements mutators)
            if (error.config.headers) {
              (error.config.headers as any).Authorization = `Bearer ${newToken}`; // eslint-disable-line @typescript-eslint/no-explicit-any
            } else {
              // Fallback: create minimal plain object - Axios will normalize
              error.config.headers = { Authorization: `Bearer ${newToken}` } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
            }
            return adminClient.request(error.config);
          }
          return Promise.reject(error);
        })
        .catch(() => {
          authService.logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        });
    }
    return Promise.reject(error);
  }
);
