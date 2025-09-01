'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLocalizedText } from '@/utils/api-helpers';
import { useLanguage } from '@/lib/language';
import type { Category } from '@/lib/api';

interface CategoryFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  className?: string;
}

export const CategoryFilters = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className = ''
}: CategoryFiltersProps) => {
  const { language, t } = useLanguage();

  console.log('🏷️ CategoryFilters rendered:', {
    categoriesCount: categories.length,
    categories: categories.map(cat => ({ id: cat.id, name: getLocalizedText(cat, language, 'name') })),
    selectedCategory,
    language
  });

  const handleCategoryClick = (categoryId: string | null) => {
    console.log('🔄 Category clicked:', categoryId);
    onCategorySelect(categoryId);
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* All Categories Pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={() => handleCategoryClick(null)}
          variant={selectedCategory === null ? 'default' : 'outline'}
          className={`
            relative px-6 py-2 rounded-full font-medium transition-all duration-300 border-2
            ${selectedCategory === null 
              ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200' 
              : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600 hover:bg-green-50'
            }
          `}
        >
          {t('All Categories') || 'All Categories'}
          {selectedCategory === null && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 bg-green-600 rounded-full -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </Button>
      </motion.div>

      {/* Category Pills */}
      {categories.map((category, index) => {
        const categoryName = getLocalizedText(category, language, 'name');
        const categoryId = category.id;
        const isSelected = selectedCategory === categoryId;
        
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Button
              onClick={() => handleCategoryClick(categoryId)}
              variant={isSelected ? 'default' : 'outline'}
              className={`
                relative px-6 py-2 rounded-full font-medium transition-all duration-300 border-2 group
                ${isSelected 
                  ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600 hover:bg-green-50'
                }
              `}
            >
              {categoryName}
              
              {/* Active state background */}
              {isSelected && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-green-600 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Clear button for selected category */}
              {isSelected && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="ml-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick(null);
                  }}
                >
                  <X className="w-3 h-3" />
                </motion.span>
              )}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

// Mobile-friendly horizontal scrollable version
export const CategoryFiltersScrollable = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className = ''
}: CategoryFiltersProps) => {
  const { language, t } = useLanguage();

  return (
    <div className={`relative ${className}`}>
      {/* Gradient fade on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 px-4">
        {/* All Categories */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-shrink-0"
        >
          <Button
            onClick={() => onCategorySelect(null)}
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            className={`
              relative px-4 py-2 rounded-full font-medium transition-all duration-300 border-2 whitespace-nowrap
              ${selectedCategory === null 
                ? 'bg-green-600 text-white border-green-600 shadow-md' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600'
              }
            `}
          >
            {t('All') || 'All'}
            {selectedCategory === null && (
              <motion.div
                layoutId="activeCategoryMobile"
                className="absolute inset-0 bg-green-600 rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Button>
        </motion.div>

        {/* Categories */}
        {categories.map((category, index) => {
          const categoryName = getLocalizedText(category, language, 'name');
          const categoryId = category.id;
          const isSelected = selectedCategory === categoryId;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="flex-shrink-0"
            >
              <Button
                onClick={() => onCategorySelect(categoryId)}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                className={`
                  relative px-4 py-2 rounded-full font-medium transition-all duration-300 border-2 whitespace-nowrap
                  ${isSelected 
                    ? 'bg-green-600 text-white border-green-600 shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600'
                  }
                `}
              >
                {categoryName}
                
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryMobile"
                    className="absolute inset-0 bg-green-600 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
