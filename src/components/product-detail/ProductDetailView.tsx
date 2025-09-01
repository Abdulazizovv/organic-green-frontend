'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { Product } from '@/lib/api';
import { useLanguage } from '@/lib/language';

import ImageGallery from './ImageGallery';
import ProductInfo from './ProductInfo';
import PriceBlock from './PriceBlock';
import StockBadge from './StockBadge';
import AddToCartPanel from './AddToCartPanel';
import SuggestedProducts from './SuggestedProducts';

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="space-y-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12"
      >
        {/* Image Gallery */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ImageGallery product={product} />
        </motion.div>

        {/* Product Information Panel */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Price and Stock */}
          <div className="space-y-4">
            <PriceBlock product={product} />
            <StockBadge product={product} />
          </div>

          {/* Add to Cart Panel */}
          <AddToCartPanel product={product} />
        </motion.div>

        {/* Product Details - Full Width */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <ProductInfo product={product} />
        </motion.div>
      </motion.div>

      {/* Suggested Products */}
      {product.suggested_products && product.suggested_products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <SuggestedProducts products={product.suggested_products} />
        </motion.div>
      )}
    </div>
  );
}
