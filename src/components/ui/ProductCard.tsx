'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Plus, Minus, Loader2, Leaf, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/lib/language';
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
  const [stockWarning, setStockWarning] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addItem, updateItem, removeItem, getItemQuantity, cart } = useCart();
  const { language, t } = useLanguage();
  
  // Get current quantity in cart
  const cartQuantity = getItemQuantity(product.id);
  
  // Sync local quantity with cart quantity
  useEffect(() => {
    setLocalQuantity(cartQuantity);
  }, [cartQuantity]);

  // Get localized product name
  const getLocalizedName = (item: any) => {
    switch (language) {
      case 'ru':
        return item.name_ru || item.name_en || item.name_uz;
      case 'uz':
        return item.name_uz || item.name_en;
      case 'en':
      default:
        return item.name_en || item.name_uz;
    }
  };

  // Debounced update for quantity changes
  const handleQuantityUpdate = useCallback(async (newQuantity: number) => {
    try {
      if (newQuantity === 0) {
        // Find the cart item to get its ID
        const cartItem = cart?.items.find(item => item.product.id === product.id);
        if (cartItem) {
          await removeItem(cartItem.id);
        }
      } else if (cartQuantity === 0) {
        // Adding new item
        await addItem({
          product_id: product.id,
          quantity: newQuantity
        });
      } else {
        // Updating existing item
        const cartItem = cart?.items.find(item => item.product.id === product.id);
        if (cartItem) {
          await updateItem({
            item_id: cartItem.id,
            quantity: newQuantity
          });
        }
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      // Reset local quantity on error
      setLocalQuantity(cartQuantity);
      setStockWarning('Failed to update cart. Please try again.');
      setTimeout(() => setStockWarning(''), 3000);
    }
  }, [product.id, cartQuantity, addItem, updateItem, removeItem, cart]);

  const { debouncedUpdate, isUpdating } = useDebounceQuantityUpdate(handleQuantityUpdate);

  // Handle adding to cart for the first time
  const handleAddToCart = async () => {
    if (localQuantity > 0) return; // Already in cart
    
    setIsAddingToCart(true);
    try {
      await addItem({
        product_id: product.id,
        quantity: 1
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setStockWarning('Failed to add to cart. Please try again.');
      setTimeout(() => setStockWarning(''), 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle quantity increase
  const handleIncrease = () => {
    const newQuantity = localQuantity + 1;
    if (newQuantity > product.stock) {
      setStockWarning(`Only ${product.stock} items available in stock`);
      setTimeout(() => setStockWarning(''), 3000);
      return;
    }
    
    setLocalQuantity(newQuantity);
    debouncedUpdate(newQuantity);
  };

  // Handle quantity decrease
  const handleDecrease = () => {
    const newQuantity = Math.max(0, localQuantity - 1);
    setLocalQuantity(newQuantity);
    debouncedUpdate(newQuantity);
  };

  const productName = getLocalizedName(product);
  const productImage = product.images && product.images.length > 0 ? product.images[0].image : null;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const currentPrice = parseFloat(product.price);

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${className}`}
      >
        <div className="flex p-4 gap-4">
          {/* Product Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <Link href={`/products/${product.slug}`}>
              {productImage ? (
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-full h-full bg-green-50 rounded-lg flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-green-500" />
                </div>
              )}
            </Link>
            
            {/* Sale Badge */}
            {product.is_on_sale && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Sale
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-1">
                {productName}
              </h3>
            </Link>
            
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-green-600">
                ${currentPrice.toFixed(2)}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mt-2 flex items-center gap-2">
              {isOutOfStock ? (
                <span className="text-red-600 text-sm font-medium">Out of Stock</span>
              ) : isLowStock ? (
                <span className="text-amber-600 text-sm font-medium">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="text-green-600 text-sm font-medium">In Stock</span>
              )}
            </div>
          </div>

          {/* Add to Cart / Quantity Controls */}
          <div className="flex-shrink-0 flex flex-col justify-center">
            {stockWarning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                {stockWarning}
              </motion.div>
            )}
            
            <AnimatePresence mode="wait">
              {localQuantity === 0 ? (
                <motion.div
                  key="add-button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAddingToCart}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
                  >
                    {isAddingToCart ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="quantity-controls"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-1"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDecrease}
                    disabled={isUpdating}
                    className="w-8 h-8 p-0 hover:bg-green-100"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <span className="mx-2 font-medium text-green-700 min-w-[2rem] text-center">
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      localQuantity
                    )}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleIncrease}
                    disabled={isUpdating || localQuantity >= product.stock}
                    className="w-8 h-8 p-0 hover:bg-green-100"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
    >
      <Card className="border-0 shadow-none">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <Link href={`/products/${product.slug}`}>
              {productImage ? (
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                  <Leaf className="w-16 h-16 text-green-500" />
                </div>
              )}
            </Link>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.is_on_sale && (
                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Sale
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2 mb-2">
              {productName}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-green-600">
              ${currentPrice.toFixed(2)}
            </span>
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            {isOutOfStock ? (
              <span className="text-red-600 text-sm font-medium">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-amber-600 text-sm font-medium">
                Only {product.stock} left
              </span>
            ) : (
              <span className="text-green-600 text-sm font-medium">In Stock</span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {stockWarning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-3 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg flex items-center gap-2 w-full"
            >
              <AlertTriangle className="w-4 h-4" />
              {stockWarning}
            </motion.div>
          )}
          
          <AnimatePresence mode="wait">
            {localQuantity === 0 ? (
              <motion.div
                key="add-button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full"
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:bg-gray-300"
                >
                  {isAddingToCart ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="quantity-controls"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full flex items-center justify-center gap-3 bg-green-50 border border-green-200 rounded-lg p-2"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDecrease}
                  disabled={isUpdating}
                  className="w-8 h-8 p-0 hover:bg-green-100"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <span className="mx-3 font-bold text-green-700 text-lg min-w-[3rem] text-center">
                  {isUpdating ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    localQuantity
                  )}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleIncrease}
                  disabled={isUpdating || localQuantity >= product.stock}
                  className="w-8 h-8 p-0 hover:bg-green-100"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export { ProductCard };
