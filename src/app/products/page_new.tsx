'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid3X3, List, Award, Truck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts, useCategories } from '@/lib/hooks';
import { useLanguage, getLocalizedName } from '@/lib/language';
import { ProductCard } from '@/components/ui/ProductCard';
import type { Product as APIProduct } from '@/lib/api';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const { t, language } = useLanguage();

  // Fetch products and categories
  const { 
    data: productsData, 
    loading: productsLoading, 
    error: productsError 
  } = useProducts({
    search: searchTerm,
    category: selectedCategory,
    page: currentPage,
    page_size: 12
  });

  const { 
    data: categoriesData, 
    loading: categoriesLoading 
  } = useCategories();

  const products = productsData?.results || [];
  const totalPages = productsData ? Math.ceil(productsData.count / 12) : 1;
  const categories = Array.isArray(categoriesData?.results) ? categoriesData.results : [];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              {t('products.featured_products_title')}
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {t('products.featured_products_description')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={t('products.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">{t('products.all_categories')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {getLocalizedName(category, language)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {productsLoading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">{t('products.loading_products')}</p>
          </div>
        )}

        {/* Error State */}
        {productsError && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load products</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}

        {/* Products Grid/List */}
        {!productsLoading && !productsError && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">{t('products.no_products')}</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
              }>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard 
                      product={product} 
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination />
          </>
        )}
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
              <h3 className="text-xl font-semibold mb-2">{t('features.quality_guarantee')}</h3>
              <p className="text-gray-600">{t('features.quality_description')}</p>
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
              <h3 className="text-xl font-semibold mb-2">{t('features.fast_delivery')}</h3>
              <p className="text-gray-600">{t('features.delivery_description')}</p>
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
              <h3 className="text-xl font-semibold mb-2">{t('features.fresh_products')}</h3>
              <p className="text-gray-600">{t('features.freshness_description')}</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
