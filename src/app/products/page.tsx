'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid3X3, List, Filter, X, Award, Truck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ui/ProductCard';
import { useProducts, useCategories } from '@/lib/hooks';
import { useLanguage, getLocalizedName } from '@/lib/language';
import type { Product, Category } from '@/lib/api';

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price_asc' | 'price_desc' | 'newest' | 'popularity';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [inStock, setInStock] = useState<boolean | null>(null);
  
  const { t, language } = useLanguage();
  const itemsPerPage = 12;

  // Fetch data
  const { 
    data: productsData, 
    loading: productsLoading, 
    error: productsError 
  } = useProducts({
    search: searchQuery,
    category: selectedCategory?.toString(),
    page: currentPage,
    page_size: itemsPerPage
  });

  const { 
    data: categoriesData, 
    loading: categoriesLoading 
  } = useCategories();

  const products = productsData?.results || [];
  const totalPages = productsData ? Math.ceil(productsData.count / itemsPerPage) : 1;
  const categories = Array.isArray(categoriesData?.results) ? categoriesData.results : [];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name_en?.toLowerCase().includes(query) ||
        product.name_uz?.toLowerCase().includes(query) ||
        product.name_ru?.toLowerCase().includes(query) ||
        product.description_en?.toLowerCase().includes(query) ||
        product.description_uz?.toLowerCase().includes(query) ||
        product.description_ru?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== -1) {
      filtered = filtered.filter(product => product.category.id === selectedCategory.toString());
    }

    // Apply price range filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.final_price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply stock filter
    if (inStock !== null) {
      filtered = filtered.filter(product => inStock ? product.stock > 0 : product.stock === 0);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => parseFloat(a.final_price) - parseFloat(b.final_price));
        break;
      case 'price_desc':
        filtered.sort((a, b) => parseFloat(b.final_price) - parseFloat(a.final_price));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
      case 'name':
      default:
        filtered.sort((a, b) => (a.name_en || a.name_uz).localeCompare(b.name_en || b.name_uz));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy, inStock]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy, priceRange, inStock]);

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setPriceRange([0, 1000]);
    setInStock(null);
    setSortBy('name');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedCategory || inStock !== null || 
    priceRange[0] > 0 || priceRange[1] < 1000;

  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="border-green-200 hover:bg-green-50"
        >
          {t('Previous')}
        </Button>
        
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 hover:bg-green-50'}
            >
              {page}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="border-green-200 hover:bg-green-50"
        >
          {t('Next')}
        </Button>
      </div>
    );
  };

  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('Error Loading Products')}</h2>
          <p className="text-gray-600">{t('Please try again later')}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 bg-green-600 hover:bg-green-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('Try Again')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('products.featured_products_title') || 'Fresh Organic Products'}
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {t('products.featured_products_description') || 'Discover our premium selection of organic foods and natural products'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Header with controls */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-green-200"
              >
                <Filter className="w-4 h-4" />
                {t('Filters')}
                {hasActiveFilters && (
                  <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1">
                    {t('Active')}
                  </span>
                )}
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-green-600 hover:bg-green-700' : 'border-green-200'}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-green-600 hover:bg-green-700' : 'border-green-200'}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Search and Sort Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={t('products.search_placeholder') || 'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-400"
                />
              </div>

              {/* Category Filter */}
              <div className="sm:w-64">
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                >
                  <option value="">{t('products.all_categories') || 'All Categories'}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {getLocalizedName(category, language)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              >
                <option value="name">{t('Sort by Name') || 'Sort by Name'}</option>
                <option value="price_asc">{t('Price: Low to High') || 'Price: Low to High'}</option>
                <option value="price_desc">{t('Price: High to Low') || 'Price: High to Low'}</option>
                <option value="newest">{t('Newest First') || 'Newest First'}</option>
              </select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  {t('Clear') || 'Clear'}
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {productsLoading ? (
                t('products.loading_products') || 'Loading...'
              ) : (
                `Showing ${filteredProducts.length} products`
              )}
            </p>
          </div>

          {/* Loading State */}
          {productsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products Grid/List */}
          {!productsLoading && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('products.no_products') || 'No products found'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('Try adjusting your search or filter criteria')}
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={handleClearFilters} className="bg-green-600 hover:bg-green-700">
                      {t('Clear all filters') || 'Clear all filters'}
                    </Button>
                  )}
                </div>
              ) : (
                <motion.div
                  layout
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  <AnimatePresence>
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        layout
                      >
                        <ProductCard
                          product={product}
                          viewMode={viewMode}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Pagination */}
              <Pagination />
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.quality_guarantee') || 'Quality Guarantee'}</h3>
              <p className="text-gray-600">{t('features.quality_description') || 'Premium organic products with quality assurance'}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.fast_delivery') || 'Fast Delivery'}</h3>
              <p className="text-gray-600">{t('features.delivery_description') || 'Quick and reliable delivery to your doorstep'}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.fresh_products') || 'Fresh Products'}</h3>
              <p className="text-gray-600">{t('features.freshness_description') || 'Always fresh products delivered to you'}</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
