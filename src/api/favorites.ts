// Favorites API - Production Ready
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://api.organicgreen.uz/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

export interface FavoriteProduct {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  slug: string;
  price: string;
  sale_price?: string;
  final_price: string;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  image: string;
  category_name: string;
  is_on_sale: boolean;
  created_at: string;
}

export interface Favorite {
  id: number;
  product: FavoriteProduct;
  created_at: string;
}

export interface FavoriteCheckResponse {
  is_favorited: boolean;
  favorite_id?: number;
  created_at?: string;
}

export interface FavoriteToggleResponse {
  action: 'added' | 'removed';
  message: string;
  favorite?: {
    id: number;
    product: FavoriteProduct;
    created_at: string;
  };
}

export interface FavoritesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Favorite[];
}

// Favorites API
export const favoritesAPI = {
  // Get all favorites
  getAll: async (page = 1, pageSize = 20): Promise<FavoritesResponse> => {
    try {
      const response = await api.get('/favorites/', {
        params: { page, page_size: pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get favorites:', error);
      throw error;
    }
  },

  // Add product to favorites
  add: async (productId: string): Promise<{ message: string; favorite: Favorite }> => {
    try {
      const response = await api.post('/favorites/', { product_id: productId });
      return response.data;
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      throw error;
    }
  },

  // Remove product from favorites
  remove: async (favoriteId: number): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/favorites/${favoriteId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      throw error;
    }
  },

  // Check if product is favorited
  check: async (productId: string): Promise<FavoriteCheckResponse> => {
    try {
      const response = await api.get(`/favorites/check/?product_id=${productId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to check favorite status:', error);
      throw error;
    }
  },

  // Toggle favorite status
  toggle: async (productId: string): Promise<FavoriteToggleResponse> => {
    try {
      const response = await api.post('/favorites/toggle/', { product_id: productId });
      return response.data;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  },
};

export default favoritesAPI;
