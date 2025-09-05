// Products API - Production Ready
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https:/api.organicgreen.uz/api';

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
      // Handle unauthorized - redirect to login or refresh token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

export interface ProductImage {
  id: string;
  image: string;
  image_url: string;
  alt_text_uz: string;
  alt_text_ru?: string;
  alt_text_en?: string;
  is_primary: boolean;
  order: number;
}

export interface Product {
  id: string;
  slug: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  localized_name: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  localized_description: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  localized_category_name: string;
  tags: Array<{
    id: string;
    name: string;
  }>;
  localized_tags: string[];
  price: string;
  sale_price?: string;
  final_price: string;
  is_on_sale: boolean;
  stock: number;
  available_stock: number;
  is_active: boolean;
  is_featured: boolean;
  suggested_products?: Array<{
    id: string;
    name_uz: string;
    slug: string;
    price: string;
    primary_image?: string;
  }>;
  images: ProductImage[];
  primary_image: ProductImage | null;
  images_count: number;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface APIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  page_size: number;
  total_pages: number;
  current_page: number;
  results: T[];
}

export interface ProductFilters {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  tags?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  featured?: boolean;
  on_sale?: boolean;
  ordering?: string;
  lang?: 'uz' | 'ru' | 'en';
}

// Products API
export const productsAPI = {
  // Get all products with filters
  getAll: async (filters: ProductFilters = {}): Promise<APIResponse<Product>> => {
    try {
      const response = await api.get('/products/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  // Get product by ID
  getById: async (id: string, lang?: string): Promise<Product> => {
    try {
      const params = lang ? { lang } : {};
      const response = await api.get(`/products/${id}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  },

  // Get product by slug (main method for product details)
  getBySlug: async (slug: string, lang?: string): Promise<Product> => {
    try {
      const params = lang ? { lang } : {};
      const response = await api.get(`/products/${slug}/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product by slug ${slug}:`, error);
      throw error;
    }
  },

  // Get featured products
  getFeatured: async (lang?: string): Promise<APIResponse<Product>> => {
    try {
      const params = { featured: true, page_size: 8, ...(lang && { lang }) };
      const response = await api.get('/products/featured/', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      throw error;
    }
  },

  // Get products on sale
  getOnSale: async (lang?: string): Promise<APIResponse<Product>> => {
    try {
      const params = { on_sale: true, page_size: 8, ...(lang && { lang }) };
      const response = await api.get('/products/on_sale/', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sale products:', error);
      throw error;
    }
  },

  // Get suggested products for a product
  getSuggested: async (productId: string, lang?: string): Promise<Product[]> => {
    try {
      const params = lang ? { lang } : {};
      const response = await api.get(`/products/${productId}/suggested/`, { params });
      return response.data.results || response.data;
    } catch (error) {
      console.error(`Failed to fetch suggested products for ${productId}:`, error);
      throw error;
    }
  },
};

export default productsAPI;
