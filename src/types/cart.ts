// Core Cart Types - Production Ready
export interface Product {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  slug: string;
  price: string;
  sale_price?: string;
  current_price: number;
  is_on_sale: boolean;
  stock: number;
  image_url?: string;
  primary_image_url?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_available?: boolean;
  max_quantity?: number;
  added_at: string;
}

export interface Cart {
  id: string;
  owner: {
    type: 'anonymous' | 'authenticated';
    session_key?: string;
    user?: Record<string, unknown>;
  };
  items: CartItem[];
  total_items: number;
  total_price: number;
  items_count: number;
  is_empty: boolean;
  created_at: string;
  updated_at: string;
  message?: string;
}

export interface CartSummary {
  total_items: number;
  total_price: string | number;
  items_count: number;
  subtotal?: number;
  total_discount?: number;
  savings?: number;
  is_empty?: boolean;
}

export interface CartHistoryEntry {
  id: string;
  action: string;
  product_name: string;
  quantity: number;
  price: string;
  created_at: string;
}

export interface CartHistory {
  count: number;
  next: string | null;
  previous: string | null;
  results: CartHistoryEntry[];
}

// API Request/Response Types
export interface AddItemRequest {
  product_id: string;
  quantity: number;
}

export interface UpdateItemRequest {
  item_id: string;
  quantity: number;
}

export interface CartResponse {
  message: string;
  item: CartItem;
  cart_summary: CartSummary;
}

export interface APIError {
  product_id?: string[];
  quantity?: string[];
  message?: string;
}

// Utility Types
export type CartAction = 
  | 'add_item'
  | 'update_item' 
  | 'remove_item'
  | 'clear_cart'
  | 'load_cart';

export interface OptimisticUpdate {
  action: CartAction;
  payload: unknown;
  rollback: () => void;
}
