'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, Info, Tag } from 'lucide-react';

import { Product } from '@/lib/api';
import { getLocalizedName, getLocalizedDescription } from '@/lib/utils';
import { useLanguage } from '@/lib/language';
import TagChips from './TagChips';
import AdvantagesList from './AdvantagesList';

interface ProductInfoProps {
  product: Product;
  className?: string;
}

export default function ProductInfo({ product, className = '' }: ProductInfoProps) {
  const { language, t } = useLanguage();

  const productName = getLocalizedName(product, language);
  const productDescription = getLocalizedDescription(product, language);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-6 ${className}`}
    >
      {/* Product Title */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
          {productName}
        </h1>
        
        {/* Category */}
        <div className="mt-2 flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600 text-sm">
            {t('product.category')}: 
            <span className="font-medium text-gray-700 ml-1">
              {getLocalizedName(product.category, language)}
            </span>
          </span>
        </div>
      </motion.div>

      {/* Product Description */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            {t('product.description') || 'Description'}
          </h2>
        </div>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {productDescription}
          </p>
        </div>
      </motion.div>

      {/* Tags Section */}
      {product.tags && product.tags.length > 0 && (
        <motion.div variants={itemVariants}>
          <TagChips product={product} />
        </motion.div>
      )}

      {/* Advantages Section */}
      <motion.div variants={itemVariants}>
        <AdvantagesList product={product} />
      </motion.div>

      {/* Product Details */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Tag className="w-5 h-5 text-gray-600" />
          {t('product.details') || 'Product Details'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Product ID */}
          <div className="bg-gray-50 p-3 rounded-lg border">
            <dt className="text-sm font-medium text-gray-500">
              {t('product.id') || 'Product ID'}
            </dt>
            <dd className="text-sm text-gray-900 font-mono">
              {product.id.slice(0, 8)}...
            </dd>
          </div>

          {/* Availability */}
          <div className="bg-gray-50 p-3 rounded-lg border">
            <dt className="text-sm font-medium text-gray-500">
              {t('product.availability') || 'Availability'}
            </dt>
            <dd className="text-sm text-gray-900">
              {product.is_active 
                ? (t('product.available') || 'Available') 
                : (t('product.unavailable') || 'Unavailable')
              }
            </dd>
          </div>

          {/* Updated Date */}
          <div className="bg-gray-50 p-3 rounded-lg border">
            <dt className="text-sm font-medium text-gray-500">
              {t('product.last_updated') || 'Last Updated'}
            </dt>
            <dd className="text-sm text-gray-900">
              {new Date(product.updated_at).toLocaleDateString(
                language === 'uz' ? 'uz-UZ' : 
                language === 'ru' ? 'ru-RU' : 'en-US'
              )}
            </dd>
          </div>

          {/* Featured Badge */}
          {product.is_featured && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200">
              <dt className="text-sm font-medium text-green-600">
                {t('product.featured') || 'Featured Product'}
              </dt>
              <dd className="text-sm text-green-700">
                {t('product.featured_desc') || 'This is a premium featured product'}
              </dd>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tags list display */}
      {product.tag_list && product.tag_list.length > 0 && (
        <motion.div variants={itemVariants} className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">
            {t('product.keywords') || 'Keywords'}:
          </p>
          <div className="flex flex-wrap gap-1">
            {product.tag_list.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
