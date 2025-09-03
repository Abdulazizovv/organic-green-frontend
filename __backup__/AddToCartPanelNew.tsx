'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Package, Heart } from 'lucide-react';

import { Product } from '@/api/products';
import { useCart } from '@/hooks/useProducts';
import { useLanguage, getLocalizedName } from '@/lib/language';
import { useToast } from '@/context/ToastContext';
import FavoriteButtonNew from './FavoriteButtonNew';

interface AddToCartPanelProps {
  product: Product;
  className?: string;
}

export default function AddToCartPanel({ product, className = '' }: AddToCartPanelProps) {
  const { t, language } = useLanguage();
  const { showSuccess, showError } = useToast();
  const { addItem, updateQuantity, removeItem, getItemQuantity, isInCart, loading, cart } = useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const currentCartQuantity = getItemQuantity(product.id);
  const maxQuantity = Math.min(product.available_stock, 10); // Limit to 10 or available stock
  const isOutOfStock = product.available_stock <= 0;
  const isLowStock = product.available_stock > 0 && product.available_stock <= 5;
  const productInCart = isInCart(product.id);

  // Get cart item for this product
  const cartItem = cart?.items.find(item => item.product.id === product.id);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setSelectedQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || loading) return;

    try {
      await addItem(product.id, selectedQuantity);
      setSelectedQuantity(1); // Reset quantity after adding
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!cartItem || loading) return;

    try {
      if (newQuantity <= 0) {
        await removeItem(cartItem.id);
      } else if (newQuantity <= maxQuantity) {
        await updateQuantity(cartItem.id, newQuantity);
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!cartItem || loading) return;

    try {
      await removeItem(cartItem.id);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const productName = getLocalizedName(product, language);
  const price = parseFloat(product.final_price);
  const originalPrice = product.sale_price ? parseFloat(product.price) : null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Product Title */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
          {productName}
        </h1>
        
        {/* Category */}
        <p className="text-lg text-green-600 font-medium">
          {product.localized_category_name}
        </p>
        
        {/* Tags */}
        {product.localized_tags && product.localized_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {product.localized_tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price Block */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">
            {price.toLocaleString()} {t('common.currency') || 'UZS'}
          </span>
          {originalPrice && (
            <span className="text-xl text-gray-500 line-through">
              {originalPrice.toLocaleString()} {t('common.currency') || 'UZS'}
            </span>
          )}
        </div>
        
        {product.is_on_sale && originalPrice && (
          <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <span>
              {t('products.save')} {(originalPrice - price).toLocaleString()} {t('common.currency')}
            </span>
          </div>
        )}
      </div>

      {/* Stock Status */}
      <div className="space-y-2">
        {isOutOfStock ? (
          <div className="flex items-center gap-2 text-red-600">
            <Package className="w-5 h-5" />
            <span className="font-medium">{t('products.out_of_stock') || 'Out of Stock'}</span>
          </div>
        ) : isLowStock ? (
          <div className="flex items-center gap-2 text-amber-600">
            <Package className="w-5 h-5" />
            <span className="font-medium">
              {t('products.low_stock') || 'Low Stock'} - {product.available_stock} {t('products.left') || 'left'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600">
            <Package className="w-5 h-5" />
            <span className="font-medium">{t('products.in_stock') || 'In Stock'}</span>
          </div>
        )}
      </div>

      {/* Add to Cart Section */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {!productInCart ? (
            /* Add to Cart Form */
            <motion.div
              key="add-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t('products.quantity') || 'Quantity'}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(selectedQuantity - 1)}
                      disabled={selectedQuantity <= 1}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="text-xl font-semibold min-w-[3rem] text-center">
                      {selectedQuantity}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(selectedQuantity + 1)}
                      disabled={selectedQuantity >= maxQuantity}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {maxQuantity < 10 && (
                    <p className="text-sm text-gray-500">
                      {t('products.max_quantity')} {maxQuantity}
                    </p>
                  )}
                </div>
              )}

              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                disabled={isOutOfStock || loading}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-lg
                  flex items-center justify-center gap-3
                  transition-all duration-200
                  ${isOutOfStock 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                  }
                  ${loading ? 'opacity-50' : ''}
                `}
                whileHover={!isOutOfStock && !loading ? { scale: 1.02 } : {}}
                whileTap={!isOutOfStock && !loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    {isOutOfStock 
                      ? (t('products.out_of_stock') || 'Out of Stock')
                      : (t('products.add_to_cart') || 'Add to Cart')
                    }
                  </>
                )}
              </motion.button>
            </motion.div>
          ) : (
            /* In Cart Controls */
            <motion.div
              key="in-cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-700 font-medium">
                    {t('products.in_cart') || 'In Cart'}
                  </span>
                  <button
                    onClick={handleRemoveFromCart}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                    title={t('cart.remove') || 'Remove from cart'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateQuantity(currentCartQuantity - 1)}
                      disabled={loading}
                      className="w-8 h-8 rounded-lg border border-green-300 flex items-center justify-center hover:bg-green-100 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="text-lg font-semibold min-w-[2rem] text-center">
                      {currentCartQuantity}
                    </span>
                    
                    <button
                      onClick={() => handleUpdateQuantity(currentCartQuantity + 1)}
                      disabled={loading || currentCartQuantity >= maxQuantity}
                      className="w-8 h-8 rounded-lg border border-green-300 flex items-center justify-center hover:bg-green-100 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-700">
                      {(price * currentCartQuantity).toLocaleString()} {t('common.currency')}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Favorite Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            {t('products.save_for_later') || 'Save for later'}
          </span>
          <FavoriteButtonNew product={product} size="lg" />
        </div>
      </div>

      {/* Product Features */}
      <div className="grid grid-cols-1 gap-3 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600">✓</span>
          </div>
          <span>{t('products.feature_organic') || '100% Organic'}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600">🚚</span>
          </div>
          <span>{t('products.feature_delivery') || 'Fast Delivery'}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600">💧</span>
          </div>
          <span>{t('products.feature_fresh') || 'Always Fresh'}</span>
        </div>
      </div>
    </div>
  );
}
