'use client';

import React, { use } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { useProductDetail } from '@/hooks/useProducts';
import { useLanguage, getLocalizedName } from '@/lib/language';
import ProductDetailViewNew from '@/components/product-detail/ProductDetailViewNew';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Properly unwrap params using React.use()
  const { slug } = use(params);
  const { t, language } = useLanguage();
  
  const { product, loading, error, retry } = useProductDetail(slug);

  // Loading state with enhanced skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            <span>/</span>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            <span>/</span>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>

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
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                  <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Loading indicator */}
          <div className="flex justify-center items-center mt-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                {t('loading.product') || 'Loading product details...'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t('loading.please_wait') || 'Please wait a moment'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    const isNotFound = error === 'Product not found';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Back link */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('navigation.back_to_products') || 'Back to Products'}
          </Link>

          <div className="flex justify-center items-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md"
            >
              <div className="text-8xl mb-6">
                {isNotFound ? '🔍' : '🌱'}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {isNotFound 
                  ? (t('error.product_not_found') || 'Product Not Found')
                  : (t('error.something_went_wrong') || 'Something Went Wrong')
                }
              </h1>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                {isNotFound 
                  ? (t('error.product_not_found_desc') || 'The product you are looking for does not exist or has been removed.')
                  : (error || (t('error.failed_to_load') || 'Failed to load product details. Please try again.'))
                }
              </p>
              
              <div className="flex gap-4 justify-center">
                {!isNotFound && (
                  <motion.button
                    onClick={retry}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                  >
                    <RotateCcw className="w-5 h-5" />
                    {t('common.retry') || 'Try Again'}
                  </motion.button>
                )}
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    {t('navigation.back_to_products') || 'Back to Products'}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const productName = getLocalizedName(product, language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-green-600 transition-colors">
            {t('navigation.home') || 'Home'}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-green-600 transition-colors">
            {t('navigation.products') || 'Products'}
          </Link>
          <span>/</span>
          <Link 
            href={`/products?category=${product.category.id}`}
            className="hover:text-green-600 transition-colors"
          >
            {product.localized_category_name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">
            {productName}
          </span>
        </nav>

        {/* Product Detail View */}
        <ProductDetailViewNew product={product} />
      </div>
    </div>
  );
}
  