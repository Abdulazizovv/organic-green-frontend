import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from './api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = "UZS"): string {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date, locale: string = "uz-UZ"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// Image utilities for product display
export function getProductImage(product: Product): string | null {
  // Priority order: primary_image -> first image from images array -> null for fallback
  if (product.primary_image) {
    // Handle primary_image as object with image property
    if (typeof product.primary_image === 'object' && 'image' in product.primary_image && product.primary_image.image) {
      return product.primary_image.image;
    }
    // Handle primary_image as string
    if (typeof product.primary_image === 'string' && product.primary_image.trim()) {
      return product.primary_image;
    }
  }
  
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.is_primary);
    if (primaryImage && primaryImage.image && typeof primaryImage.image === 'string') {
      return primaryImage.image;
    }
    
    // Fallback to first image
    const firstImage = product.images[0];
    if (firstImage && firstImage.image && typeof firstImage.image === 'string') {
      return firstImage.image;
    }
  }
  
  // Check legacy image_url field (if exists)
  if ('image_url' in product && (product as any).image_url && typeof (product as any).image_url === 'string') {
    return (product as any).image_url;
  }
  
  return null;
}

export function getProductImageAlt(product: Product, language: 'uz' | 'ru' | 'en' = 'uz'): string {
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
    
    const altKey = `alt_text_${language}` as keyof typeof primaryImage;
    const alt = primaryImage[altKey];
    
    if (alt && typeof alt === 'string') {
      return alt;
    }
    
    // Fallback to uz
    if (language !== 'uz' && primaryImage.alt_text_uz) {
      return primaryImage.alt_text_uz;
    }
  }
  
  // Generate fallback alt text
  const nameKey = `name_${language}` as keyof Product;
  const name = product[nameKey] as string;
  return name || product.name_uz || 'Product image';
}

// Default fallback image (using emoji as inline SVG)
export const DEFAULT_PRODUCT_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f0f9ff'/%3E%3Ctext x='150' y='180' font-family='Arial' font-size='60' text-anchor='middle' fill='%2316a34a'%3E🌱%3C/text%3E%3C/svg%3E";

// API Error handling utilities
export interface APIError {
  status: number;
  message: string;
  details?: any;
}

export function isThrottleError(error: any): boolean {
  return error?.response?.status === 429 || 
         error?.status === 429 ||
         error?.message?.toLowerCase().includes('too many requests') ||
         error?.message?.toLowerCase().includes('rate limit');
}

export function isNetworkError(error: any): boolean {
  return !error?.response && (
    error?.message?.toLowerCase().includes('network') ||
    error?.code === 'NETWORK_ERROR' ||
    error?.code === 'ECONNREFUSED'
  );
}

export function handleAPIError(error: any): APIError {
  console.warn('🚨 API Error occurred:', error);
  
  if (isThrottleError(error)) {
    console.warn('⚠️ API Throttling detected - too many requests');
    return {
      status: 429,
      message: 'Too many requests. Please wait a moment and try again.',
      details: error
    };
  }
  
  if (isNetworkError(error)) {
    console.warn('🌐 Network error detected');
    return {
      status: 0,
      message: 'Network connection error. Please check your internet connection.',
      details: error
    };
  }
  
  if (error?.response?.data?.message) {
    return {
      status: error.response.status || 500,
      message: error.response.data.message,
      details: error.response.data
    };
  }
  
  if (error?.message) {
    return {
      status: error?.response?.status || 500,
      message: error.message,
      details: error
    };
  }
  
  return {
    status: 500,
    message: 'An unexpected error occurred. Please try again.',
    details: error
  };
}

// API retry utility for throttled requests
export async function retryRequest<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      if (isThrottleError(error) && attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        console.warn(`🔄 Retrying request in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Don't retry non-throttle errors
      if (!isThrottleError(error)) {
        throw error;
      }
    }
  }
  
  throw lastError;
}

// Product name utilities for multilanguage support
export function getLocalizedName(
  product: Product | { name_uz: string; name_ru?: string; name_en?: string },
  language: 'uz' | 'ru' | 'en' = 'uz'
): string {
  const nameKey = `name_${language}` as keyof typeof product;
  const localizedName = product[nameKey] as string;
  
  if (localizedName && localizedName.trim()) {
    return localizedName;
  }
  
  // Fallback to uz (main language)
  return product.name_uz || 'Product';
}

export function getLocalizedDescription(
  product: Product,
  language: 'uz' | 'ru' | 'en' = 'uz'
): string {
  const descKey = `description_${language}` as keyof Product;
  const localizedDesc = product[descKey] as string;
  
  if (localizedDesc && localizedDesc.trim()) {
    return localizedDesc;
  }
  
  // Fallback to uz
  return product.description_uz || '';
}

// Category name utilities
export function getLocalizedCategoryName(
  category: { name_uz: string; name_ru?: string; name_en?: string },
  language: 'uz' | 'ru' | 'en' = 'uz'
): string {
  const nameKey = `name_${language}` as keyof typeof category;
  const localizedName = category[nameKey] as string;
  
  if (localizedName && localizedName.trim()) {
    return localizedName;
  }
  
  return category.name_uz || 'Category';
}

// Enhanced price formatting
export function formatPriceSimple(price: string | number, currency: string = "so'm"): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `${numPrice.toLocaleString()} ${currency}`;
}

export function calculateDiscount(originalPrice: string | number, salePrice: string | number): number {
  const original = typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice;
  const sale = typeof salePrice === 'string' ? parseFloat(salePrice) : salePrice;
  
  if (original <= 0 || sale <= 0 || sale >= original) {
    return 0;
  }
  
  return Math.round(((original - sale) / original) * 100);
}

// Image URL builder utility
export function buildImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  
  // If already absolute URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If relative path, prepend API base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https:/api.organicgreen.uz';
  
  // Ensure proper path joining
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${cleanPath}`;
}
