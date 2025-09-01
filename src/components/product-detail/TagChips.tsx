'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';

import { Product } from '@/lib/api';
import { getLocalizedName } from '@/lib/utils';
import { useLanguage } from '@/lib/language';

interface TagChipsProps {
  product: Product;
  className?: string;
}

export default function TagChips({ product, className = '' }: TagChipsProps) {
  const { language, t } = useLanguage();

  if (!product.tags || product.tags.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const chipVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Hash className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {t('product.tags') || 'Tags'}
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {product.tags.map((tag, index) => {
          const tagName = getLocalizedName(tag, language);
          
          return (
            <motion.span
              key={tag.id}
              variants={chipVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)"
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200 hover:bg-green-100 hover:border-green-300 transition-all duration-200 cursor-default"
            >
              <span className="text-green-500 mr-1">#</span>
              {tagName}
            </motion.span>
          );
        })}
      </motion.div>

      {/* Tag description if available */}
      {product.tags.length > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-600 italic"
        >
          {t('product.tags_desc') || 'Product categories and characteristics'}
        </motion.p>
      )}
    </div>
  );
}
