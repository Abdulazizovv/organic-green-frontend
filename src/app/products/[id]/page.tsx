'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { Product, productsAPI } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import { getLocalizedName, getLocalizedDescription, handleAPIError } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

import ProductDetailView from '@/components/product-detail/ProductDetailView';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

// Helper function to detect if param is UUID or slug
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;
  const { t } = useLanguage();
  const { showError } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch product by ID or slug
        const productData = isUUID(id) 
          ? await productsAPI.getById(id)
          : await productsAPI.getBySlug(id);
        
        if (!productData) {
          notFound();
          return;
        }
        
        setProduct(productData);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        const apiError = handleAPIError(err);
        setError(apiError.message);
        showError(apiError.message, 'Product Error');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id, showError]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
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
              <motion.a
                href="/products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('common.back_to_products') || 'Back to Products'}
              </motion.a>
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
