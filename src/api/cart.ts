// Cart API - Production Ready
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

export interface CartProduct {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  price: string;
  sale_price?: string;
  final_price: string;
  image: string;
  stock: number;
}

export interface CartItem {
  id: string;
  product: CartProduct;
  quantity: number;
  unit_price: string;
  total_price: string;
  added_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  total_price: string;
  subtotal: string;
  created_at: string;
  updated_at: string;
}

export interface AddItemRequest {
  product_id: string;
  quantity: number;
}

export interface UpdateItemRequest {
  item_id: string;
  quantity: number;
}

export interface CartResponse {
  message: string;
  item: CartItem;
  cart_summary: {
    total_items: number;
    total_price: string;
    items_count: number;
  };
}

// Cart API
export const cartAPI = {
  // Get current cart
  getCurrentCart: async (): Promise<Cart> => {
    try {
      const response = await api.get('/cart/current/');
      return response.data;
    } catch (error) {
      console.error('Failed to get current cart:', error);
      throw error;
    }
  },

  // Add item to cart
  addItem: async (request: AddItemRequest): Promise<CartResponse> => {
    try {
      const response = await api.post('/cart/add_item/', request);
      return response.data;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  },

  // Update item quantity in cart
  updateItem: async (request: UpdateItemRequest): Promise<CartResponse> => {
    try {
      const response = await api.post('/cart/update_item/', request);
      return response.data;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeItem: async (itemId: string): Promise<{ message: string }> => {
    try {
      const response = await api.post('/cart/remove_item/', { item_id: itemId });
      return response.data;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  },

  // Clear cart
  clearCart: async (): Promise<{ message: string }> => {
    try {
      const response = await api.post('/cart/clear/');
      return response.data;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  },

  // Get cart summary
  getSummary: async (): Promise<{
    total_items: number;
    total_price: string;
    items_count: number;
  }> => {
    try {
      const response = await api.get('/cart/summary/');
      return response.data;
    } catch (error) {
      console.error('Failed to get cart summary:', error);
      throw error;
    }
  },
};

export default cartAPI;
