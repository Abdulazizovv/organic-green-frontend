import api from '@/lib/api';

export interface FavoriteCheckResponse {
  is_favorited: boolean;
  favorite_id?: number;
}

export interface FavoriteToggleResponse {
  is_favorited: boolean;
  favorite_id?: number;
  message: string;
  action?: 'added' | 'removed';
}

export interface FavoriteAddResponse {
  is_favorited: boolean;
  favorite_id: number;
  message: string;
}

export interface FavoriteRemoveResponse {
  is_favorited: boolean;
  message: string;
}

export interface Favorite {
  id: number;
  product: {
    id: string;
    name_en: string;
    name_ru: string;
    name_uz: string;
    description_en: string;
    description_ru: string;
    description_uz: string;
    price: string;
    stock: number;
    category: string;
    image: string;
    slug: string;
    is_featured: boolean;
    is_available: boolean;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
}

export interface FavoriteListResponse {
  results: Favorite[];
  count: number;
  next: string | null;
  previous: string | null;
}

/**
 * Favorites API service
 */
class FavoritesAPI {
  /**
   * Get all favorites for the authenticated user
   */
  async getFavorites(): Promise<FavoriteListResponse> {
    const response = await api.get<FavoriteListResponse>('/favorites/');
    return response.data;
  }

  /**
   * Check if a product is favorited by the authenticated user
   */
  async checkFavorite(productId: string): Promise<FavoriteCheckResponse> {
    try {
      const response = await api.get<FavoriteCheckResponse>(`/favorites/check/?product_id=${productId}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        throw new Error('authentication_required');
      }
      if (axiosError.response?.status === 429) {
        throw new Error('rate_limit_exceeded');
      }
      throw error;
    }
  }

  /**
   * Toggle favorite status for a product
   */
  async toggleFavorite(productId: string): Promise<FavoriteToggleResponse> {
    const response = await api.post<FavoriteToggleResponse>('/favorites/toggle/', {
      product_id: productId,
    });
    return response.data;
  }

  /**
   * Add a product to favorites
   */
  async addFavorite(productId: string): Promise<FavoriteAddResponse> {
    const response = await api.post<FavoriteAddResponse>('/favorites/', {
      product_id: productId,
    });
    return response.data;
  }

  /**
   * Remove a product from favorites by favorite ID
   */
  async removeFavorite(favoriteId: number): Promise<FavoriteRemoveResponse> {
    const response = await api.delete<FavoriteRemoveResponse>(`/favorites/${favoriteId}/`);
    return response.data;
  }

  /**
   * Remove a product from favorites by product ID
   */
  async removeFavoriteByProductId(productId: string): Promise<FavoriteRemoveResponse> {
    const response = await api.delete<FavoriteRemoveResponse>(`/favorites/remove-by-product/?product_id=${productId}`);
    return response.data;
  }
}

const favoritesAPI = new FavoritesAPI();
export default favoritesAPI;
