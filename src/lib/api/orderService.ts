import axios, { AxiosInstance } from 'axios';
import { getCartSessionKey, setCartSessionKey, getAccessToken } from '@/lib/session';
import type {
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderStats,
  OrdersResponse,
  OrderAPIError
} from '@/types/order';
import type { Cart } from '@/types/cart';

const API_BASE_URL = 'https://api.organicgreen.uz/api';

// Logger utility for debugging
const logger = {
  info: (message: string, data?: unknown) => {
    console.log(`[ORDER INFO] ${message}`, data || '');
  },
  error: (message: string, error?: unknown) => {
    console.error(`[ORDER ERROR] ${message}`, error || '');
  },
  warn: (message: string, data?: unknown) => {
    console.warn(`[ORDER WARN] ${message}`, data || '');
  },
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[ORDER DEBUG] ${message}`, data || '');
    }
  }
};

class OrderService {
  private api: AxiosInstance;
  private cartApi: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/orders`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true, // Enable cookies support
    });

    this.cartApi = axios.create({
      baseURL: `${API_BASE_URL}/cart`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Setup interceptors for both API instances
    [this.api, this.cartApi].forEach(apiInstance => {
      // Request interceptor for auth/session
      apiInstance.interceptors.request.use(
        async (config) => {
          if (typeof window !== 'undefined') {
            // JWT token if authenticated
            const token = getAccessToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            } else {
              // Session key for anonymous users
              const sessionKey = getCartSessionKey();
              if (sessionKey) {
                config.headers['X-Session-Key'] = sessionKey;
                
                logger.debug('Adding session key to request', { 
                  url: config.url,
                  sessionKey: sessionKey.substring(0, 8) + '...'
                });
              }
            }
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response interceptor for error handling and session management
      apiInstance.interceptors.response.use(
        (response) => {
          logger.debug('API Response', { 
            url: response.config.url, 
            status: response.status,
            hasSessionKey: !!response.data?.owner?.session_key
          });
          
          // Extract and store session key from response if available
          if (response.data?.owner?.session_key) {
            setCartSessionKey(response.data.owner.session_key);
            logger.debug('Stored session key from response');
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
          
          // Handle specific error messages from backend
          if (error.response?.status === 400 && error.response?.data?.message === "savat bo'sh") {
            const enhancedError = new Error('Cart is empty on server') as Error & { 
              isEmptyCartError: boolean; 
              originalError: unknown; 
            };
            enhancedError.isEmptyCartError = true;
            enhancedError.originalError = error;
            return Promise.reject(enhancedError);
          }
          
          // Handle 429 (rate limiting)
          if (error.response?.status === 429) {
            return Promise.reject(new Error('Too many requests 🌱 Please wait a moment'));
          }
          
          // Transform API errors to user-friendly messages
          if (error.response?.data) {
            const apiError = error.response.data as OrderAPIError;
            error.userMessage = this.getErrorMessage(apiError);
          }
          
          return Promise.reject(error);
        }
      );
    });
  }

  /**
   * Ensure cart session is initialized by calling GET /cart/current/
   * This must be called before order creation for guest users
   */
  private async ensureCartSession(): Promise<Cart> {
    try {
      logger.debug('Ensuring cart session is initialized');
      
      const { data } = await this.cartApi.get<Cart>('/current/');
      
      // Store session key if provided
      if (data.owner?.session_key) {
        setCartSessionKey(data.owner.session_key);
        logger.info('Cart session initialized', {
          sessionKey: data.owner.session_key.substring(0, 8) + '...',
          itemsCount: data.items?.length || 0
        });
      }
      
      return data;
    } catch (error) {
      logger.error('Failed to initialize cart session', error);
      throw new Error('Failed to initialize cart session');
    }
  }

  /**
   * Sync local cart items to server cart
   */
  private async syncCartItems(localCartItems: Array<{ product_id: string; quantity: number }>): Promise<void> {
    logger.info('Syncing local cart items to server', { itemsCount: localCartItems.length });
    
    const syncPromises = localCartItems.map(async (item, index) => {
      try {
        // Add a small delay between requests to avoid rate limiting
        if (index > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        await this.cartApi.post<{ message: string; item: unknown; cart_total: string }>('/add_item/', {
          product_id: item.product_id,
          quantity: item.quantity
        });
        
        logger.debug('Synced item to server cart', item);
      } catch (error) {
        logger.error('Failed to sync item', { item, error });
        throw error;
      }
    });

    await Promise.all(syncPromises);
    logger.info('Successfully synced all cart items to server');
  }

  private getErrorMessage(error: OrderAPIError): string {
    // Handle specific field errors
    if (error.full_name?.[0]) return error.full_name[0];
    if (error.contact_phone?.[0]) return error.contact_phone[0];
    if (error.delivery_address?.[0]) return error.delivery_address[0];
    if (error.payment_method?.[0]) return error.payment_method[0];
    
    // Handle cart-related errors
    if (error.message === "savat bo'sh") return 'Cart is empty';
    if (error.message?.includes('stock')) return error.message;
    
    // Generic error message
    return error.message || 'An error occurred while processing your request';
  }

  /**
   * Create a new order from current cart with robust session and cart handling
   */
  async createOrder(
    orderData: CreateOrderRequest, 
    localCartItems?: Array<{ product_id: string; quantity: number }>
  ): Promise<CreateOrderResponse> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      
      try {
        logger.info(`Creating order (attempt ${attempt}/${maxRetries})`, {
          orderData: { ...orderData, contact_phone: orderData.contact_phone ? '***' : undefined },
          hasLocalCartItems: !!localCartItems,
          localCartItemsCount: localCartItems?.length || 0
        });

        // Step 1: Ensure cart session is initialized
        logger.debug('Step 1: Ensuring cart session');
        const serverCart = await this.ensureCartSession();
        
        logger.debug('Server cart status', {
          itemsCount: serverCart.items?.length || 0,
          totalPrice: serverCart.total_price,
          isEmpty: serverCart.is_empty,
          hasSessionKey: !!serverCart.owner?.session_key
        });

        // Step 2: Check if server cart is empty but we have local cart items
        if ((!serverCart.items || serverCart.items.length === 0) && localCartItems && localCartItems.length > 0) {
          logger.warn('Server cart empty but local cart has items, attempting sync', {
            localItemsCount: localCartItems.length
          });
          
          // Attempt to sync local cart to server
          await this.syncCartItems(localCartItems);
          
          // Re-fetch cart after sync
          const syncedCart = await this.ensureCartSession();
          logger.info('Cart sync completed', {
            itemsCount: syncedCart.items?.length || 0,
            totalPrice: syncedCart.total_price
          });
        }

        // Step 3: Create the order
        logger.debug('Step 3: Creating order with current cart');
        const { data } = await this.api.post<CreateOrderResponse>('/create_order/', orderData);
        
        logger.info('Order created successfully', { 
          order_number: data.order.order_number,
          total_price: data.order.total_price,
          status: data.order.status
        });
        
        return data;

      } catch (error: unknown) {
        const isEmptyCartError = error && typeof error === 'object' && 'isEmptyCartError' in error;
        
        logger.error(`Order creation failed (attempt ${attempt}/${maxRetries})`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          isEmptyCartError,
          willRetry: attempt < maxRetries && (isEmptyCartError || attempt === 1)
        });

        // If this is an empty cart error and we have local items, try to sync on next attempt
        if (isEmptyCartError && localCartItems && localCartItems.length > 0 && attempt < maxRetries) {
          logger.info('Retrying order creation with cart sync');
          continue;
        }

        // For other errors or final attempt, throw the error
        if (error instanceof Error) {
          // Add user-friendly message for cart empty error
          if (isEmptyCartError) {
            throw new Error('Your cart appears to be empty. Please add items to your cart and try again.');
          }
          throw error;
        }
        
        throw new Error('Failed to create order');
      }
    }

    throw new Error('Failed to create order after multiple attempts');
  }

  /**
   * Get list of user's orders
   */
  async getOrders(page = 1, limit = 10): Promise<OrdersResponse> {
    try {
      logger.debug('Fetching orders', { page, limit });
      
      const { data } = await this.api.get<OrdersResponse>('/', {
        params: { page, page_size: limit }
      });
      
      logger.info('Orders fetched successfully', { 
        count: data.count,
        results: data.results.length 
      });
      
      return data;
    } catch (error) {
      logger.error('Failed to fetch orders', error);
      throw new Error('Failed to load orders');
    }
  }

  /**
   * Get specific order details
   */
  async getOrderDetail(orderId: string): Promise<Order> {
    try {
      logger.debug('Fetching order detail', { orderId });
      
      const { data } = await this.api.get<Order>(`/${orderId}/`);
      
      logger.info('Order detail fetched successfully', { 
        order_number: data.order_number,
        status: data.status 
      });
      
      return data;
    } catch (error) {
      logger.error('Failed to fetch order detail', error);
      throw new Error('Failed to load order details');
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<{ message: string }> {
    try {
      logger.info('Canceling order', { orderId });
      
      const { data } = await this.api.post<{ message: string }>(`/${orderId}/cancel/`);
      
      logger.info('Order canceled successfully', { orderId });
      
      return data;
    } catch (error) {
      logger.error('Failed to cancel order', error);
      throw new Error('Failed to cancel order');
    }
  }

  /**
   * Get order statistics (if user has permission)
   */
  async getOrderStats(): Promise<OrderStats> {
    try {
      logger.debug('Fetching order statistics');
      
      const { data } = await this.api.get<OrderStats>('/stats/');
      
      logger.info('Order statistics fetched successfully', data);
      
      return data;
    } catch (error) {
      logger.error('Failed to fetch order statistics', error);
      throw new Error('Failed to load order statistics');
    }
  }

  /**
   * Get API information
   */
  async getApiInfo(): Promise<{ message: string; version: string }> {
    try {
      const { data } = await this.api.get('/info/');
      return data;
    } catch (error) {
      logger.error('Failed to fetch API info', error);
      throw new Error('Failed to load API information');
    }
  }
}

// Singleton instance
const orderService = new OrderService();
export default orderService;
