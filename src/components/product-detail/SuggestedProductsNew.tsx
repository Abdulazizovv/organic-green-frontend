'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Product } from '@/api/products';
import { useSuggestedProducts, useCart } from '@/hooks/useProducts';
import { useLanguage, getLocalizedName } from '@/lib/language';
import FavoriteButtonNew from './FavoriteButtonNew';

interface SuggestedProductsProps {
  productId: string;
  className?: string;
}

export default function SuggestedProducts({ productId, className = '' }: SuggestedProductsProps) {
  const { t, language } = useLanguage();
  const { products, loading } = useSuggestedProducts(productId, 6);
  const { addItem, isInCart, getItemQuantity } = useCart();

  const containerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = async (product: Product) => {
    try {
      await addItem(product.id, 1);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900">
          {t('products.suggested_products') || 'You Might Also Like'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('products.suggested_products') || 'You Might Also Like'}
        </h2>
        
        {/* Navigation Arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Products Grid/Scroll */}
      <div 
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onQuickAdd={handleQuickAdd}
            isInCart={isInCart(product.id)}
            cartQuantity={getItemQuantity(product.id)}
            language={language}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

// Product Card Component
interface ProductCardProps {
  product: Product;
  index: number;
  onQuickAdd: (product: Product) => void;
  isInCart: boolean;
  cartQuantity: number;
  language: string;
  t: (key: string) => string;
}

function ProductCard({ 
  product, 
  index, 
  onQuickAdd, 
  isInCart, 
  cartQuantity, 
  language, 
  t 
}: ProductCardProps) {
  const productName = getLocalizedName(product, language as any);
  const price = parseFloat(product.final_price);
  const originalPrice = product.sale_price ? parseFloat(product.price) : null;
  
  // Get primary image
  const primaryImage = product.primary_image || product.images?.[0];
  const imageUrl = primaryImage?.image_url || primaryImage?.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex-shrink-0 w-72 md:w-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gradient-to-br from-green-50 to-white">
        <Link href={`/products/${product.slug}`}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={productName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 280px, (max-width: 1024px) 250px, 300px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🌱</div>
                <p className="text-green-600 text-sm font-medium">{productName}</p>
              </div>
            </div>
          )}
        </Link>
        
        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <FavoriteButtonNew product={product} size="sm" />
        </div>
        
        {/* Sale Badge */}
        {product.is_on_sale && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {t('products.sale') || 'Sale'}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
            {productName}
          </h3>
        </Link>
        
        <div className="text-sm text-green-600 font-medium">
          {product.localized_category_name}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {price.toLocaleString()} {t('common.currency') || 'UZS'}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="text-sm">
          {product.available_stock > 0 ? (
            <span className="text-green-600 font-medium">
              {t('products.in_stock') || 'In Stock'}
            </span>
          ) : (
            <span className="text-red-600 font-medium">
              {t('products.out_of_stock') || 'Out of Stock'}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <div className="pt-2">
          {isInCart ? (
            <Link href="/cart">
              <motion.button
                className="w-full py-2 px-4 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart className="w-4 h-4" />
                {t('products.in_cart')} ({cartQuantity})
              </motion.button>
            </Link>
          ) : (
            <motion.button
              onClick={() => onQuickAdd(product)}
              disabled={product.available_stock <= 0}
              className={`
                w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                ${product.available_stock > 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }
              `}
              whileHover={product.available_stock > 0 ? { scale: 1.02 } : {}}
              whileTap={product.available_stock > 0 ? { scale: 0.98 } : {}}
            >
              <ShoppingCart className="w-4 h-4" />
              {product.available_stock > 0 
                ? (t('products.add_to_cart') || 'Add to Cart')
                : (t('products.out_of_stock') || 'Out of Stock')
              }
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
