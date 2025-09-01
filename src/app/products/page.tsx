'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Grid3X3, 
  List, 
  Filter, 
  X, 
  Loader2, 
  RefreshCw,
  AlertTriangle,
  Package,
  ShoppingCart,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ui/ProductCard';
import { CategoryPillFilters } from '@/components/ui/CategoryPillFilters';
import { OrderingDropdown, type SortOption } from '@/components/ui/OrderingDropdown';
import { useProducts, useCategories } from '@/lib/hooks';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';
import { 
  getLocalizedName, 
  isThrottleError, 
  handleAPIError 
} from '@/lib/utils';
import type { Product, Category } from '@/lib/api';

type ViewMode = 'grid' | 'list';
type StockFilter = 'all' | 'in_stock' | 'out_of_stock' | 'low_stock';

export default function ProductsPage() {
  // Core state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  const [sortApiParam, setSortApiParam] = useState('name_uz');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // UI state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const { t, language } = useLanguage();
  const { showError, showThrottleWarning, showSuccess } = useToast();
  const { getTotalItems } = useCart();
  const itemsPerPage = 12;

  // Fetch data with enhanced parameters
  const { 
    data: productsData, 
    loading: productsLoading, 
    error: productsError
  } = useProducts({
    search: searchQuery,
    category: selectedCategoryId || undefined,
    ordering: sortApiParam,
    page: currentPage,
    page_size: itemsPerPage
  });

  const { 
    data: categoriesData, 
    loading: categoriesLoading
  } = useCategories();

  const products = productsData?.results || [];
  const totalProducts = productsData?.count || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const categories = Array.isArray(categoriesData?.results) ? categoriesData.results : [];

  // Enhanced filtering with client-side filters for better performance
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = [...products];

    console.log('🔍 ProductsPage: Filtering products...', {
      total: products.length,
      stockFilter,
      priceRange,
      searchQuery: searchQuery.slice(0, 20) + (searchQuery.length > 20 ? '...' : '')
    });

    // Apply stock filter (client-side for immediate feedback)
    switch (stockFilter) {
      case 'in_stock':
        filtered = filtered.filter(product => (product.available_stock || product.stock || 0) > 0);
        break;
      case 'out_of_stock':
        filtered = filtered.filter(product => (product.available_stock || product.stock || 0) === 0);
        break;
      case 'low_stock':
        filtered = filtered.filter(product => {
          const stock = product.available_stock || product.stock || 0;
          return stock > 0 && stock <= 5;
        });
        break;
      default:
        // 'all' - no filter
        break;
    }

    // Apply price range filter (client-side)
    if (priceRange[0] > 0 || priceRange[1] < 1000) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.final_price || product.price || '0');
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    console.log('🔍 ProductsPage: Filtered products:', filtered.length);
    return filtered;
  }, [products, stockFilter, priceRange]);

  // Handle category change
  const handleCategoryChange = useCallback((categoryId: string | null) => {
    console.log('🏷️ ProductsPage: Category changed:', categoryId);
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((sort: SortOption, apiParam: string) => {
    console.log('🔀 ProductsPage: Sort changed:', sort, apiParam);
    setSortBy(sort);
    setSortApiParam(apiParam);
    setCurrentPage(1);
  }, []);

  // Handle stock filter change
  const handleStockFilterChange = useCallback((filter: StockFilter) => {
    console.log('📦 ProductsPage: Stock filter changed:', filter);
    setStockFilter(filter);
    setCurrentPage(1);
  }, []);

  // Handle search with debouncing
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  // Refresh all data
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      console.log('🔄 ProductsPage: Refreshing data...');
      // Force re-render by updating search state
      setSearchQuery(prev => prev + ' ');
      setTimeout(() => setSearchQuery(prev => prev.trim()), 100);
      showSuccess(t('products.refreshed') || 'Products refreshed');
    } catch (error) {
      console.error('🔄 ProductsPage: Refresh failed:', error);
      
      if (isThrottleError(error)) {
        showThrottleWarning();
      } else {
        const apiError = handleAPIError(error);
        showError(apiError.message, 'Refresh Error');
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [showSuccess, showThrottleWarning, showError, t]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    console.log('🧹 ProductsPage: Clearing all filters');
    setSearchQuery('');
    setSelectedCategoryId(null);
    setStockFilter('all');
    setPriceRange([0, 1000]);
    setSortBy('name_asc');
    setSortApiParam('name_uz');
    setCurrentPage(1);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== '' || 
           selectedCategoryId !== null || 
           stockFilter !== 'all' || 
           priceRange[0] > 0 || 
           priceRange[1] < 1000;
  }, [searchQuery, selectedCategoryId, stockFilter, priceRange]);

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryId, sortApiParam]);

  // Stock filter options
  const stockFilterOptions = [
    { value: 'all' as StockFilter, label: t('products.stock.all') || 'All Products', icon: Package },
    { value: 'in_stock' as StockFilter, label: t('products.stock.in_stock') || 'In Stock', icon: CheckCircle },
    { value: 'out_of_stock' as StockFilter, label: t('products.stock.out_of_stock') || 'Out of Stock', icon: X },
    { value: 'low_stock' as StockFilter, label: t('products.stock.low_stock') || 'Low Stock', icon: AlertTriangle },
  ];

  // Get stock filter counts
  const getStockFilterCount = (filter: StockFilter) => {
    if (!products) return 0;
    
    switch (filter) {
      case 'in_stock':
        return products.filter(p => (p.available_stock || p.stock || 0) > 0).length;
      case 'out_of_stock':
        return products.filter(p => (p.available_stock || p.stock || 0) === 0).length;
      case 'low_stock':
        return products.filter(p => {
          const stock = p.available_stock || p.stock || 0;
          return stock > 0 && stock <= 5;
        }).length;
      default:
        return products.length;
    }
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-center items-center gap-2 mt-8"
      >
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="border-green-200 hover:bg-green-50 disabled:opacity-50"
        >
          {t('common.previous') || 'Previous'}
        </Button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => setCurrentPage(page as number)}
              className={
                currentPage === page 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'border-green-200 hover:bg-green-50'
              }
              size="sm"
            >
              {page}
            </Button>
          )
        ))}
        
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="border-green-200 hover:bg-green-50 disabled:opacity-50"
        >
          {t('common.next') || 'Next'}
        </Button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('products.title') || 'Organic Products'}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('products.subtitle') || 'Discover fresh, healthy, and sustainable products grown with care'}
          </p>
          
          {/* Cart indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border">
              <ShoppingCart className="w-4 h-4" />
              <span>{getTotalItems()} {t('products.items_in_cart') || 'items in cart'}</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${searchFocused ? 'text-green-500' : 'text-gray-400'}`} />
              <Input
                type="text"
                placeholder={t('products.search_placeholder') || 'Search products...'}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`pl-10 h-12 border-gray-200 focus:border-green-300 focus:ring-2 focus:ring-green-100 ${searchFocused ? 'shadow-md' : ''}`}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-12 px-4 border-gray-200 hover:bg-gray-50"
                title={t('common.refresh') || 'Refresh'}
              >
                {isRefreshing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <CategoryPillFilters
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Controls Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Left side - Ordering and Stock Filter */}
            <div className="flex flex-wrap gap-3 items-center">
              <OrderingDropdown
                selectedSort={sortBy}
                onSortChange={handleSortChange}
                className="min-w-[200px]"
              />
              
              {/* Stock Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {stockFilterOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = stockFilter === option.value;
                  const count = getStockFilterCount(option.value);
                  
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStockFilterChange(option.value)}
                      className={`
                        h-9 px-3 text-xs font-medium transition-all duration-200
                        ${isSelected 
                          ? 'bg-green-600 text-white shadow-md hover:bg-green-700' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-300'
                        }
                      `}
                    >
                      <IconComponent className="w-4 h-4 mr-1" />
                      {option.label}
                      <span className="ml-1 px-1.5 py-0.5 bg-black/10 rounded-full text-xs">
                        {count}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Right side - View controls and Clear filters */}
            <div className="flex items-center gap-3">
              {/* Clear Filters */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="text-red-600 hover:bg-red-50 h-9"
                    >
                      <X className="w-4 h-4 mr-1" />
                      {t('products.clear_filters') || 'Clear Filters'}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-9 px-3 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-9 px-3 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                <strong className="text-gray-900">{filteredProducts.length}</strong> {t('products.of') || 'of'} <strong className="text-gray-900">{totalProducts}</strong> {t('products.products') || 'products'}
              </span>
              {hasActiveFilters && (
                <span className="text-green-600">({t('products.filtered') || 'filtered'})</span>
              )}
            </div>
            
            {productsLoading && (
              <div className="flex items-center gap-2 text-green-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{t('products.loading') || 'Loading...'}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Products Grid/List */}
        <AnimatePresence mode="wait">
          {productsLoading && !isRefreshing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
                <p className="text-gray-600">{t('products.loading') || 'Loading products...'}</p>
              </div>
            </motion.div>
          ) : productsError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('products.error_title') || 'Unable to load products'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {productsError || (t('products.error_message') || 'Please try again later')}
                </p>
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  {t('common.retry') || 'Try Again'}
                </Button>
              </div>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {hasActiveFilters 
                    ? (t('products.no_results') || 'No products found') 
                    : (t('products.no_products') || 'No products available')
                  }
                </h3>
                <p className="text-gray-600 mb-4">
                  {hasActiveFilters 
                    ? (t('products.try_different_filters') || 'Try adjusting your search or filters') 
                    : (t('products.check_back_later') || 'Check back later for new products')
                  }
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t('products.clear_filters') || 'Clear Filters'}
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  className="h-full"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!productsLoading && !productsError && filteredProducts.length > 0 && (
          <Pagination />
        )}
      </div>
    </div>
  );
}
