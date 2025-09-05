import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base configuration
const client: AxiosInstance = axios.create({
  baseURL: 'http://api.organicgreen.uz/api/course/',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor (typing fixed)
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

export default client;
