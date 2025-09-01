'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import { Product } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import { getLocalizedName } from '@/lib/utils';
import { ProductCard } from '@/components/ui/ProductCard';

interface SuggestedProductsProps {
  products: Product['suggested_products'];
  className?: string;
}

export default function SuggestedProducts({ products, className = '' }: SuggestedProductsProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!products || products.length === 0) {
    return null;
  }

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView.desktop >= products.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, products.length - itemsPerView.desktop) : prev - 1
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Create full Product objects from suggested products
  const fullProducts: Product[] = products.map(suggested => ({
    id: suggested.id,
    name_uz: suggested.name_uz,
    name_ru: suggested.name_uz, // Fallback if not provided
    name_en: suggested.name_uz, // Fallback if not provided
    slug: suggested.slug,
    description_uz: '',
    description_ru: '',
    description_en: '',
    price: suggested.price,
    sale_price: undefined,
    final_price: suggested.price,
    is_on_sale: false,
    stock: 999, // Assume in stock for suggested products
    category: {
      id: 'category',
      name_uz: 'Category',
      name_ru: 'Категория',
      name_en: 'Category',
      slug: 'category'
    },
    tags: [],
    images: [],
    primary_image: suggested.primary_image,
    all_images: [suggested.primary_image],
    image_count: 1,
    is_active: true,
    is_featured: false,
    available_stock: 999,
    display_name: suggested.name_uz,
    tag_list: [],
    category_name: 'Category',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {t('product.suggested_products') || 'You might also like'}
          </h2>
        </div>

        {/* Navigation Buttons */}
        {products.length > itemsPerView.desktop && (
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              disabled={currentIndex + itemsPerView.desktop >= products.length}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>

      {/* Products Grid */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <motion.div
          className="flex gap-6 transition-transform duration-300"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView.desktop)}%)`
          }}
        >
          {fullProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4"
            >
              <ProductCard 
                product={product}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Dots Indicator */}
      {products.length > itemsPerView.desktop && (
        <motion.div variants={itemVariants} className="flex justify-center gap-2">
          {Array.from({ 
            length: Math.ceil((products.length - itemsPerView.desktop + 1)) 
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
