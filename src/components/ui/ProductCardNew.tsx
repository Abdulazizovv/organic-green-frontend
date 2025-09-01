'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Plus, Minus, Loader2, Leaf } from 'lucide-react';
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
function useDebounceQuantityUpdate(callback: (quantity: number) => Promise<void>, delay: number = 500) {
  const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);

  useEffect(() => {
    if (pendingQuantity === null) return;

    const timer = setTimeout(() => {
      callback(pendingQuantity);
      setPendingQuantity(null);
    }, delay);

    return () => clearTimeout(timer);
  }, [pendingQuantity, callback, delay]);

  const debouncedUpdate = useCallback((quantity: number) => {
    setPendingQuantity(quantity);
  }, []);

  return debouncedUpdate;
}

function ProductCard({ product, className = '', viewMode = 'grid' }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const { addItem, updateItem, removeItem, cart, getItemQuantity } = useCart();
  const { language, t } = useLanguage();
  
  // Get current quantity in cart
  const cartQuantity = getItemQuantity(product.id);
  const cartItem = cart?.items.find(item => item.product.id === product.id);

  // Get localized product name
  const getLocalizedName = (product: Product) => {
    switch (language) {
      case 'uz': return product.name_uz;
      case 'ru': return product.name_ru;
      case 'en': return product.name_en;
      default: return product.name_uz;
    }
  };

  // Get localized description
  const getLocalizedDescription = (product: Product) => {
    switch (language) {
      case 'uz': return product.description_uz;
      case 'ru': return product.description_ru;
      case 'en': return product.description_en;
      default: return product.description_uz;
    }
  };

  // Debounced cart update function
  const updateCartQuantity = useCallback(async (newQuantity: number) => {
    if (!cartItem || isUpdating) return;
    
    try {
      setIsUpdating(true);
      if (newQuantity <= 0) {
        await removeItem(cartItem.id);
      } else {
        await updateItem({ 
          item_id: cartItem.id, 
          quantity: newQuantity 
        });
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [cartItem, updateItem, removeItem, isUpdating]);

  const debouncedUpdate = useDebounceQuantityUpdate(updateCartQuantity, 300);

  // Handle first time add to cart
  const handleAddToCart = async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await addItem({
        product_id: product.id,
        quantity: localQuantity,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle cart item quantity changes
  const handleQuantityChange = (change: number) => {
    if (!cartItem) return;
    
    const newQuantity = cartQuantity + change;
    if (newQuantity >= 0) {
      debouncedUpdate(newQuantity);
    }
  };

  // Handle local quantity for initial add
  const handleLocalQuantityChange = (change: number) => {
    const newQuantity = localQuantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setLocalQuantity(newQuantity);
    }
  };

  // Get product image URL with fallback to API images
  const getProductImageUrl = () => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
      return primaryImage.image;
    }
    return null;
  };

  const imageUrl = getProductImageUrl();

  // Render for grid view
  if (viewMode === 'grid') {
    return (
      <Card className={`h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-105 ${className}`}>
        {/* Product Image */}
        <CardHeader className="p-0 relative">
          <Link href={`/products/${product.slug}`}>
            <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gradient-to-br from-green-100 to-green-200 cursor-pointer">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={getLocalizedName(product)}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf className="w-16 h-16 text-green-600" />
                </div>
              )}
              
              {/* Heart icon */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsLiked(!isLiked);
                }}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors z-10"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
              
              {/* Sale badge */}
              {product.is_on_sale && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                  {t('products.sale')}
                </div>
              )}
            </div>
          </Link>
        </CardHeader>

        {/* Product Info */}
        <CardContent className="flex-1 p-4">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-green-600 transition-colors cursor-pointer">
              {getLocalizedName(product)}
            </h3>
          </Link>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {getLocalizedDescription(product)}
          </p>

          {/* Price */}
          <div className="mb-4">
            {product.is_on_sale && product.sale_price ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-green-600">
                  {product.sale_price} {t('common.currency')}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {product.price} {t('common.currency')}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-green-600">
                {product.price} {t('common.currency')}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="mb-4">
            {product.available_stock > 0 ? (
              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                {t('products.available')} ({product.available_stock})
              </span>
            ) : (
              <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                {t('products.sold_out')}
              </span>
            )}
          </div>
        </CardContent>

        {/* Cart Section */}
        <CardFooter className="p-4 pt-0">
          {product.available_stock > 0 ? (
            <div className="w-full">
              {cartQuantity > 0 ? (
                /* Cart Controls for existing items */
                <div className="w-full bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 font-medium text-sm">
                      {t('products.in_cart_label')}: {cartQuantity}
                    </span>
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-green-600" />}
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={isUpdating}
                      className="h-8 w-8 p-0 border-green-300 text-green-600 hover:bg-green-100"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-green-700 font-bold min-w-[30px] text-center">
                      {cartQuantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(1)}
                      disabled={isUpdating || cartQuantity >= product.available_stock}
                      className="h-8 w-8 p-0 border-green-300 text-green-600 hover:bg-green-100"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                /* Initial Add to Cart */
                <div className="w-full space-y-3">
                  {/* Quantity selector for initial add */}
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLocalQuantityChange(-1)}
                      disabled={localQuantity <= 1}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    
                    <span className="text-lg font-medium w-8 text-center">
                      {localQuantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLocalQuantityChange(1)}
                      disabled={localQuantity >= Math.min(10, product.available_stock)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={isUpdating}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('products.adding')}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {t('products.add_to_cart')}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Button
              disabled
              className="w-full bg-gray-400 text-white font-medium py-2 px-4 rounded-md"
            >
              {t('products.out_of_stock')}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // List view (simplified for now)
  return (
    <Card className={`flex flex-row ${className}`}>
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <div className="relative w-32 h-32 bg-gradient-to-br from-green-100 to-green-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={getLocalizedName(product)}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Leaf className="w-8 h-8 text-green-600" />
            </div>
          )}
        </div>
      </Link>
      
      <div className="flex-1 p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-green-600 transition-colors">
            {getLocalizedName(product)}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2">{getLocalizedDescription(product)}</p>
        <div className="text-xl font-bold text-green-600 mb-4">
          {product.price} {t('common.currency')}
        </div>
        
        {/* Cart controls for list view */}
        {cartQuantity > 0 ? (
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => handleQuantityChange(-1)}>
              <Minus className="w-3 h-3" />
            </Button>
            <span className="font-medium">{cartQuantity}</span>
            <Button size="sm" variant="outline" onClick={() => handleQuantityChange(1)}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <Button onClick={handleAddToCart} disabled={isUpdating}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t('products.add_to_cart')}
          </Button>
        )}
      </div>
    </Card>
  );
}

export { ProductCard };
export default ProductCard;
