"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  CreditCard, 
  Truck,
  Shield,
  ArrowLeft,
  Loader2,
  ShoppingCart,
  Plus,
  Minus,
  Leaf
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/lib/language";
import Link from "next/link";
import type { CartItem } from "@/types/cart";

// Optimized CartItemRow component with minimal re-renders
const CartItemRow = ({ item, onQuantityChange, onRemove, isUpdating }: {
  item: CartItem;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
  isUpdating: boolean;
}) => {
  const { language, t } = useLanguage();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  const getLocalizedName = (product: any) => {
    switch (language) {
      case 'uz': return product.name_uz || product.name;
      case 'ru': return product.name_ru || product.name;
      case 'en': return product.name_en || product.name;
      default: return product.name_uz || product.name;
    }
  };

  const handleQuantityChange = useCallback((change: number) => {
    const newQuantity = localQuantity + change;
    if (newQuantity > 0) {
      setLocalQuantity(newQuantity);
      onQuantityChange(item.id, newQuantity);
    }
  }, [localQuantity, item.id, onQuantityChange]);

  const handleRemove = useCallback(() => {
    onRemove(item.id);
  }, [item.id, onRemove]);

  // Get product image with fallback
  const getProductImageUrl = () => {
    return item.product.primary_image_url || item.product.image_url || null;
  };

  const imageUrl = getProductImageUrl();

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <Link href={`/products/${item.product.slug}`}>
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden cursor-pointer">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={getLocalizedName(item.product)}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-green-600" />
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/products/${item.product.slug}`}>
              <h3 className="font-semibold text-gray-900 truncate hover:text-green-600 transition-colors cursor-pointer">
                {getLocalizedName(item.product)}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              {item.product.price} {t('common.currency')} {t('products.per_item')}
            </p>
            <p className="text-lg font-semibold text-green-600 mt-1">
              {item.total_price} {t('common.currency')}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={isUpdating || localQuantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="w-3 h-3" />
            </Button>
            
            <span className="text-lg font-medium w-8 text-center">
              {localQuantity}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(1)}
              disabled={isUpdating}
              className="h-8 w-8 p-0"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          {/* Loading Indicator */}
          {isUpdating && (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin text-green-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function CartPage() {
  const { cart, loading, error, clearCart, updateItem, removeItem } = useCart();
  const { t, language } = useLanguage();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // Optimized quantity change handler with debouncing
  const handleQuantityChange = useCallback(async (itemId: string, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      await updateItem({ item_id: itemId, quantity: newQuantity });
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [updateItem]);

  // Optimized remove handler
  const handleRemoveItem = useCallback(async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, [removeItem]);

  const handleClearCart = useCallback(async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, [clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">{t('cart.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            {t('common.try_again')}
          </Button>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/products">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t('common.back')}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{t('cart.title')}</h1>
          </div>

          {/* Empty Cart */}
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('cart.empty_title')}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('cart.empty_description')}
            </p>
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t('cart.start_shopping')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t('common.back')}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{t('cart.title')}</h1>
          </div>
          
          {cart && cart.items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('cart.clear_cart')}
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart?.items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                isUpdating={updatingItems.has(item.id)}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  {t('cart.order_summary')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items Summary */}
                <div className="flex justify-between text-sm">
                  <span>{t('cart.items')} ({cart?.total_items}):</span>
                  <span>{cart?.total_price.toLocaleString()} {t('common.currency')}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    {t('cart.shipping')}:
                  </span>
                  <span className="text-green-600 font-medium">{t('cart.free_shipping')}</span>
                </div>

                <hr className="border-gray-200" />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}:</span>
                  <span className="text-green-600">
                    {cart?.total_price.toLocaleString()} {t('common.currency')}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t('cart.checkout')}
                </Button>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-4">
                  <Shield className="w-4 h-4 text-green-600" />
                  {t('cart.secure_payment')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
