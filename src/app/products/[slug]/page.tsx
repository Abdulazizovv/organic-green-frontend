'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { Product, productsAPI, favoritesAPI } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import { handleAPIError } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

import ProductDetailView from '@/components/product-detail/ProductDetailView';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Properly unwrap params using React.use()
  const { slug } = use(params);
  const { t } = useLanguage();
  const { showError, showThrottleWarning } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch product by slug
        const productData = await productsAPI.getBySlug(slug);
        
        if (!productData) {
          notFound();
          return;
        }
        
        setProduct(productData);
      } catch (err: any) {
        console.error('Failed to fetch product:', err);
        
        // Handle 429 throttling specifically
        if (err?.response?.status === 429) {
          showThrottleWarning();
          // Auto retry after delay
          setTimeout(() => {
            if (retryCount < 3) {
              setRetryCount(prev => prev + 1);
              fetchProduct();
            }
          }, 2000 + (retryCount * 1000)); // Exponential backoff
          return;
        }
        
        const apiError = handleAPIError(err);
        setError(apiError.message);
        showError(apiError.message, 'Product Error');
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug, showError, showThrottleWarning, retryCount]);

  // Retry function for manual retry
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    setError(null);
    setIsLoading(true);
    // Trigger useEffect by updating a dependency
    setTimeout(() => {
      setRetryCount(prev => prev + 1);
    }, 100);
  }, []);

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Image skeleton */}
            <div className="lg:col-span-2">
              <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse mb-4"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Info skeleton */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Loading indicator */}
          <div className="flex justify-center items-center mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-2" />
              <p className="text-gray-600">
                {t('loading.product') || 'Loading product...'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🌱</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('error.product_not_found') || 'Product not found'}
              </h1>
              <p className="text-gray-600 mb-6">
                {error || (t('error.product_not_found_desc') || 'The product you are looking for does not exist.')}
              </p>
              
              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={handleRetry}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t('common.retry') || 'Retry'}
                </motion.button>
                
                <motion.a
                  href="/products"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t('common.back_to_products') || 'Back to Products'}
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <ProductDetailView product={product} />
      </div>
    </div>
  );
}
