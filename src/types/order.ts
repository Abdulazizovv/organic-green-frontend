// Order Types - Production Ready
export interface Order {
  id: string;
  order_number: string;
  user?: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  session_key?: string;
  
  // Contact Information
  full_name: string;
  contact_phone: string;
  delivery_address: string;
  notes?: string;
  
  // Payment & Status
  payment_method: 'cod' | 'click' | 'payme' | 'card' | 'none';
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  
  // Financial
  subtotal: number;
  discount_total: number;
  total_price: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Items
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order: string;
  
  // Product snapshot
  product_id: string;
  product_name_uz: string;
  product_name_ru: string;
  product_name_en: string;
  product_slug: string;
  product_image_url?: string;
  
  // Order details
  quantity: number;
  unit_price: number;
  sale_price?: number;
  total_price: number;
}

export interface CreateOrderRequest {
  full_name?: string;
  contact_phone?: string;
  delivery_address: string;
  notes?: string;
  payment_method: 'cod' | 'click' | 'payme' | 'card';
}

export interface CreateOrderResponse {
  success: boolean;
  order: Order;
  message: string;
}

export interface OrderStats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: number;
}

export interface OrdersResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Order[];
}

// API Error Types
export interface OrderAPIError {
  error?: string;
  message?: string;
  detail?: string;
  non_field_errors?: string[];
  full_name?: string[];
  contact_phone?: string[];
  delivery_address?: string[];
  payment_method?: string[];
  cart?: string[];
}
