// Error handling utilities for Cart
import type { APIError } from '@/types/cart';

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    const apiError = error as APIError;
    
    // Handle validation errors
    if (apiError.product_id) {
      return apiError.product_id[0];
    }
    
    if (apiError.quantity) {
      return apiError.quantity[0];
    }
    
    if (apiError.message) {
      return apiError.message;
    }
  }
  
  return 'An unexpected error occurred';
}

export function isStockError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return message.includes('omborda yetarli emas') || 
         message.includes('Mavjud:') ||
         message.includes('insufficient stock');
}

export function isProductNotFoundError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return message.includes('mavjud emas') || 
         message.includes('not found') ||
         message.includes('does not exist');
}

// User-friendly error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Tarmoq xatosi. Internetni tekshiring.',
  CART_LOAD_FAILED: 'Savatni yuklashda xatolik.',
  ADD_ITEM_FAILED: 'Mahsulotni savatga qo\'shishda xatolik.',
  UPDATE_ITEM_FAILED: 'Mahsulot miqdorini yangilashda xatolik.',
  REMOVE_ITEM_FAILED: 'Mahsulotni o\'chirishda xatolik.',
  CLEAR_CART_FAILED: 'Savatni tozalashda xatolik.',
  PRODUCT_NOT_FOUND: 'Mahsulot topilmadi.',
  INSUFFICIENT_STOCK: 'Omborda yetarli mahsulot mavjud emas.',
  INVALID_QUANTITY: 'Noto\'g\'ri miqdor kiritildi.',
} as const;
