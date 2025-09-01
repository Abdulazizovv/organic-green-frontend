import { toast } from 'react-hot-toast';
import type { Language } from '@/lib/language';

// API throttling handler
export const handleApiError = (error: any) => {
  if (error?.response?.status === 429) {
    toast.error('You are sending too many requests. Please wait a moment 🌱', {
      duration: 4000,
      position: 'top-center',
    });
    return true; // Indicates throttling error
  }
  return false;
};

// Retry function with exponential backoff
export const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<any> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error?.response?.status === 429 && attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};

// Localization helper for product names
export const getLocalizedText = (
  item: { name_uz?: string; name_ru?: string; name_en?: string },
  language: Language,
  type: 'name' = 'name'
): string => {
  const fieldMap = {
    name: { uz: 'name_uz', ru: 'name_ru', en: 'name_en' },
    description: { uz: 'description_uz', ru: 'description_ru', en: 'description_en' }
  };

  const fields = fieldMap[type];
  
  // Try selected language first
  const selectedField = fields[language] as keyof typeof item;
  if (item[selectedField]) {
    return item[selectedField] as string;
  }
  
  // Fallback hierarchy: uz -> en -> ru -> first available
  const fallbackOrder = ['name_uz', 'name_en', 'name_ru'];
  for (const field of fallbackOrder) {
    const fieldKey = field as keyof typeof item;
    if (item[fieldKey]) {
      return item[fieldKey] as string;
    }
  }
  
  return 'Unknown';
};

// Product image URL helper with comprehensive fallbacks
export const getProductImageUrl = (product: any): string | null => {
  console.log('🖼️ Getting image for product:', product.name_en || product.name_uz, {
    primary_image: product.primary_image,
    images: product.images,
    image_url: product.image_url
  });

  // Check primary_image first
  if (product.primary_image && product.primary_image.trim() !== '') {
    console.log('✅ Using primary_image:', product.primary_image);
    return product.primary_image;
  }
  
  // Try first image from images array
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find((img: any) => img.is_primary && img.image && img.image.trim() !== '');
    if (primaryImage && primaryImage.image.trim() !== '') {
      console.log('✅ Using primary image from array:', primaryImage.image);
      return primaryImage.image;
    }
    
    const firstValidImage = product.images.find((img: any) => img.image && img.image.trim() !== '');
    if (firstValidImage && firstValidImage.image.trim() !== '') {
      console.log('✅ Using first valid image:', firstValidImage.image);
      return firstValidImage.image;
    }
  }
  
  // Try image_url fallback
  if (product.image_url && product.image_url.trim() !== '') {
    console.log('✅ Using image_url fallback:', product.image_url);
    return product.image_url;
  }
  
  console.log('❌ No valid image found, returning null');
  return null;
};
