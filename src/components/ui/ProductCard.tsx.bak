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

function ProductCard({ product, className = '', viewMode = 'grid' }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stockWarning, setStockWarning] = useState('');
  const [updatingQuantity, setUpdatingQuantity] = useState(false); // NEW: track quantity updates separately

  const { language, t } = useLanguage();
  const { cart, addItem, updateItem, removeItem } = useCart();
  const { showToast, showThrottleWarning, showError, showSuccess } = useToast();

  // Get cart item for this product
  const cartItem = cart?.items?.find(item => item.product.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;

  // Sync local quantity with cart
  useEffect(() => {
    console.log('🔄 Syncing quantity:', { 
      productId: product.id,
      cartQuantity, 
      previousLocalQuantity: localQuantity,
      cartItem: cartItem?.id 
    });
    setLocalQuantity(cartQuantity);
  }, [cartQuantity, product.id, cartItem]);

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

  // Stock validation - simplified to use product.stock directly
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

    console.log('📦 Product stock info:', {
    productId: product.id,
    productName: productName,
    productStock: product.stock,
    productAvailableStock: product.available_stock,
    cartQuantity,
    localQuantity,
    isOutOfStock,
    isLowStock,
    cartItemExists: !!cartItem
  });

  // Debounced cart update
  const handleQuantityUpdate = useCallback(async (newQuantity: number) => {
    try {
      console.log('🔄 Quantity update started:', { 
        productId: product.id, 
        productName: productName,
        newQuantity, 
        cartItem,
        productStock: product.stock 
      });
      
      setIsLoading(true);
      setStockWarning('');

      if (newQuantity === 0) {
        if (cartItem) {
          console.log('📦 Removing item from cart:', { itemId: cartItem.id });
          await removeItem(cartItem.id);
          console.log('✅ Item removed successfully');
        }
      } else if (cartItem) {
        console.log('📝 Updating cart item:', { 
          itemId: cartItem.id, 
          oldQuantity: cartItem.quantity,
          newQuantity 
        });
        await updateItem({ item_id: cartItem.id, quantity: newQuantity });
        console.log('✅ Cart item updated successfully');
      } else {
        console.log('🆕 Adding new item to cart:', { 
          productId: product.id, 
          quantity: newQuantity 
        });
        await addItem({
          product_id: product.id,
          quantity: newQuantity
        });
        console.log('✅ Item added to cart successfully');
      }
    } catch (error) {
      console.error('❌ Cart update error:', error);
      console.error('Error details:', {
        productId: product.id,
        newQuantity,
        cartItem,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
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
  }, [cartItem, product.id, addItem, updateItem, removeItem, cartQuantity, showThrottleWarning, showError, productName, product.stock]);

  // NEW: Unified quantity changer (optimistic) replacing old handleIncrease/handleDecrease logic
  const changeQuantity = useCallback(async (target: number) => {
    console.log('🔁 changeQuantity invoked', { productId: product.id, current: localQuantity, target, productStock: product.stock, cartItemId: cartItem?.id });
    
    if (target < 0) return;
    
    // Check if product is out of stock
    if (product.stock === 0) {
      console.warn('⚠️ Cannot change quantity: out of stock');
      setStockWarning(t('products.out_of_stock') || 'Product is out of stock');
      return;
    }
    
    // Check if target exceeds available stock
    if (target > product.stock) {
      const message = t('products.stock_limit_reached') || `Only ${product.stock} items available`;
      setStockWarning(message);
      console.warn('⚠️ Stock limit reached:', { target, productStock: product.stock });
      return;
    }

    const prev = localQuantity;
    setLocalQuantity(target); // optimistic
    setUpdatingQuantity(true);

    try {
      if (target === 0) {
        if (cartItem) {
          console.log('🗑️ Removing item (target 0)', { itemId: cartItem.id });
          await removeItem(cartItem.id);
        }
        return;
      }
      if (cartItem) {
        console.log('🔄 Updating existing cart item', { itemId: cartItem.id, quantity: target });
        await updateItem({ item_id: cartItem.id, quantity: target });
      } else {
        console.log('🆕 Adding new cart item', { productId: product.id, quantity: target });
        await addItem({ product_id: product.id, quantity: target });
      }
    } catch (error) {
      console.error('❌ changeQuantity failed', error);
      setLocalQuantity(prev); // rollback
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
      setUpdatingQuantity(false);
    }
  }, [localQuantity, product.stock, cartItem, t, product.id, addItem, updateItem, removeItem, showThrottleWarning, showError]);

  // REWRITTEN handlers using changeQuantity
  const handleIncrease = useCallback(() => {
    console.log('➕ Increment pressed');
    changeQuantity(localQuantity + 1);
  }, [changeQuantity, localQuantity]);

  const handleDecrease = useCallback(() => {
    console.log('➖ Decrement pressed');
    if (localQuantity === 0) return;
    changeQuantity(localQuantity - 1);
  }, [changeQuantity, localQuantity]);

  // Handle quick remove (direct remove from cart)
  const handleQuickRemove = useCallback(async () => {
    if (!cartItem) {
      console.warn('⚠️ No cart item to remove');
      return;
    }
    
    console.log('🗑️ Quick remove clicked:', { 
      itemId: cartItem.id, 
      productId: product.id,
      quantity: cartItem.quantity 
    });
    
    try {
      setIsLoading(true);
      setLocalQuantity(0); // optimistic
      console.log('🗑️ Removing item from cart...');
      await removeItem(cartItem.id);
      console.log('✅ Item removed successfully');
      showSuccess(t('products.removed_from_cart') || 'Removed from cart');
    } catch (error) {
      // rollback if failure
      setLocalQuantity(cartItem.quantity);
      console.error('❌ Quick remove error:', error);
      console.error('Quick remove error details:', {
        itemId: cartItem.id,
        productId: product.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      if (isThrottleError(error)) {
        showThrottleWarning();
      } else {
        const apiError = handleAPIError(error);
        showError(apiError.message, 'Remove Error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [cartItem, removeItem, showSuccess, showThrottleWarning, showError, t, product.id]);

  // Handle add to cart (single click add)
  const handleAddToCart = useCallback(async () => {
    console.log('🛒 Add to cart clicked:', { 
      productId: product.id, 
      productName: productName,
      isOutOfStock 
    });
    
    if (isOutOfStock) {
      console.warn('⚠️ Cannot add out of stock item');
      return;
    }
    
    try {
      setIsLoading(true);
      setStockWarning('');
      setLocalQuantity(1); // optimistic so controls appear immediately
      console.log('🆕 Adding item to cart...');
      await addItem({ product_id: product.id, quantity: 1 });
      console.log('✅ Add to cart successful');
      showSuccess(t('products.added_to_cart') || 'Added to cart');
    } catch (error) {
      setLocalQuantity(0); // rollback
      console.error('❌ Add to cart error:', error);
      console.error('Add to cart error details:', {
        productId: product.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
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
  }, [isOutOfStock, addItem, product.id, showSuccess, showThrottleWarning, showError, t, productName]);

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
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
          isOutOfStock ? 'opacity-60 grayscale' : ''
        } ${className}`}
      >
        <Card className="border-0 shadow-none relative">
          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-gray-900/20 rounded-lg z-10 flex items-center justify-center">
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {t('products.out_of_stock') || 'Tugadi'}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row">
            {/* Image Section */}
            <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
              <Link href={`/products/${product.slug}`} className={isOutOfStock ? 'pointer-events-none' : ''}>
                <Image
                  src={imageError ? DEFAULT_PRODUCT_IMAGE : (productImage || DEFAULT_PRODUCT_IMAGE)}
                  alt={productImageAlt}
                  fill
                  className={`object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none transition-all duration-300 ${
                    isOutOfStock ? 'grayscale opacity-70' : ''
                  }`}
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
                  {isOutOfStock ? (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">
                        {t('products.out_of_stock_message') || 'Hozircha bu mahsulot tugadi. Keyinroq sotib olishingiz mumkin'}
                      </span>
                    </div>
                  ) : isLowStock ? (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-xs text-orange-600">
                        {t('products.only_left') || 'Only'} {product.stock} {t('products.left') || 'left'}
                      </span>
                    </div>
                  ) : null}
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
                          disabled={updatingQuantity || isLoading}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                          {updatingQuantity || isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : localQuantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleIncrease}
                          disabled={updatingQuantity || isLoading || (product.stock === 0) || (localQuantity >= product.stock)}
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
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
        isOutOfStock ? 'opacity-60 grayscale' : ''
      } ${className}`}
    >
      <Card className="border-0 shadow-none h-full flex flex-col relative">
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900/20 rounded-lg z-10 flex items-center justify-center">
            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {t('products.out_of_stock') || 'Tugadi'}
            </div>
          </div>
        )}
        
        {/* Image Section */}
        <div className="relative aspect-square">
          <Link href={`/products/${product.slug}`} className={isOutOfStock ? 'pointer-events-none' : ''}>
            <Image
              src={imageError ? DEFAULT_PRODUCT_IMAGE : (productImage || DEFAULT_PRODUCT_IMAGE)}
              alt={productImageAlt}
              fill
              className={`object-cover rounded-t-lg transition-all duration-300 ${
                isOutOfStock ? 'grayscale opacity-70' : ''
              }`}
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
          {isOutOfStock ? (
            <div className="flex items-center gap-1 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs text-red-600 font-medium">
                {t('products.out_of_stock_message') || 'Hozircha bu mahsulot tugadi. Keyinroq sotib olishingiz mumkin'}
              </span>
            </div>
          ) : isLowStock ? (
            <div className="flex items-center gap-1 mb-3">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-orange-600">
                {t('products.only_left') || 'Only'} {product.stock} {t('products.left') || 'left'}
              </span>
            </div>
          ) : null}
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
                    disabled={updatingQuantity || isLoading}
                    className="h-9 w-9 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 py-2 text-center">
                    {updatingQuantity || isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      <span className="font-medium">{localQuantity}</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleIncrease}
                    disabled={updatingQuantity || isLoading || (product.stock === 0) || (localQuantity >= product.stock)}
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
