'use client';

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Package, Heart, Share2 } from 'lucide-react';

import { Product } from '@/lib/api';
import { useCart } from '@/lib/hooks';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import QuantityControl from '@/components/ui/QuantityControl';
import FavoriteButton from './FavoriteButton';

interface AddToCartPanelProps {
  product: Product;
  className?: string;
}

export default function AddToCartPanel({ product, className = '' }: AddToCartPanelProps) {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const { addToCart, updateQuantity, removeFromCart, getCartItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const cartItem = getCartItem(product.id);
  const currentCartQuantity = cartItem?.quantity || 0;
  const maxQuantity = Math.min(product.stock, 10); // Limit to 10 or available stock
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isInCart = currentCartQuantity > 0;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || isLoading) return;

    setIsLoading(true);
    try {
      await addToCart(product, quantity);
      showSuccess(
        t('cart.added_success') || `Added ${quantity} item(s) to cart!`,
        '🛒'
      );
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      showError(
        t('cart.added_error') || 'Failed to add item to cart',
        'Cart Error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCartIncrease = async () => {
    if (currentCartQuantity >= maxQuantity) return;
    
    setIsLoading(true);
    try {
      await updateQuantity(product.id, currentCartQuantity + 1);
    } catch (error) {
      console.error('Failed to update cart:', error);
      showError(
        t('cart.update_error') || 'Failed to update cart',
        'Cart Error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCartDecrease = async () => {
    if (currentCartQuantity <= 1) {
      await handleRemoveFromCart();
      return;
    }
    
    setIsLoading(true);
    try {
      await updateQuantity(product.id, currentCartQuantity - 1);
    } catch (error) {
      console.error('Failed to update cart:', error);
      showError(
        t('cart.update_error') || 'Failed to update cart',
        'Cart Error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    setIsLoading(true);
    try {
      await removeFromCart(product.id);
      showSuccess(
        t('cart.removed_success') || 'Item removed from cart',
        '🗑️'
      );
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      showError(
        t('cart.update_error') || 'Failed to update cart',
        'Cart Error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.display_name,
          text: `Check out this product: ${product.display_name}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        showSuccess(
          t('share.copied') || 'Product link copied to clipboard!',
          '📋'
        );
      } catch (error) {
        showError(
          t('share.error') || 'Failed to copy link',
          'Share Error'
        );
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-xl border border-gray-200 p-6 space-y-6 sticky top-6 ${className}`}
    >
      {/* Stock Status */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {t('product.stock_status') || 'Stock Status'}
          </span>
        </div>
        
        {isOutOfStock ? (
          <div className="text-red-600 text-sm font-medium">
            {t('product.out_of_stock') || 'Out of Stock'}
          </div>
        ) : isLowStock ? (
          <div className="text-orange-600 text-sm font-medium">
            {t('product.low_stock') || `Only ${product.stock} left in stock`}
          </div>
        ) : (
          <div className="text-green-600 text-sm font-medium">
            {t('product.in_stock') || 'In Stock'}
            <span className="text-gray-500 ml-1">
              ({product.stock} {t('product.available') || 'available'})
            </span>
          </div>
        )}
      </motion.div>

      {/* Cart Controls */}
      <motion.div variants={itemVariants}>
        <AnimatePresence mode="wait">
          {isInCart ? (
            <motion.div
              key="in-cart"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="text-sm text-green-600 font-medium">
                {t('cart.in_cart') || 'In Cart'}: {currentCartQuantity} {t('product.items') || 'items'}
              </div>
              
              <QuantityControl
                quantity={currentCartQuantity}
                maxQuantity={maxQuantity}
                isLoading={isLoading}
                onIncrease={handleCartIncrease}
                onDecrease={handleCartDecrease}
                onRemove={handleRemoveFromCart}
                size="lg"
                className="justify-center"
              />
            </motion.div>
          ) : (
            <motion.div
              key="add-to-cart"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('product.quantity') || 'Quantity'}
                  </label>
                  
                  <QuantityControl
                    quantity={quantity}
                    maxQuantity={maxQuantity}
                    isLoading={isLoading}
                    onIncrease={() => handleQuantityChange(quantity + 1)}
                    onDecrease={() => handleQuantityChange(quantity - 1)}
                    size="md"
                  />
                  
                  <span className="text-sm text-gray-500 mt-1 block">
                    {t('product.max')} {maxQuantity}
                  </span>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isLoading}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('cart.adding') || 'Adding...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    {isOutOfStock 
                      ? (t('product.out_of_stock') || 'Out of Stock')
                      : (t('cart.add_to_cart') || 'Add to Cart')
                    }
                  </div>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex gap-3">
        <FavoriteButton product={product} className="flex-1" />
        
        <Button
          variant="outline"
          onClick={handleShare}
          className="flex-1"
        >
          <Share2 className="w-4 h-4 mr-2" />
          {t('product.share') || 'Share'}
        </Button>
      </motion.div>

      {/* Additional Info */}
      <motion.div 
        variants={itemVariants}
        className="text-xs text-gray-500 space-y-1 pt-4 border-t border-gray-200"
      >
        <p>✓ {t('product.free_shipping') || 'Free shipping on orders over $50'}</p>
        <p>✓ {t('product.easy_returns') || '30-day easy returns'}</p>
        <p>✓ {t('product.secure_checkout') || 'Secure checkout guaranteed'}</p>
      </motion.div>
    </motion.div>
  );
}
