// API configuration
import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://api.organicgreen.uz/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sample products for development
export const SAMPLE_PRODUCTS = [
  {
    id: "1",
    slug: "organik-pomidor",
    name_uz: "Organik pomidor",
    name_ru: "Органический помидор",
    name_en: "Organic tomato",
    description_uz: "Tabiiy o'stirilgan organik pomidor",
    description_ru: "Натурально выращенный органический помидор",
    description_en: "Naturally grown organic tomato",
    price: 15000,
    currency: "UZS",
    weight: "1kg",
    weight_unit: "kg",
    category: {
      id: "1",
      name_uz: "Sabzavotlar",
      name_ru: "Овощи",
      name_en: "Vegetables"
    },
    images: [
      { id: "1", url: "/api/placeholder/300/300", alt: "Organic tomato" }
    ],
    tags: [
      { id: "organic", name_uz: "Organik", name_ru: "Органик", name_en: "Organic" }
    ],
    availability: "in_stock",
    stock_quantity: 50,
    nutritional_info: {
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2,
      fiber: 1.2,
      vitamin_c: 14
    },
    farm_info: {
      name: "Green Valley Farm",
      location: "Toshkent viloyati",
      certification: "Organic Certified"
    }
  },
  {
    id: "2",
    slug: "organik-sabzi",
    name_uz: "Organik sabzi",
    name_ru: "Органическая морковь",
    name_en: "Organic carrot",
    description_uz: "Tabiiy o'stirilgan organik sabzi",
    description_ru: "Натурально выращенная органическая морковь",
    description_en: "Naturally grown organic carrot",
    price: 12000,
    currency: "UZS",
    weight: "1kg",
    weight_unit: "kg",
    category: {
      id: "1",
      name_uz: "Sabzavotlar",
      name_ru: "Овощи",
      name_en: "Vegetables"
    },
    images: [
      { id: "2", url: "/api/placeholder/300/300", alt: "Organic carrot" }
    ],
    tags: [
      { id: "organic", name_uz: "Organik", name_ru: "Органик", name_en: "Organic" }
    ],
    availability: "in_stock",
    stock_quantity: 30,
    nutritional_info: {
      calories: 41,
      protein: 0.9,
      carbs: 9.6,
      fat: 0.2,
      fiber: 2.8,
      vitamin_a: 835
    },
    farm_info: {
      name: "Fresh Fields Farm",
      location: "Samarqand viloyati",
      certification: "Organic Certified"
    }
  }
];

export interface Product {
  id: string;
  slug: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  price: number;
  currency: string;
  weight: string;
  weight_unit: string;
  category: {
    id: string;
    name_uz: string;
    name_ru: string;
    name_en: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
  tags: Array<{
    id: string;
    name_uz: string;
    name_ru: string;
    name_en: string;
  }>;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order';
  stock_quantity: number;
  nutritional_info?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    vitamin_c?: number;
    vitamin_a?: number;
  };
  farm_info?: {
    name: string;
    location: string;
    certification: string;
  };
}

export interface APIProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  in_stock: boolean;
}

export interface Category {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  slug: string;
  image?: string;
  description_uz?: string;
  description_ru?: string;
  description_en?: string;
}

export interface SearchParams {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  sort?: 'name' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
  tags?: string;
}

// Products API
export const productsAPI = {
  getAll: async (params: SearchParams = {}) => {
    try {
      const response = await api.get('/products/', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Return sample data for development
      return {
        results: SAMPLE_PRODUCTS,
        count: SAMPLE_PRODUCTS.length,
        next: null,
        previous: null
      };
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      // Return sample data for development
      const sampleProduct = SAMPLE_PRODUCTS.find(p => p.id === id);
      if (sampleProduct) {
        return sampleProduct;
      }
      throw new Error('Product not found');
    }
  },

  getBySlug: async (slug: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/slug/${slug}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product by slug ${slug}:`, error);
      // Return sample data for development
      const sampleProduct = SAMPLE_PRODUCTS.find(p => p.slug === slug);
      if (sampleProduct) {
        return sampleProduct;
      }
      throw new Error('Product not found');
    }
  },

  search: async (query: string, params: SearchParams = {}) => {
    try {
      const response = await api.get('/products/search/', { 
        params: { q: query, ...params } 
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search products:', error);
      // Return filtered sample data for development
      const filtered = SAMPLE_PRODUCTS.filter(product => 
        product.name_uz.toLowerCase().includes(query.toLowerCase()) ||
        product.name_ru.toLowerCase().includes(query.toLowerCase()) ||
        product.name_en.toLowerCase().includes(query.toLowerCase())
      );
      return {
        results: filtered,
        count: filtered.length,
        next: null,
        previous: null
      };
    }
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/categories/');
      return response.data.results || response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Return sample categories for development
      return [
        {
          id: "1",
          name_uz: "Sabzavotlar",
          name_ru: "Овощи", 
          name_en: "Vegetables",
          slug: "vegetables"
        },
        {
          id: "2",
          name_uz: "Mevalar",
          name_ru: "Фрукты",
          name_en: "Fruits", 
          slug: "fruits"
        },
        {
          id: "3",
          name_uz: "Yashilliklar",
          name_ru: "Зелень",
          name_en: "Greens",
          slug: "greens"
        }
      ];
    }
  },

  getById: async (id: string): Promise<Category> => {
    try {
      const response = await api.get(`/categories/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error);
      throw new Error('Category not found');
    }
  }
};

// Tags API
export const tagsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/tags/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      return { results: [] };
    }
  },
  
  getProductsByTag: async (tagId: string, params: SearchParams = {}) => {
    const response = await api.get('/products/', { 
      params: { ...params, tags: tagId } 
    });
    return response.data;
  },
};

// Language utility for getting localized names
export const getLocalizedName = (
  item: { name_uz: string; name_ru: string; name_en: string },
  locale: 'uz' | 'ru' | 'en' = 'uz'
): string => {
  switch (locale) {
    case 'ru':
      return item.name_ru;
    case 'en':
      return item.name_en;
    default:
      return item.name_uz;
  }
};

// Error handling utility
export const handleAPIError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response: { data: { message?: string } } };
    // Server responded with error status
    console.error('API Error:', axiosError.response.data);
    return axiosError.response.data.message || 'Server xatosi yuz berdi';
  } else if (error && typeof error === 'object' && 'request' in error) {
    // Request made but no response
    console.error('Network Error:', (error as { request: unknown }).request);
    return 'Tarmoq xatosi. Internetni tekshiring';
  } else {
    // Something else happened
    const errorMessage = error instanceof Error ? error.message : 'Kutilmagan xato yuz berdi';
    console.error('Error:', errorMessage);
    return errorMessage;
  }
};
