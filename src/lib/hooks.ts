import { useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  Tag,
  APIResponse,
  SearchParams,
  productsAPI, 
  categoriesAPI,
  tagsAPI
} from './api';

// Cart item interface
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

// Generic loading state type
interface LoadingState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Simple error handler
function handleAPIError(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An error occurred';
}

// Hook for products with search/filter
export function useProducts(params: SearchParams = {}) {
  const [state, setState] = useState<LoadingState<APIResponse<Product>>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await productsAPI.getAll(params);
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: handleAPIError(error)
        });
      }
    };

    fetchProducts();
  }, [JSON.stringify(params)]);

  return state;
}

// Hook for featured products
export function useFeaturedProducts() {
  const [state, setState] = useState<LoadingState<APIResponse<Product>>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await productsAPI.getFeatured();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: handleAPIError(error)
        });
      }
    };

    fetchFeaturedProducts();
  }, []);

  return state;
}

// Hook for single product
export function useProduct(id: string) {
  const [state, setState] = useState<LoadingState<Product>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await productsAPI.getById(id);
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: handleAPIError(error)
        });
      }
    };

    fetchProduct();
  }, [id]);

  return state;
}

// Hook for categories
export function useCategories() {
  const [state, setState] = useState<LoadingState<{ results: Category[] }>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const categories = await categoriesAPI.getAll();
        setState({ 
          data: { results: categories }, 
          loading: false, 
          error: null 
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: handleAPIError(error)
        });
      }
    };

    fetchCategories();
  }, []);

  return state;
}

// Hook for single category
export function useCategory(id: string) {
  const [state, setState] = useState<LoadingState<Category>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await categoriesAPI.getById(id);
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: handleAPIError(error)
        });
      }
    };

    fetchCategory();
  }, [id]);

  return state;
}

// Hook for tags
export function useTags() {
  const [state, setState] = useState<LoadingState<Tag[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await tagsAPI.getAll();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: handleAPIError(error)
        });
      }
    };

    fetchTags();
  }, []);

  return state;
}

// Cart management hook
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('organic-green-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('organic-green-cart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    return new Promise<void>((resolve) => {
      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === product.id);
        
        if (existingItem) {
          // Update quantity
          return currentItems.map(item => 
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item
          return [...currentItems, {
            id: product.id,
            product,
            quantity,
            addedAt: new Date()
          }];
        }
      });
      
      // Simulate async operation
      setTimeout(resolve, 100);
    });
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    return new Promise<void>((resolve) => {
      setItems(currentItems => {
        if (newQuantity <= 0) {
          // Remove item
          return currentItems.filter(item => item.id !== productId);
        } else {
          // Update quantity
          return currentItems.map(item => 
            item.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          );
        }
      });
      
      setTimeout(resolve, 100);
    });
  };

  const removeFromCart = async (productId: string) => {
    return updateQuantity(productId, 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartItem = (productId: string): CartItem | undefined => {
    return items.find(item => item.id === productId);
  };

  const getTotalItems = (): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.product.final_price);
      return total + (price * item.quantity);
    }, 0);
  };

  return {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItem,
    getTotalItems,
    getTotalPrice
  };
}
