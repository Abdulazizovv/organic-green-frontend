import { useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  APIResponse,
  SearchParams,
  productsAPI, 
  categoriesAPI
} from './api';

// Generic loading state type
interface LoadingState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Hook for products
export const useProducts = (params?: {
  page?: number;
  page_size?: number;
  category?: string;
  tags?: string;
  search?: string;
}) => {
  const [state, setState] = useState<LoadingState<PaginatedResponse<Product>>>({
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
  }, [
    params?.page,
    params?.page_size,
    params?.category,
    params?.tags,
    params?.search,
  ]);

  return state;
};

// Hook for featured products
export const useFeaturedProducts = () => {
  const [state, setState] = useState<LoadingState<PaginatedResponse<Product>>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await productsAPI.getAll(); // Featured products are just all products for now
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
};

// Hook for single product
export const useProduct = (slug: string) => {
  const [state, setState] = useState<LoadingState<Product>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await productsAPI.getBySlug(slug);
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
  }, [slug]);

  return state;
};

// Hook for categories
export const useCategories = () => {
  const [state, setState] = useState<LoadingState<Category[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await categoriesAPI.getAll();
        setState({ data, loading: false, error: null });
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
};

// Hook for tags
export const useTags = () => {
  const [state, setState] = useState<LoadingState<PaginatedResponse<Tag>>>({
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
};

// Hook for products by category
export const useProductsByCategory = (categoryId: string, params?: {
  page?: number;
  page_size?: number;
}) => {
  const [state, setState] = useState<LoadingState<PaginatedResponse<Product>>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await productsAPI.getAll({ category: categoryId, ...params });
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
  }, [categoryId, params?.page, params?.page_size]);

  return state;
};

// Hook for products by tag
export const useProductsByTag = (tagId: string, params?: {
  page?: number;
  page_size?: number;
}) => {
  const [state, setState] = useState<LoadingState<PaginatedResponse<Product>>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!tagId) return;

    const fetchProducts = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await tagsAPI.getProductsByTag(tagId, params);
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
  }, [tagId, params?.page, params?.page_size]);

  return state;
};
