// Custom Hooks - Production Ready
import { useState, useEffect, useCallback } from 'react';
import { useCart as useCartContext } from '@/context/CartContext';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/context/ToastContext';
import cartAPI, { type AddItemRequest, type UpdateItemRequest } from '@/api/cart';
import favoritesAPI, { type FavoriteCheckResponse, type FavoriteToggleResponse } from '@/api/favorites';
import productsAPI, { type Product } from '@/api/products';

// Enhanced Cart Hook
export function useCart() {
  const cartContext = useCartContext();
  const { showSuccess, showError, showThrottleWarning } = useToast();
  const { t } = useLanguage();

  const addItem = useCallback(async (productId: string, quantity: number = 1) => {
    try {
      const request: AddItemRequest = { product_id: productId, quantity };
      await cartContext.addItem(request, true); // Enable optimistic updates
      
      showSuccess(
        t('cart.added_success') || `Added ${quantity} item(s) to cart!`,
        '🛒'
      );
    } catch (error: any) {
      console.error('Add to cart failed:', error);
      
      if (error?.response?.status === 429) {
        showThrottleWarning();
      } else if (error?.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.quantity) {
          showError(errorData.quantity[0] || 'Invalid quantity', 'Cart Error');
        } else {
          showError(errorData.message || 'Cannot add item to cart', 'Cart Error');
        }
      } else {
        showError(t('cart.add_error') || 'Failed to add item to cart', 'Cart Error');
      }
      throw error;
    }
  }, [cartContext, showSuccess, showError, showThrottleWarning, t]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      const request: UpdateItemRequest = { item_id: itemId, quantity };
      await cartContext.updateItem(request);
      
      showSuccess(
        t('cart.updated_success') || 'Cart updated successfully!',
        '✅'
      );
    } catch (error: any) {
      console.error('Update cart failed:', error);
      
      if (error?.response?.status === 429) {
        showThrottleWarning();
      } else if (error?.response?.status === 400) {
        const errorData = error.response.data;
        showError(errorData.message || 'Cannot update cart item', 'Cart Error');
      } else {
        showError(t('cart.update_error') || 'Failed to update cart', 'Cart Error');
      }
      throw error;
    }
  }, [cartContext, showSuccess, showError, showThrottleWarning, t]);

  const removeItem = useCallback(async (itemId: string) => {
    try {
      await cartContext.removeItem(itemId);
      showSuccess(
        t('cart.removed_success') || 'Item removed from cart',
        '🗑️'
      );
    } catch (error: any) {
      console.error('Remove from cart failed:', error);
      
      if (error?.response?.status === 429) {
        showThrottleWarning();
      } else {
        showError(t('cart.remove_error') || 'Failed to remove item', 'Cart Error');
      }
      throw error;
    }
  }, [cartContext, showSuccess, showError, showThrottleWarning, t]);

  const getItemQuantity = useCallback((productId: string): number => {
    return cartContext.getItemQuantity(productId);
  }, [cartContext]);

  const isInCart = useCallback((productId: string): boolean => {
    return cartContext.getItemQuantity(productId) > 0;
  }, [cartContext]);

  return {
    ...cartContext,
    addItem,
    updateQuantity,
    removeItem,
    getItemQuantity,
    isInCart,
  };
}

// Favorites Hook
export function useFavorites() {
  const { showSuccess, showError, showThrottleWarning } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const checkFavorite = useCallback(async (productId: string): Promise<FavoriteCheckResponse> => {
    try {
      return await favoritesAPI.check(productId);
    } catch (error: any) {
      console.error('Check favorite failed:', error);
      
      if (error?.response?.status === 401) {
        return { is_favorited: false }; // Not authenticated
      }
      
      throw error;
    }
  }, []);

  const toggleFavorite = useCallback(async (productId: string): Promise<FavoriteToggleResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (!token) {
      showError(
        t('auth.login_required_favorites') || 'Please login to save favorites ❤️',
        'Login Required'
      );
      throw new Error('Authentication required');
    }

    try {
      setLoading(true);
      const response = await favoritesAPI.toggle(productId);
      
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
      
      return response;
    } catch (error: any) {
      console.error('Toggle favorite failed:', error);
      
      if (error?.response?.status === 401) {
        showError(
          t('auth.login_required_favorites') || 'Please login to save favorites ❤️',
          'Login Required'
        );
      } else if (error?.response?.status === 429) {
        showThrottleWarning();
      } else {
        showError(
          t('favorites.toggle_error') || 'Failed to update favorites',
          'Favorites Error'
        );
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, showThrottleWarning, t]);

  return {
    loading,
    checkFavorite,
    toggleFavorite,
  };
}

// Product Detail Hook
export function useProductDetail(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { language } = useLanguage();
  const { showError, showThrottleWarning } = useToast();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productData = await productsAPI.getBySlug(slug, language);
      setProduct(productData);
    } catch (err: any) {
      console.error('Failed to fetch product:', err);
      
      if (err?.response?.status === 429) {
        showThrottleWarning();
        // Auto retry with exponential backoff
        setTimeout(() => {
          if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
          }
        }, 2000 + (retryCount * 1000));
        return;
      }
      
      if (err?.response?.status === 404) {
        setError('Product not found');
      } else {
        const errorMessage = err?.response?.data?.message || err.message || 'Failed to load product';
        setError(errorMessage);
        showError(errorMessage, 'Product Error');
      }
    } finally {
      setLoading(false);
    }
  }, [slug, language, showError, showThrottleWarning, retryCount]);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug, fetchProduct]);

  const retry = useCallback(() => {
    setRetryCount(0);
    setError(null);
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    retry,
  };
}

// Suggested Products Hook
export function useSuggestedProducts(productId: string, limit = 4) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchSuggestedProducts() {
      try {
        setLoading(true);
        const suggestedProducts = await productsAPI.getSuggested(productId, language);
        setProducts(suggestedProducts.slice(0, limit));
      } catch (error) {
        console.error('Failed to fetch suggested products:', error);
        // Fallback: fetch featured products
        try {
          const featuredResponse = await productsAPI.getFeatured(language);
          setProducts(featuredResponse.results.slice(0, limit));
        } catch (fallbackError) {
          console.error('Failed to fetch fallback products:', fallbackError);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchSuggestedProducts();
    }
  }, [productId, language, limit]);

  return {
    products,
    loading,
  };
}
