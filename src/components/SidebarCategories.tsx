'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Filter, Leaf, Award, Shield } from 'lucide-react';
import { useCategories } from '@/lib/hooks';
import { useLanguage, getLocalizedName } from '@/lib/language';

interface SidebarCategoriesProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarCategories({
  selectedCategory,
  onCategorySelect,
  className = '',
  isMobile = false,
  isOpen = true,
  onClose
}: SidebarCategoriesProps) {
  const { data: categoriesData, loading } = useCategories();
  const { language, t } = useLanguage();
  
  const categories = Array.isArray(categoriesData?.results) ? categoriesData.results : [];

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-green-600" />
            {t('Categories')}
          </h3>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Categories List */}
      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* All Products */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick('')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === ''
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                  : 'hover:bg-green-50 text-gray-700'
              }`}
            >
              {t('All Products')}
            </motion.button>

            {/* Category List */}
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                    : 'hover:bg-green-50 text-gray-700'
                }`}
              >
                {getLocalizedName(category, language)}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Eco Features Badges */}
      <div className="p-4 border-t border-gray-100 bg-gradient-to-b from-white to-green-50/30">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          {t('Why Choose Organic Green?')}
        </h4>
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-green-100"
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t('features.organic.title')}</p>
              <p className="text-xs text-gray-600">{t('features.organic.description')}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-green-100"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t('features.fresh.title')}</p>
              <p className="text-xs text-gray-600">{t('features.fresh.description')}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-green-100"
          >
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t('features.quality.title')}</p>
              <p className="text-xs text-gray-600">{t('features.quality.description')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            />
            
            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 max-w-[90vw] z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="w-64 flex-shrink-0">
      {sidebarContent}
    </div>
  );
}
