// Favorites API - Production Ready with Enhanced Auth
import { api, authGuard } from '@/lib/apiConfig';

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
    if (!authGuard.requireAuth()) {
      throw new Error('Authentication required');
    }
    
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
    if (!authGuard.checkAuthOrRedirect('add to favorites')) {
      throw new Error('Authentication required');
    }
    
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
    if (!authGuard.requireAuth()) {
      throw new Error('Authentication required');
    }
    
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
    if (!authGuard.requireAuth()) {
      return { is_favorited: false }; // Return false if not authenticated
    }
    
    try {
      const response = await api.get(`/favorites/check/?product_id=${productId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to check favorite status:', error);
      // Don't throw for check - just return false
      return { is_favorited: false };
    }
  },

  // Toggle favorite status
  toggle: async (productId: string): Promise<FavoriteToggleResponse> => {
    if (!authGuard.checkAuthOrRedirect('save to favorites')) {
      throw new Error('Authentication required');
    }
    
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
