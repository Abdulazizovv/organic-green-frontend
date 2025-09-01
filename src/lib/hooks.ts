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
