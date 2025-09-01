'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Grid3X3, List, ChevronLeft, ChevronRight, 
  RefreshCw, Filter, Package, Loader2, AlertTriangle,
  Leaf, Zap, Award, Droplets, ShoppingCart, ArrowRight
} from 'lucide-react';

import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderingDropdown, type SortOption } from '@/components/ui/OrderingDropdown';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/context/ToastContext';
import { getLocalizedName, formatPriceSimple, handleAPIError, isThrottleError } from '@/lib/utils';
import type { Product } from '@/lib/api';
import { productsAPI, categoriesAPI } from '@/lib/api';
import type { Category } from '@/lib/api';

// Types
interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

interface CategoriesResponse {
  count: number;
  results: Category[];
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

type ViewMode = 'grid' | 'list';

export default function ProductsPage() {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name_asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const itemsPerPage = 20;
  
  // UI states
  const [showCartPanel, setShowCartPanel] = useState(false);
  
  // Ref to track first render for useEffect
  const isFirstRender = useRef(true);
  
  // Cart state - simple implementation
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Refs
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { language, t } = useLanguage();
  const { showError, showThrottleWarning } = useToast();

  // Cart functions
  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  // API functions
  const fetchCategories = useCallback(async () => {
    try {
      setIsCategoriesLoading(true);
      setHasError(false);
      
      const data = await categoriesAPI.getAll();
      console.log('🏷️ Categories data received:', data);
      
      // Handle both direct array and paginated response
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && typeof data === 'object' && 'results' in data && Array.isArray((data as any).results)) {
        setCategories((data as any).results);
      } else if (data && typeof data === 'object') {
        setCategories([]);
        console.warn('Categories data is not in expected format:', data);
      } else {
        setCategories([]);
      }
      
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
      setHasError(true);
      setCategories([]); // Ensure categories is always an array
      
      if (isThrottleError(error)) {
        setErrorMessage('Too many requests. Please wait a moment and try again.');
        showThrottleWarning();
      } else {
        const apiError = handleAPIError(error);
        setErrorMessage(apiError.message);
        showError(apiError.message, 'Categories Error');
      }
    } finally {
      setIsCategoriesLoading(false);
    }
  }, [showThrottleWarning, showError]);

  const fetchProducts = useCallback(async (page: number = 1, forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setHasError(false);
      
      // Build query parameters
      const params: any = {
        page: page,
        page_size: itemsPerPage,
      };
      
      // Add cache busting parameter for force refresh
      if (forceRefresh) {
        params._t = Date.now();
      }
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      if (selectedCategoryId) {
        params.category = selectedCategoryId;
      }
      
      // Map sort option to API parameter
      const sortMapping: Record<SortOption, string> = {
        name_asc: 'name_uz',
        name_desc: '-name_uz',
        price_asc: 'price',
        price_desc: '-price',
        newest: '-created_at',
        oldest: 'created_at',
        stock_high: '-stock',
        stock_low: 'stock',
        popularity: '-id'
      };
      params.ordering = sortMapping[sortBy] || 'name_uz';
      
      const data = await productsAPI.getAll(params);
      console.log('📦 Products data received:', data);
      
      setProducts(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrevious(!!data.previous);
      setCurrentPage(page);
      
    } catch (error) {
      console.error('❌ Failed to load products:', error);
      setHasError(true);
      
      if (isThrottleError(error)) {
        setErrorMessage('Too many requests. Please wait a moment and try again.');
        showThrottleWarning();
      } else {
        const apiError = handleAPIError(error);
        setErrorMessage(apiError.message);
        showError(apiError.message, 'Products Error');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, selectedCategoryId, sortBy, showThrottleWarning, showError]);

  // Load data on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Initial load only
  useEffect(() => {
    fetchProducts(1, false);
  }, []); // Empty dependency array for initial load only

  // Fetch products when search/category/sort changes (but not on initial mount)
  useEffect(() => {
    // Skip only the very first render to avoid double request
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Add debounce for search to avoid too many requests
    const timer = setTimeout(() => {
      fetchProducts(currentPage, false); // Normal fetch, not force refresh
    }, searchQuery !== '' ? 500 : 0); // 500ms debounce for search, immediate for others
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategoryId, sortBy, currentPage, fetchProducts]);

  // Show cart panel when there are items
  useEffect(() => {
    const totalItems = getTotalItems();
    setShowCartPanel(totalItems > 0);
  }, [cart, getTotalItems]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    // No force refresh - let useEffect handle normal fetch
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
    // No force refresh - let useEffect handle normal fetch
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchProducts(currentPage, true);
  }, [fetchProducts, currentPage]);

  // Category scroll functions
  const scrollCategories = useCallback((direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      const currentScroll = categoryScrollRef.current.scrollLeft;
      const newScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      categoryScrollRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  }, []);

  // Get localized category name
  const getCategoryName = useCallback((category: Category) => {
    return getLocalizedName(category, language);
  }, [language]);

  // Unique Selling Points data
  const sellingPoints = [
    {
      icon: Leaf,
      title: t('features.organic_fresh') || 'Organic & Fresh',
      description: t('features.organic_desc') || 'Certified organic products'
    },
    {
      icon: Zap,
      title: t('features.fast_delivery') || 'Fast Delivery',
      description: t('features.delivery_desc') || 'Same day delivery available'
    },
    {
      icon: Award,
      title: t('features.certified_quality') || 'Certified Quality',
      description: t('features.quality_desc') || 'Premium quality guarantee'
    },
    {
      icon: Droplets,
      title: t('features.fresh_harvest') || 'Fresh Harvest',
      description: t('features.harvest_desc') || 'Directly from farmers'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('products.title') || 'Our Products'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('products.subtitle') || 'Discover our wide range of fresh, organic products delivered straight from local farms.'}
          </p>
        </motion.div>

        {/* Unique Selling Points */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {sellingPoints.map((point, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-lg p-4 shadow-sm border border-green-100 text-center hover:shadow-md transition-shadow"
            >
              <point.icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {point.title}
              </h3>
              <p className="text-xs text-gray-600">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={t('search.placeholder') || 'Search products...'}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearch('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-2">
              <OrderingDropdown
                selectedSort={sortBy}
                onSortChange={(sort, apiParam) => handleSortChange(sort)}
                className="min-w-[160px]"
              />
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('categories.title') || 'Categories'}
            </h2>
            
            {/* Mobile scroll buttons */}
            <div className="md:hidden flex gap-1 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollCategories('left')}
                className="p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollCategories('right')}
                className="p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div
              ref={categoryScrollRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 md:flex-wrap md:overflow-visible"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* All Categories Button */}
              <Button
                variant={selectedCategoryId === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategorySelect(null)}
                className={`whitespace-nowrap flex-shrink-0 ${
                  selectedCategoryId === null 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                }`}
              >
                {t('categories.all') || 'All Products'}
              </Button>

              {/* Category Pills */}
              {isCategoriesLoading ? (
                <div className="flex gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-9 w-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0"
                    />
                  ))}
                </div>
              ) : (
                (() => {
                  console.log('🏷️ Rendering categories:', categories, 'Type:', typeof categories, 'Is Array:', Array.isArray(categories));
                  return (categories || []).map((category) => (
                    <div key={category.id} className="relative inline-block">
                      <Button
                        variant={selectedCategoryId === category.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleCategorySelect(category.id)}
                        className={`whitespace-nowrap flex-shrink-0 ${
                          selectedCategoryId === category.id ? 'pr-8' : ''
                        }`}
                      >
                        {getCategoryName(category)}
                        <span className="ml-1 text-xs opacity-75">
                          ({category.products_count || 0})
                        </span>
                      </Button>
                      
                      {/* X button for selected category - outside of Button */}
                      {selectedCategoryId === category.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategorySelect(null);
                          }}
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/20 transition-colors z-10"
                          title={t('common.remove_filter') || 'Remove filter'}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ));
                })()
              )}
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && !isRefreshing && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">{t('loading.products') || 'Loading products...'}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('error.failed_to_load') || 'Failed to load products'}
            </h3>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <Button onClick={handleRefresh} className="bg-green-600 hover:bg-green-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('common.try_again') || 'Try Again'}
            </Button>
          </motion.div>
        )}

        {/* Products Section Header */}
        {!isLoading && !hasError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('products.title') || 'Products'} 
                {totalCount > 0 && (
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    ({totalCount} {totalCount === 1 ? (t('products.item') || 'item') : (t('products.items') || 'items')})
                  </span>
                )}
              </h2>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchProducts(currentPage, true)}
              disabled={isRefreshing}
              className="p-2"
              title={t('common.refresh') || 'Refresh products'}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </motion.div>
        )}

        {/* Products Grid */}
        {!isLoading && !hasError && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            <AnimatePresence mode="wait">
              {products.length === 0 ? (
                <motion.div
                  key="no-products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full text-center py-20"
                >
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('products.no_products') || 'No products found'}
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery || selectedCategoryId
                      ? t('products.no_results') || 'Try adjusting your search or filters'
                      : t('products.no_products_available') || 'No products are currently available'
                    }
                  </p>
                </motion.div>
              ) : (
                products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={cardVariants}
                    layout
                  >
                    <ProductCard
                      product={product}
                      viewMode={viewMode}
                      className="h-full"
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && !hasError && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-4 mt-12"
          >
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevious}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('pagination.previous') || 'Previous'}
            </Button>
            
            <span className="text-sm text-gray-600">
              {t('pagination.page') || 'Page'} {currentPage}
            </span>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className="flex items-center gap-2"
            >
              {t('pagination.next') || 'Next'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Results Summary */}
        {!isLoading && !hasError && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8 text-sm text-gray-600"
          >
            {t('products.showing') || 'Showing'} {products.length} {t('products.of') || 'of'} {totalCount} {t('products.products') || 'products'}
            {selectedCategoryId && (
              <span className="ml-1">
                {t('products.in_category') || 'in'} {(categories || []).find(c => c.id === selectedCategoryId) && getCategoryName((categories || []).find(c => c.id === selectedCategoryId)!)}
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* Floating Cart Info Panel */}
      <AnimatePresence>
        {showCartPanel && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 100 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 100 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white rounded-lg shadow-lg p-4 cursor-pointer"
              onClick={() => window.location.href = '/cart'}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 rounded-full p-2">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold">
                    {getTotalItems()} {t('cart.items') || 'items'}
                  </div>
                  <div className="opacity-90">
                    {formatPriceSimple(getTotalPrice())}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-75" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refreshing Indicator */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-blue-600 text-white rounded-lg shadow-lg p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{t('loading.refreshing') || 'Refreshing...'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
