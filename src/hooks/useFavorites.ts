import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import favoritesAPI from '@/api/favorites';
import type { FavoriteCheckResponse, FavoriteToggleResponse } from '@/api/favorites';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/lib/language';

interface UseFavoritesReturn {
  loading: boolean;
  isFavorited: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<void>;
  checkFavorite: (productId: string) => Promise<FavoriteCheckResponse>;
  favoriteStates: Record<string, boolean>;
  favoriteIds: Record<string, number>;
}

export function useFavorites(): UseFavoritesReturn {
  const [loading, setLoading] = useState(false);
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>({});
  const [favoriteIds, setFavoriteIds] = useState<Record<string, number>>({});
  const { showSuccess, showError } = useToast();
  const { t } = useLanguage();
  const router = useRouter();

  const checkFavorite = useCallback(async (productId: string): Promise<FavoriteCheckResponse> => {
    try {
      const response = await favoritesAPI.checkFavorite(productId);
      
      // Update local state
      setFavoriteStates(prev => ({
        ...prev,
        [productId]: response.is_favorited
      }));
      
      if (response.favorite_id) {
        setFavoriteIds(prev => ({
          ...prev,
          [productId]: response.favorite_id!
        }));
      }
      
      return response;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number } };
        if (axiosError.response?.status === 401) {
          return { is_favorited: false };
        }
      }
      throw error;
    }
  }, []);

  const isFavorited = useCallback((productId: string): boolean => {
    return favoriteStates[productId] || false;
  }, [favoriteStates]);

  const toggleFavorite = useCallback(async (productId: string): Promise<void> => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    if (!token) {
      showError(
        t('auth.login_required_favorites') || 'Please login to save favorites ❤️',
        'Login Required'
      );
      
      // Redirect to login with return URL
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      }
      return;
    }

    try {
      setLoading(true);
      
      // Optimistic update
      const currentState = favoriteStates[productId] || false;
      const newState = !currentState;
      
      setFavoriteStates(prev => ({
        ...prev,
        [productId]: newState
      }));

      const response: FavoriteToggleResponse = await favoritesAPI.toggleFavorite(productId);
      
      // Update state based on API response
      setFavoriteStates(prev => ({
        ...prev,
        [productId]: response.is_favorited
      }));
      
      if (response.favorite_id) {
        setFavoriteIds(prev => ({
          ...prev,
          [productId]: response.favorite_id!
        }));
      } else {
        // Remove from favoriteIds if not favorited anymore
        setFavoriteIds(prev => {
          const newIds = { ...prev };
          delete newIds[productId];
          return newIds;
        });
      }
      
      // Show success message
      if (response.action === 'added') {
        showSuccess(
          t('favorites.added_success') || 'Added to favorites ❤️',
          '❤️'
        );
      } else {
        showSuccess(
          t('favorites.removed_success') || 'Removed from favorites',
          '💔'
        );
      }
      
    } catch (error: unknown) {
      // Rollback optimistic update
      setFavoriteStates(prev => ({
        ...prev,
        [productId]: favoriteStates[productId] || false
      }));
      
      console.error('Toggle favorite failed:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number } };
        if (axiosError.response?.status === 401) {
          showError(
            t('auth.login_required_favorites') || 'Please login to save favorites ❤️',
            'Login Required'
          );
          
          // Redirect to login
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            router.push(`/login?next=${encodeURIComponent(currentPath)}`);
          }
        } else if (axiosError.response?.status === 429) {
          showError(
            t('favorites.rate_limited') || 'Too many requests 🌱 Please wait',
            'Rate Limited'
          );
        } else {
          showError(
            t('favorites.toggle_error') || 'Failed to update favorites',
            'Favorites Error'
          );
        }
      } else {
        showError(
          t('favorites.toggle_error') || 'Failed to update favorites',
          'Favorites Error'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [favoriteStates, showSuccess, showError, t, router]);

  return {
    loading,
    isFavorited,
    toggleFavorite,
    checkFavorite,
    favoriteStates,
    favoriteIds,
  };
}
