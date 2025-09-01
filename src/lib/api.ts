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

export interface ProductImage {
  id: string;
  image: string;
  alt_text_uz: string;
  alt_text_ru?: string;
  alt_text_en?: string;
  is_primary: boolean;
  order: number;
}

// Product interface according to API documentation
export interface Product {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  slug: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  price: string; // Decimal field returned as string
  sale_price?: string;
  final_price: string;
  is_on_sale: boolean;
  stock: number;
  category: {
    id: string;
    name_uz: string;
    name_ru: string;
    name_en: string;
    slug: string;
    description_uz?: string;
  };
  tags: Array<{
    id: string;
    name_uz: string;
    name_ru: string;
    name_en: string;
  }>;
  images: Array<{
    id: string;
    image: string;
    alt_text_uz: string;
    alt_text_ru?: string;
    alt_text_en?: string;
    is_primary: boolean;
    order: number;
  }>;
  primary_image: string;
  all_images: string[];
  image_count: number;
  suggested_products?: Array<{
    id: string;
    name_uz: string;
    slug: string;
    price: string;
    primary_image: string;
  }>;
  is_active: boolean;
  is_featured: boolean;
  available_stock: number; // Changed from boolean to number
  display_name: string;
  tag_list: string[];
  category_name: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  slug: string;
  description_uz?: string;
  description_ru?: string;
  description_en?: string;
  products_count: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
}

// Sample data for development when API is unavailable
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name_uz: "Organik pomidor",
    name_ru: "Органический помидор",
    name_en: "Organic tomato",
    slug: "organik-pomidor",
    description_uz: "Tabiiy o'stirilgan organik pomidor",
    description_ru: "Натурально выращенный органический помидор",
    description_en: "Naturally grown organic tomato",
    price: "15000.00",
    sale_price: "12000.00",
    final_price: "12000.00",
    is_on_sale: true,
    stock: 50,
    category: {
      id: "1",
      name_uz: "Sabzavotlar",
      name_ru: "Овощи",
      name_en: "Vegetables",
      slug: "vegetables",
      description_uz: "Tabiiy sabzavotlar"
    },
    tags: [
      { id: "organic", name_uz: "Organik", name_ru: "Органик", name_en: "Organic" }
    ],
    images: [
      {
        id: "1",
        image: "/api/placeholder/300/300",
        alt_text_uz: "Organik pomidor rasmi",
        alt_text_ru: "Изображение органического помидора",
        alt_text_en: "Organic tomato image",
        is_primary: true,
        order: 0
      }
    ],
    primary_image: "/api/placeholder/300/300",
    all_images: ["/api/placeholder/300/300"],
    image_count: 1,
    is_active: true,
    is_featured: true,
    available_stock: 25,
    display_name: "Organik pomidor",
    tag_list: ["Organik"],
    category_name: "Sabzavotlar",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    name_uz: "Organik sabzi",
    name_ru: "Органическая морковь",
    name_en: "Organic carrot",
    slug: "organik-sabzi",
    description_uz: "Tabiiy o'stirilgan organik sabzi",
    description_ru: "Натурально выращенная органическая морковь",
    description_en: "Naturally grown organic carrot",
    price: "12000.00",
    final_price: "12000.00",
    is_on_sale: false,
    stock: 30,
    category: {
      id: "1",
      name_uz: "Sabzavotlar",
      name_ru: "Овощи",
      name_en: "Vegetables",
      slug: "vegetables",
      description_uz: "Tabiiy sabzavotlar"
    },
    tags: [
      { id: "organic", name_uz: "Organik", name_ru: "Органик", name_en: "Organic" },
      { id: "fresh", name_uz: "Yangi", name_ru: "Свежий", name_en: "Fresh" }
    ],
    images: [
      {
        id: "2",
        image: "/api/placeholder/300/300",
        alt_text_uz: "Organik sabzi rasmi",
        alt_text_ru: "Изображение органической моркови",
        alt_text_en: "Organic carrot image",
        is_primary: true,
        order: 0
      }
    ],
    primary_image: "/api/placeholder/300/300",
    all_images: ["/api/placeholder/300/300"],
    image_count: 1,
    is_active: true,
    is_featured: true,
    available_stock: 30,
    display_name: "Organik sabzi",
    tag_list: ["Organik", "Yangi"],
    category_name: "Sabzavotlar",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    name_uz: "Yangi yashillik",
    name_ru: "Свежая зелень",
    name_en: "Fresh greens",
    slug: "yangi-yashillik",
    description_uz: "Tabiiy o'stirilgan yangi yashillik",
    description_ru: "Натурально выращенная свежая зелень",
    description_en: "Naturally grown fresh greens",
    price: "8000.00",
    final_price: "8000.00",
    is_on_sale: false,
    stock: 100,
    category: {
      id: "2",
      name_uz: "Yashilliklar",
      name_ru: "Зелень",
      name_en: "Greens",
      slug: "greens",
      description_uz: "Yangi yashilliklar"
    },
    tags: [
      { id: "fresh", name_uz: "Yangi", name_ru: "Свежий", name_en: "Fresh" },
      { id: "local", name_uz: "Mahalliy", name_ru: "Местный", name_en: "Local" }
    ],
    images: [
      {
        id: "3",
        image: "/api/placeholder/300/300",
        alt_text_uz: "Yangi yashillik rasmi",
        alt_text_ru: "Изображение свежей зелени",
        alt_text_en: "Fresh greens image",
        is_primary: true,
        order: 0
      }
    ],
    primary_image: "/api/placeholder/300/300",
    all_images: ["/api/placeholder/300/300"],
    image_count: 1,
    is_active: true,
    is_featured: true,
    available_stock: 15,
    display_name: "Yangi yashillik",
    tag_list: ["Yangi", "Mahalliy"],
    category_name: "Yashilliklar",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "4",
    name_uz: "Mikrozelen",
    name_ru: "Микрозелень",
    name_en: "Microgreens",
    slug: "mikrozelen",
    description_uz: "Premium sifatli mikrozelen",
    description_ru: "Микрозелень премиум качества",
    description_en: "Premium quality microgreens",
    price: "25000.00",
    final_price: "25000.00",
    is_on_sale: false,
    stock: 20,
    category: {
      id: "3",
      name_uz: "Mikrozelen",
      name_ru: "Микрозелень",
      name_en: "Microgreens",
      slug: "microgreens",
      description_uz: "Premium mikrozelen"
    },
    tags: [
      { id: "premium", name_uz: "Premium", name_ru: "Премиум", name_en: "Premium" },
      { id: "organic", name_uz: "Organik", name_ru: "Органик", name_en: "Organic" }
    ],
    images: [
      {
        id: "4",
        image: "/api/placeholder/300/300",
        alt_text_uz: "Mikrozelen rasmi",
        alt_text_ru: "Изображение микрозелени",
        alt_text_en: "Microgreens image",
        is_primary: true,
        order: 0
      }
    ],
    primary_image: "/api/placeholder/300/300",
    all_images: ["/api/placeholder/300/300"],
    image_count: 1,
    is_active: true,
    is_featured: true,
    available_stock: 10,
    display_name: "Mikrozelen",
    tag_list: ["Premium", "Organik"],
    category_name: "Mikrozelen",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: "1",
    name_uz: "Sabzavotlar",
    name_ru: "Овощи", 
    name_en: "Vegetables",
    slug: "vegetables",
    description_uz: "Tabiiy va organik sabzavotlar",
    products_count: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    name_uz: "Mevalar",
    name_ru: "Фрукты",
    name_en: "Fruits", 
    slug: "fruits",
    description_uz: "Tabiiy va organik mevalar",
    products_count: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    name_uz: "Yashilliklar",
    name_ru: "Зелень",
    name_en: "Greens",
    slug: "greens",
    description_uz: "Yangi yashilliklar",
    products_count: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Search parameters interface
export interface SearchParams {
  category?: string;
  search?: string;
  is_featured?: boolean;
  is_on_sale?: boolean;
  min_price?: number;
  max_price?: number;
  sort?: 'name' | 'price_asc' | 'price_desc' | 'newest';
  ordering?: string;
  page?: number;
  page_size?: number;
  tags?: string;
}

// API response interface
export interface APIResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Products API
export const productsAPI = {
  getAll: async (params: SearchParams = {}): Promise<APIResponse<Product>> => {
    try {
      const response = await api.get('/products/', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Return sample data for development
      return {
        count: SAMPLE_PRODUCTS.length,
        next: null,
        previous: null,
        results: SAMPLE_PRODUCTS
      };
    }
  },

  getFeatured: async (): Promise<APIResponse<Product>> => {
    try {
      const response = await api.get('/products/', { 
        params: { is_featured: true, page_size: 4 } 
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      // Return sample featured products
      return {
        count: SAMPLE_PRODUCTS.filter(p => p.is_featured).length,
        next: null,
        previous: null,
        results: SAMPLE_PRODUCTS.filter(p => p.is_featured).slice(0, 4)
      };
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      // Return sample product
      const product = SAMPLE_PRODUCTS.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    }
  },

  getBySlug: async (slug: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/${slug}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product by slug ${slug}:`, error);
      // Return sample product
      const product = SAMPLE_PRODUCTS.find(p => p.slug === slug);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    }
  }
};

// Convenience function for getting product by slug
export const getProduct = productsAPI.getBySlug;

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/categories/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Return sample categories for development
      return SAMPLE_CATEGORIES;
    }
  },

  getById: async (id: string): Promise<Category> => {
    try {
      const response = await api.get(`/categories/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error);
      const category = SAMPLE_CATEGORIES.find(c => c.id === id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
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
      // Return sample tags for development
      return [
        { id: '1', name_uz: 'Mikrozeleni', name_ru: 'Микрозелень', name_en: 'Microgreens' },
        { id: '2', name_uz: 'Organik', name_ru: 'Органический', name_en: 'Organic' },
        { id: '3', name_uz: 'Yangi', name_ru: 'Новый', name_en: 'Fresh' }
      ];
    }
  }
};

// Export default API instance
export default api;
