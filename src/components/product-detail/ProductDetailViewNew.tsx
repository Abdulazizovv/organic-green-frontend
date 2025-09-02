'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { Product } from '@/api/products';
import { useLanguage } from '@/lib/language';

import ImageGalleryNew from './ImageGalleryNew';
import ProductInfoNew from './ProductInfoNew';
import AddToCartPanelNew from './AddToCartPanelNew';
import SuggestedProductsNew from './SuggestedProductsNew';

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
        {/* Image Gallery - Takes 2 columns on large screens */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ImageGalleryNew product={product} />
        </motion.div>

        {/* Product Information Panel - Takes 1 column on large screens */}
        <motion.div variants={itemVariants} className="space-y-6">
          <AddToCartPanelNew product={product} />
        </motion.div>
      </motion.div>

      {/* Product Details - Full Width */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        className="w-full"
      >
        <ProductInfoNew product={product} />
      </motion.div>

      {/* Suggested Products */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <SuggestedProductsNew productId={product.id} />
      </motion.div>
    </div>
  );
}
