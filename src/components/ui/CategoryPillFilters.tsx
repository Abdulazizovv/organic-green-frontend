'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, RefreshCw, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/context/ToastContext';
import { categoriesAPI } from '@/lib/api';
import { 
  getLocalizedCategoryName, 
  isThrottleError, 
  handleAPIError 
} from '@/lib/utils';
import type { Category } from '@/lib/api';

interface CategoryPillFiltersProps {
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  className?: string;
}

function CategoryPillFilters({ 
  selectedCategoryId, 
  onCategoryChange, 
  className = '' 
}: CategoryPillFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { language, t } = useLanguage();
  const { showThrottleWarning, showError } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load categories
  const loadCategories = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      console.log('🏷️ CategoryPillFilters: Loading categories...');
      const data = await categoriesAPI.getAll();
      
      console.log('🏷️ CategoryPillFilters: Categories loaded:', data);
      
      // Ensure data is an array
      const categoriesArray = Array.isArray(data) ? data : (data && typeof data === 'object' && 'results' in data ? (data as any).results || [] : []);
      setCategories(categoriesArray);
      
      console.log('🏷️ CategoryPillFilters: Final categories array:', categoriesArray.length);
      
      // Update scroll indicators after categories load
      setTimeout(() => {
        updateScrollIndicators();
      }, 100);
      
    } catch (err) {
      console.error('🏷️ CategoryPillFilters: Error loading categories:', err);
      
      if (isThrottleError(err)) {
        showThrottleWarning();
      } else {
        const apiError = handleAPIError(err);
        setError(apiError.message);
        showError(apiError.message, 'Categories Error');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCategories();
  }, []);

  // Update scroll indicators
  const updateScrollIndicators = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  // Scroll handling
  const scrollTo = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Handle scroll events
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollIndicators);
    // Initial check
    updateScrollIndicators();

    return () => {
      container.removeEventListener('scroll', updateScrollIndicators);
    };
  }, [categories]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    console.log('🏷️ CategoryPillFilters: Category selected:', categoryId);
    onCategoryChange(categoryId);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const pillVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const scrollButtonVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    hover: { scale: 1.1 }
  };

  if (loading && !isRefreshing) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">{t('categories.loading') || 'Loading categories...'}</span>
        </div>
      </div>
    );
  }

  if (error && !isRefreshing) {
    return (
      <div className={`flex items-center justify-center py-6 ${className}`}>
        <div className="text-center">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadCategories()}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('common.retry') || 'Retry'}
          </Button>
        </div>
      </div>
    );
  }

  const allCategoriesLabel = t('categories.all_categories') || 'All Categories';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`relative ${className}`}
    >
      <div className="flex items-center gap-2">
        {/* Left scroll button */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              variants={scrollButtonVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileHover="hover"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollTo('left')}
                className="flex-shrink-0 h-10 w-10 p-0 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* All Categories pill */}
          <motion.div
            variants={pillVariants}
            whileHover="hover"
            whileTap="tap"
            className="flex-shrink-0"
          >
            <Button
              variant={selectedCategoryId === null ? "default" : "outline"}
              onClick={() => handleCategorySelect(null)}
              className={`
                h-10 px-4 rounded-full text-sm font-medium transition-all duration-200
                ${selectedCategoryId === null 
                  ? 'bg-green-600 text-white shadow-md hover:bg-green-700 border-green-600' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                }
              `}
            >
              <Leaf className="w-4 h-4 mr-2" />
              {allCategoriesLabel}
              {isRefreshing && selectedCategoryId === null && (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              )}
            </Button>
          </motion.div>

          {/* Category pills */}
          {(Array.isArray(categories) ? categories : []).map((category) => {
            const categoryName = getLocalizedCategoryName(category, language);
            const isSelected = selectedCategoryId === category.id;
            
            return (
              <motion.div
                key={category.id}
                variants={pillVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex-shrink-0"
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`
                    h-10 px-4 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${isSelected 
                      ? 'bg-green-600 text-white shadow-md hover:bg-green-700 border-green-600' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                    }
                  `}
                  title={categoryName}
                >
                  {categoryName}
                  {isRefreshing && isSelected && (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Right scroll button */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              variants={scrollButtonVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              whileHover="hover"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollTo('right')}
                className="flex-shrink-0 h-10 w-10 p-0 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Refresh button */}
        <motion.div
          variants={scrollButtonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadCategories(true)}
            disabled={isRefreshing}
            className="flex-shrink-0 h-10 w-10 p-0 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
            title={t('common.refresh') || 'Refresh categories'}
          >
            {isRefreshing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Category count indicator */}
      <AnimatePresence>
        {Array.isArray(categories) && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-xs text-gray-500 text-center"
          >
            {categories.length} {categories.length === 1 ? (t('categories.category') || 'category') : (t('categories.categories') || 'categories')} {t('common.available') || 'available'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { CategoryPillFilters };
