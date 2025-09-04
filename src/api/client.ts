import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Create axios instance with base configuration
const client: AxiosInstance = axios.create({
  baseURL: 'http://api.organicgreen.uz/api/course/',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add idempotency key when provided
client.interceptors.request.use((config: AxiosRequestConfig) => {
  // Idempotency key will be set by the calling hook when needed
  return config;
});

export default client;
