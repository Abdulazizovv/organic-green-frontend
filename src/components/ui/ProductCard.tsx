'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Plus, Minus, Loader2, Leaf, AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/context/ToastContext';
import { 
  getProductImage, 
  getProductImageAlt, 
  DEFAULT_PRODUCT_IMAGE,
  getLocalizedName,
  getLocalizedDescription,
  formatPriceSimple,
  calculateDiscount,
  isThrottleError,
  handleAPIError
} from '@/lib/utils';
import type { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  className?: string;
  viewMode?: 'grid' | 'list';
}

// Custom hook for debounced cart updates
function useDebounceQuantityUpdate(callback: (quantity: number) => Promise<void>, delay: number = 300) {
  const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (pendingQuantity === null) return;

    setIsUpdating(true);
    const timer = setTimeout(async () => {
      try {
        await callback(pendingQuantity);
      } finally {
        setPendingQuantity(null);
        setIsUpdating(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [pendingQuantity, callback, delay]);

  const debouncedUpdate = useCallback((quantity: number) => {
    setPendingQuantity(quantity);
  }, []);

  return { debouncedUpdate, isUpdating };
}

function ProductCard({ product, className = '', viewMode = 'grid' }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stockWarning, setStockWarning] = useState('');

  const { language, t } = useLanguage();
  const { cart, addItem, updateItem, removeItem } = useCart();
  const { showToast, showThrottleWarning, showError, showSuccess } = useToast();

  // Get cart item for this product
  const cartItem = cart?.items?.find(item => item.product.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;

  // Sync local quantity with cart
  useEffect(() => {
    setLocalQuantity(cartQuantity);
  }, [cartQuantity]);

  // Product display utilities
  const productName = getLocalizedName(product, language);
  const productDescription = getLocalizedDescription(product, language);
  const productImage = getProductImage(product);
  const productImageAlt = getProductImageAlt(product, language);
  
  // Price calculations
  const originalPrice = parseFloat(product.price);
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const finalPrice = parseFloat(product.final_price || product.price);
  const discountPercent = salePrice ? calculateDiscount(originalPrice, salePrice) : 0;

  // Stock validation
  const availableStock = product.available_stock || product.stock || 0;
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;

  // Debounced cart update
  const handleQuantityUpdate = useCallback(async (newQuantity: number) => {
    try {
      setIsLoading(true);
      setStockWarning('');

      if (newQuantity === 0) {
        if (cartItem) {
          await removeItem(cartItem.id);
        }
      } else if (cartItem) {
        await updateItem({ item_id: cartItem.id, quantity: newQuantity });
      } else {
        await addItem({
          product_id: product.id,
          quantity: newQuantity
        });
      }
    } catch (error) {
      console.error('Cart update error:', error);
      
      if (isThrottleError(error)) {
        showThrottleWarning();
      } else {
        const apiError = handleAPIError(error);
        
        // Check for stock-related errors
        if (apiError.message.toLowerCase().includes('stock') || 
            apiError.message.toLowerCase().includes('inventory')) {
          setStockWarning(apiError.message);
        } else {
          showError(apiError.message, 'Cart Error');
        }
      }
      
      // Reset local quantity on error
      setLocalQuantity(cartQuantity);
    } finally {
      setIsLoading(false);
    }
  }, [cartItem, product.id, addItem, updateItem, removeItem, cartQuantity, showThrottleWarning, showError]);

  const { debouncedUpdate, isUpdating } = useDebounceQuantityUpdate(handleQuantityUpdate);

  // Handle quantity increase
  const handleIncrease = useCallback(() => {
    if (localQuantity >= availableStock) {
      setStockWarning(t('products.stock_limit_reached') || `Only ${availableStock} items available`);
      return;
    }
    
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    debouncedUpdate(newQuantity);
    setStockWarning('');
  }, [localQuantity, availableStock, debouncedUpdate, t]);

  // Handle quantity decrease
  const handleDecrease = useCallback(() => {
    if (localQuantity <= 0) return;
    
    const newQuantity = localQuantity - 1;
    setLocalQuantity(newQuantity);
    debouncedUpdate(newQuantity);
    setStockWarning('');
  }, [localQuantity, debouncedUpdate]);

  // Handle quick remove (direct remove from cart)
  const handleQuickRemove = useCallback(async () => {
    if (!cartItem) return;
    
    try {
      setIsLoading(true);
      await removeItem(cartItem.id);
      showSuccess(t('products.removed_from_cart') || 'Removed from cart');
    } catch (error) {
      console.error('Quick remove error:', error);
      
      if (isThrottleError(error)) {
        showThrottleWarning();
      } else {
        const apiError = handleAPIError(error);
        showError(apiError.message, 'Remove Error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [cartItem, removeItem, showSuccess, showThrottleWarning, showError, t]);

  // Handle add to cart (single click add)
  const handleAddToCart = useCallback(async () => {
    if (isOutOfStock) return;
    
    try {
      setIsLoading(true);
      setStockWarning('');
      
      await addItem({
        product_id: product.id,
        quantity: 1
      });
      
      showSuccess(t('products.added_to_cart') || 'Added to cart');
    } catch (error) {
      console.error('Add to cart error:', error);
      
      if (isThrottleError(error)) {
        showThrottleWarning();
      } else {
        const apiError = handleAPIError(error);
        
        if (apiError.message.toLowerCase().includes('stock')) {
          setStockWarning(apiError.message);
        } else {
          showError(apiError.message, 'Cart Error');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [isOutOfStock, addItem, product.id, showSuccess, showThrottleWarning, showError, t]);

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -4,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.05 }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
      >
        <Card className="border-0 shadow-none">
          <div className="flex flex-col sm:flex-row">
            {/* Image Section */}
            <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
              <Link href={`/products/${product.slug}`}>
                <Image
                  src={imageError ? DEFAULT_PRODUCT_IMAGE : (productImage || DEFAULT_PRODUCT_IMAGE)}
                  alt={productImageAlt}
                  fill
                  className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                  onError={handleImageError}
                />
              </Link>
              
              {/* Sale Badge */}
              {product.is_on_sale && discountPercent > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  -{discountPercent}%
                </div>
              )}

              {/* Stock Status */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-t-lg sm:rounded-l-lg sm:rounded-t-none">
                  <span className="text-white text-sm font-medium">
                    {t('products.out_of_stock') || 'Out of Stock'}
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between h-full">
                <div className="flex-1">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
                      {productName}
                    </h3>
                  </Link>
                  
                  {productDescription && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {productDescription}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPriceSimple(finalPrice)}
                    </span>
                    {product.is_on_sale && salePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPriceSimple(originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Stock Info */}
                  {isLowStock && !isOutOfStock && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-orange-600">
                        {t('products.only_left') || 'Only'} {availableStock} {t('products.left') || 'left'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Cart Controls */}
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  {localQuantity > 0 ? (
                    <div className="flex items-center gap-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg bg-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDecrease}
                          disabled={isLoading || isUpdating}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : localQuantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleIncrease}
                          disabled={isLoading || isUpdating || localQuantity >= availableStock}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quick Remove Button */}
                      <motion.div variants={buttonVariants} whileTap="tap" whileHover="hover">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleQuickRemove}
                          disabled={isLoading}
                          className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          title={t('products.remove_from_cart') || 'Remove from cart'}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div variants={buttonVariants} whileTap="tap" whileHover="hover">
                      <Button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 h-9"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <ShoppingCart className="w-4 h-4 mr-2" />
                        )}
                        {t('products.add_to_cart') || 'Add to Cart'}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Stock Warning */}
              <AnimatePresence>
                {stockWarning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700"
                  >
                    {stockWarning}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <Card className="border-0 shadow-none h-full flex flex-col">
        {/* Image Section */}
        <div className="relative aspect-square">
          <Link href={`/products/${product.slug}`}>
            <Image
              src={imageError ? DEFAULT_PRODUCT_IMAGE : (productImage || DEFAULT_PRODUCT_IMAGE)}
              alt={productImageAlt}
              fill
              className="object-cover rounded-t-lg"
              onError={handleImageError}
            />
          </Link>

          {/* Sale Badge */}
          {product.is_on_sale && discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
              -{discountPercent}%
            </div>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white z-10"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-t-lg">
              <span className="text-white text-sm font-medium">
                {t('products.out_of_stock') || 'Out of Stock'}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-4 flex-1 flex flex-col">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2 mb-2">
              {productName}
            </h3>
          </Link>

          {productDescription && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
              {productDescription}
            </p>
          )}

          {/* Price Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPriceSimple(finalPrice)}
              </span>
              {product.is_on_sale && salePrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPriceSimple(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Stock Info */}
          {isLowStock && !isOutOfStock && (
            <div className="flex items-center gap-1 mb-3">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-orange-600">
                {t('products.only_left') || 'Only'} {availableStock} {t('products.left') || 'left'}
              </span>
            </div>
          )}
        </CardContent>

        {/* Footer with Cart Controls */}
        <CardFooter className="p-4 pt-0">
          {localQuantity > 0 ? (
            <div className="w-full">
              <div className="flex items-center justify-between gap-2 mb-2">
                {/* Quantity Controls */}
                <div className="flex items-center border rounded-lg bg-gray-50 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDecrease}
                    disabled={isLoading || isUpdating}
                    className="h-9 w-9 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 py-2 text-center">
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      <span className="font-medium">{localQuantity}</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleIncrease}
                    disabled={isLoading || isUpdating || localQuantity >= availableStock}
                    className="h-9 w-9 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Remove Button */}
                <motion.div variants={buttonVariants} whileTap="tap" whileHover="hover">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleQuickRemove}
                    disabled={isLoading}
                    className="h-9 w-9 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    title={t('products.remove_from_cart') || 'Remove from cart'}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          ) : (
            <motion.div variants={buttonVariants} whileTap="tap" whileHover="hover" className="w-full">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <ShoppingCart className="w-4 h-4 mr-2" />
                )}
                {t('products.add_to_cart') || 'Add to Cart'}
              </Button>
            </motion.div>
          )}

          {/* Stock Warning */}
          <AnimatePresence>
            {stockWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700"
              >
                {stockWarning}
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export { ProductCard };
