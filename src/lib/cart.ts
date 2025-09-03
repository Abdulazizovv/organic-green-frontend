import axios, { AxiosInstance } from 'axios';
import { getCartSessionKey, setCartSessionKey, getAccessToken } from './session';
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

// Enhanced logger for session debugging
const logger = {
  info: (message: string, data?: unknown) => {
    console.log(`[CART INFO] ${message}`, data || '');
  },
  error: (message: string, error?: unknown) => {
    console.error(`[CART ERROR] ${message}`, error || '');
  },
  warn: (message: string, data?: unknown) => {
    console.warn(`[CART WARN] ${message}`, data || '');
  },
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[CART DEBUG] ${message}`, data || '');
    }
  },
  session: (message: string, sessionKey?: string | null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SESSION] ${message}`, {
        hasKey: !!sessionKey,
        keyLength: sessionKey?.length || 0,
        keyPreview: sessionKey ? `${sessionKey.substring(0, 12)}...` : 'null',
        fullKey: sessionKey // Show full key in development for debugging
      });
    }
  }
};

class CartService {
  private api: AxiosInstance;
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private sessionInitialized: boolean = false;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/cart`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - attach session key to every request
    this.api.interceptors.request.use(
      async (config) => {
        if (typeof window !== 'undefined') {
          // Ensure session is initialized for non-initialization requests
          if (!config.headers['skip-session-init']) {
            await this.ensureSession();
          }
          
          // Always attach session key if available
          const sessionKey = getCartSessionKey();
          if (sessionKey) {
            config.headers['X-Session-Key'] = sessionKey;
            logger.session('Attaching session key to request', sessionKey);
          } else {
            logger.warn('No session key available for request', { url: config.url });
          }
          
          // Attach JWT token for authenticated users
          const token = getAccessToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - extract and store session key
    this.api.interceptors.response.use(
      (response) => {
        logger.debug('API Response received', { 
          url: response.config.url, 
          status: response.status
        });
        
        // Extract session key from multiple possible locations
        let sessionKey: string | null = null;
        
        // Priority order: owner.session_key > data.session_key > headers
        if (response.data?.owner?.session_key) {
          sessionKey = response.data.owner.session_key;
          logger.session('Found session key in response.data.owner.session_key', sessionKey);
        } else if (response.data?.session_key) {
          sessionKey = response.data.session_key;
          logger.session('Found session key in response.data.session_key', sessionKey);
        } else if (response.headers?.['x-session-key']) {
          sessionKey = response.headers['x-session-key'];
          logger.session('Found session key in response headers (x-session-key)', sessionKey);
        } else if (response.headers?.['X-Session-Key']) {
          sessionKey = response.headers['X-Session-Key'];
          logger.session('Found session key in response headers (X-Session-Key)', sessionKey);
        }
        
        // Store the full session key without any modification
        if (sessionKey && typeof sessionKey === 'string' && sessionKey.length > 0) {
          const currentStoredKey = getCartSessionKey();
          
          // Only update if it's different or missing
          if (!currentStoredKey || currentStoredKey !== sessionKey) {
            setCartSessionKey(sessionKey);
            logger.info('Session key updated from response', {
              source: response.data?.owner?.session_key ? 'owner.session_key' : 
                     response.data?.session_key ? 'data.session_key' : 'headers',
              keyLength: sessionKey.length,
              previousKeyLength: currentStoredKey?.length || 0
            });
          }
        }
        
        return response;
      },
      (error) => {
        const errorDetails = {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data
        };
        
        logger.error('API Error', errorDetails);
        
        // Handle specific error types
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          return Promise.reject(new Error('Unable to connect to server. Please check your internet connection.'));
        }
        
        if (error.response?.status === 0) {
          return Promise.reject(new Error('CORS error: Server is not accessible or CORS is not properly configured.'));
        }
        
        if (error.response?.data) {
          return Promise.reject(this.normalizeError(error.response.data));
        }
        
        return Promise.reject(new Error(`Request failed: ${error.message}`));
      }
    );
  }

  // Public method to reset session state (useful for debugging or manual retry)
  resetSession(): void {
    this.sessionInitialized = false;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart_session_key');
    }
    logger.info('Session state reset');
  }

  // Public method to force session reinitialization (useful for guest checkout)
  async forceSessionRefresh(): Promise<void> {
    this.sessionInitialized = false;
    await this.ensureSession();
    logger.info('Session refreshed');
  }

  // Public method to get current session status
  getSessionStatus(): { 
    initialized: boolean; 
    hasStoredKey: boolean; 
    keyLength: number;
    keyPreview: string | null;
  } {
    const storedKey = getCartSessionKey();
    return {
      initialized: this.sessionInitialized,
      hasStoredKey: !!storedKey,
      keyLength: storedKey?.length || 0,
      keyPreview: storedKey ? `${storedKey.substring(0, 12)}...${storedKey.substring(-4)}` : null
    };
  }

  private async ensureSession(): Promise<void> {
    if (this.sessionInitialized) return;
    
    const existingSessionKey = getCartSessionKey();
    if (existingSessionKey && existingSessionKey.length > 0) {
      this.sessionInitialized = true;
      logger.session('Using existing session key', existingSessionKey);
      return;
    }

    try {
      logger.debug('Initializing new session by fetching current cart');
      
      // Create a clean axios instance for session initialization
      const tempApi = axios.create({
        baseURL: `${API_BASE_URL}/cart`,
        headers: { 
          'Content-Type': 'application/json',
          'skip-session-init': 'true' // Prevent infinite loops
        },
        withCredentials: true,
        timeout: 10000, // 10 second timeout for initial request
      });

      const { data } = await tempApi.get<Cart>('/current/');
      
      logger.info('Session initialization response received', {
        hasOwner: !!data.owner,
        ownerType: data.owner?.type,
        hasSessionKey: !!data.owner?.session_key,
        sessionKeyLength: data.owner?.session_key?.length || 0
      });
      
      // Extract and validate session key
      if (data.owner?.session_key && typeof data.owner.session_key === 'string' && data.owner.session_key.length > 0) {
        const sessionKey = data.owner.session_key.trim();
        setCartSessionKey(sessionKey);
        this.sessionInitialized = true;
        
        logger.session('Session initialized successfully', sessionKey);
        logger.info('New session created', {
          keyLength: sessionKey.length,
          ownerType: data.owner.type
        });
      } else {
        logger.warn('Invalid or missing session key in response', {
          hasOwner: !!data.owner,
          sessionKeyType: typeof data.owner?.session_key,
          sessionKeyValue: data.owner?.session_key
        });
        this.sessionInitialized = true; // Prevent infinite loops
      }
    } catch (error: unknown) {
      logger.error('Failed to initialize session', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: error && typeof error === 'object' && 'code' in error ? error.code : undefined,
        status: error && typeof error === 'object' && 'response' in error && 
                error.response && typeof error.response === 'object' && 'status' in error.response ? 
                error.response.status : undefined
      });
      
      // Mark as initialized to prevent infinite retry loops
      this.sessionInitialized = true;
      
      // Don't throw the error - let the app continue without session
      // The individual API calls will handle their own errors
    }
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
      return this.pendingRequests.get(key)! as Promise<T>;
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
    } catch (error: unknown) {
      logger.error('Failed to fetch current cart', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: error && typeof error === 'object' && 'code' in error ? error.code : undefined
      });
      
      // Return empty cart structure on network errors
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('connect to server') || errorMessage.includes('CORS')) {
        logger.warn('Returning empty cart due to connection issues');
        return {
          id: '',
          items: [],
          total_price: 0,
          total_items: 0,
          items_count: 0,
          is_empty: true,
          owner: {
            type: 'anonymous' as const
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
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
        const { data } = await this.api.post<CartResponse>('/add_item/', request);
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
          } : {
            total_items: 0,
            total_price: 0,
            items_count: 0,
            is_empty: true
          }
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
        console.log('🔄 CartService: Updating item with request:', request);
        console.log('🔗 CartService: API endpoint:', `${this.api.defaults.baseURL}/update_item/`);
        
        const { data } = await this.api.patch<CartResponse>('/update_item/', request);
        
        console.log('✅ CartService: Update item response:', data);
        logger.info('Successfully updated cart item', { 
          item_id: request.item_id, 
          quantity: request.quantity 
        });
        
        return {
          ...data,
          cart_summary: data.cart_summary ? {
            ...data.cart_summary,
            total_price: this.normalizePrice(data.cart_summary.total_price)
          } : {
            total_items: 0,
            total_price: 0,
            items_count: 0,
            is_empty: true
          }
        };
      });
    } catch (error) {
      console.error('❌ CartService: Update item failed:', error);
      console.error('❌ CartService: Update item request was:', request);
      if (error instanceof Error) {
        console.error('❌ CartService: Error message:', error.message);
      }
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
      
      return data;
    } catch (error) {
      logger.error('Failed to fetch cart history', error);
      throw error;
    }
  }
}

// Singleton instance
const cartService = new CartService();
export default cartService;
