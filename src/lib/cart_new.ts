import axios, { AxiosInstance } from 'axios';
import type {
  Cart,
  CartSummary,
  CartHistory,
  AddItemRequest,
  UpdateItemRequest,
  CartResponse,
  APIError
} from '@/types/cart';

const API_BASE_URL = 'http://api.organicgreen.uz/api';

// Logger utility for debugging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[CART INFO] ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[CART ERROR] ${message}`, error || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[CART WARN] ${message}`, data || '');
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[CART DEBUG] ${message}`, data || '');
    }
  }
};

class CartService {
  private api: AxiosInstance;
  private pendingRequests: Map<string, Promise<any>> = new Map();

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/cart`,
      headers: { 'Content-Type': 'application/json' },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth/session
    this.api.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          // Session key for anonymous users
          const sessionKey = this.getSessionKey();
          config.headers['X-Session-Key'] = sessionKey;
          
          // JWT token if authenticated
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        logger.debug('API Response', { 
          url: response.config.url, 
          status: response.status,
          data: response.data 
        });
        return response;
      },
      (error) => {
        logger.error('API Error', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });
        if (error.response?.data) {
          return Promise.reject(this.normalizeError(error.response.data));
        }
        return Promise.reject(new Error('Network error occurred'));
      }
    );
  }

  private getSessionKey(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionKey = localStorage.getItem('cart_session_key');
    if (!sessionKey) {
      sessionKey = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('cart_session_key', sessionKey);
      logger.info('Generated new session key', { sessionKey });
    }
    return sessionKey;
  }

  private normalizeError(errorData: APIError): Error {
    if (errorData.product_id) {
      return new Error(errorData.product_id[0]);
    }
    if (errorData.quantity) {
      return new Error(errorData.quantity[0]);
    }
    return new Error(errorData.message || 'An error occurred');
  }

  private normalizePrice(price: string | number): number {
    return typeof price === 'string' ? parseFloat(price) : price;
  }

  // Debounce similar requests to prevent duplicate API calls
  private async debounceRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      logger.debug('Request already pending, reusing promise', { key });
      return this.pendingRequests.get(key)!;
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // Core API Methods
  async getCurrentCart(): Promise<Cart> {
    try {
      logger.debug('Fetching current cart from API');
      const { data } = await this.api.get<Cart>('/current/');
      logger.info('Successfully fetched cart', { itemsCount: data.items?.length || 0 });
      return {
        ...data,
        total_price: this.normalizePrice(data.total_price)
      };
    } catch (error) {
      logger.error('Failed to fetch current cart', error);
      throw error;
    }
  }

  async addItem(request: AddItemRequest): Promise<CartResponse> {
    try {
      logger.debug('Adding item to cart', request);
      
      // Validate product_id is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(request.product_id)) {
        logger.error('Invalid product ID format', { product_id: request.product_id });
        throw new Error('Invalid product ID format');
      }

      const requestKey = `add_${request.product_id}`;
      return this.debounceRequest(requestKey, async () => {
        const { data } = await this.api.post<CartResponse>('/add/', request);
        logger.info('Successfully added item to cart', { 
          product_id: request.product_id, 
          quantity: request.quantity,
          total_items: data.cart_summary?.total_items 
        });
        
        return {
          ...data,
          cart_summary: data.cart_summary ? {
            ...data.cart_summary,
            total_price: this.normalizePrice(data.cart_summary.total_price)
          } : undefined
        };
      });
    } catch (error) {
      logger.error('Failed to add item to cart', { request, error });
      throw error;
    }
  }

  async updateItem(request: UpdateItemRequest): Promise<CartResponse> {
    try {
      logger.debug('Updating cart item', request);
      
      const requestKey = `update_${request.item_id}_${request.quantity}`;
      return this.debounceRequest(requestKey, async () => {
        const { data } = await this.api.patch<CartResponse>('/update_item/', request);
        logger.info('Successfully updated cart item', { 
          item_id: request.item_id, 
          quantity: request.quantity 
        });
        
        return {
          ...data,
          cart_summary: data.cart_summary ? {
            ...data.cart_summary,
            total_price: this.normalizePrice(data.cart_summary.total_price)
          } : undefined
        };
      });
    } catch (error) {
      logger.error('Failed to update cart item', { request, error });
      throw error;
    }
  }

  async removeItem(itemId: string): Promise<{ message: string; cart_summary: CartSummary }> {
    try {
      logger.debug('Removing item from cart', { itemId });
      
      const { data } = await this.api.delete(`/remove_item/?item_id=${itemId}`);
      logger.info('Successfully removed item from cart', { itemId });
      
      return {
        ...data,
        cart_summary: {
          ...data.cart_summary,
          total_price: this.normalizePrice(data.cart_summary.total_price)
        }
      };
    } catch (error) {
      logger.error('Failed to remove item from cart', { itemId, error });
      throw error;
    }
  }

  async clearCart(): Promise<{ message: string; cart_summary: CartSummary }> {
    try {
      logger.debug('Clearing cart');
      
      const { data } = await this.api.delete('/clear/');
      logger.info('Successfully cleared cart');
      
      return {
        ...data,
        cart_summary: {
          ...data.cart_summary,
          total_price: this.normalizePrice(data.cart_summary.total_price)
        }
      };
    } catch (error) {
      logger.error('Failed to clear cart', error);
      throw error;
    }
  }

  async getCartSummary(): Promise<CartSummary> {
    try {
      logger.debug('Fetching cart summary');
      
      const { data } = await this.api.get<CartSummary>('/summary/');
      logger.info('Successfully fetched cart summary', { total_items: data.total_items });
      
      return {
        ...data,
        total_price: this.normalizePrice(data.total_price)
      };
    } catch (error) {
      logger.error('Failed to fetch cart summary', error);
      throw error;
    }
  }

  async getCartHistory(): Promise<CartHistory[]> {
    try {
      logger.debug('Fetching cart history');
      
      const { data } = await this.api.get<CartHistory[]>('/history/');
      logger.info('Successfully fetched cart history', { count: data.length });
      
      return data.map(item => ({
        ...item,
        total_price: this.normalizePrice(item.total_price)
      }));
    } catch (error) {
      logger.error('Failed to fetch cart history', error);
      throw error;
    }
  }
}

// Singleton instance
const cartService = new CartService();
export default cartService;
