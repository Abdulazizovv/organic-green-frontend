'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

import { Product } from '@/lib/api';
import { formatPriceSimple } from '@/lib/utils';
import { useLanguage } from '@/lib/language';

interface PriceBlockProps {
  product: Product;
  className?: string;
}

export default function PriceBlock({ product, className = '' }: PriceBlockProps) {
  const { t } = useLanguage();

  const originalPrice = parseFloat(product.price);
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const finalPrice = parseFloat(product.final_price);
  const isOnSale = product.is_on_sale && salePrice && salePrice < originalPrice;

  // Calculate discount percentage
  const discountPercent = isOnSale 
    ? Math.round(((originalPrice - (salePrice || finalPrice)) / originalPrice) * 100)
    : 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Current Price */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <span className="text-3xl font-bold text-gray-900">
            {formatPriceSimple(finalPrice)}
          </span>
          
          {/* Sale Badge */}
          {isOnSale && discountPercent > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium"
            >
              <Tag className="w-3 h-3" />
              -{discountPercent}%
            </motion.div>
          )}
        </motion.div>

        {/* Original Price (if on sale) */}
        {isOnSale && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 line-through font-medium"
          >
            {formatPriceSimple(originalPrice)}
          </motion.span>
        )}
      </div>

      {/* Sale Information */}
      {isOnSale && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm text-green-600 font-medium">
            {t('product.you_save') || 'You save'}: {formatPriceSimple(originalPrice - finalPrice)}
          </span>
        </motion.div>
      )}

      {/* Price per unit (if applicable) */}
      {product.category?.name_uz?.toLowerCase().includes('микрозелень') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-600"
        >
          {t('product.price_per_100g') || 'Price per 100g'}
        </motion.div>
      )}
    </div>
  );
}
