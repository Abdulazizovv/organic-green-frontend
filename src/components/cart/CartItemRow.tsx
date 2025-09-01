'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuantityControl } from './QuantityControl';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/types/cart';

interface CartItemRowProps {
  item: CartItem;
  locale?: string;
  onRemove?: (itemId: string) => void;
  onQuantityChange?: (itemId: string, quantity: number) => void;
  className?: string;
}

export function CartItemRow({ 
  item, 
  locale = 'uz',
  onRemove,
  onQuantityChange,
  className = ''
}: CartItemRowProps) {
  const { updateItem, removeItem, loading } = useCart();

  // Get localized product name
  const getProductName = () => {
    switch (locale) {
      case 'ru': return item.product.name_ru;
      case 'en': return item.product.name_en;
      default: return item.product.name_uz;
    }
  };

  // Image fallback strategy
  const getImageUrl = () => {
    if (item.product.primary_image_url) {
      return item.product.primary_image_url.startsWith('http') 
        ? item.product.primary_image_url
        : `http://api.organicgreen.uz${item.product.primary_image_url}`;
    }
    if (item.product.image_url) {
      return item.product.image_url.startsWith('http')
        ? item.product.image_url
        : `http://api.organicgreen.uz${item.product.image_url}`;
    }
    return null;
  };

  const handleQuantityChange = async (quantity: number) => {
    try {
      if (onQuantityChange) {
        onQuantityChange(item.id, quantity);
      } else {
        await updateItem({ item_id: item.id, quantity });
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async () => {
    try {
      if (onRemove) {
        onRemove(item.id);
      } else {
        await removeItem(item.id);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const imageUrl = getImageUrl();

  return (
    <div className={`flex items-center gap-4 p-4 bg-white rounded-lg border ${className}`}>
      {/* Product Image */}
      <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={getProductName()}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder on error
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">
          {getProductName()}
        </h3>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-semibold text-gray-900">
            {item.unit_price.toLocaleString()} сўм
          </span>
          
          {item.product.is_on_sale && (
            <span className="text-sm text-gray-500 line-through">
              {parseFloat(item.product.price).toLocaleString()} сўм
            </span>
          )}
        </div>

        {!item.is_available && (
          <div className="flex items-center gap-1 mt-1 text-orange-600 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Временно недоступен</span>
          </div>
        )}
      </div>

      {/* Quantity Control */}
      <div className="flex items-center gap-3">
        <QuantityControl
          value={item.quantity}
          min={0} // Allow 0 to enable removal via quantity
          max={item.max_quantity || 999}
          disabled={!item.is_available || loading}
          loading={loading}
          onChange={handleQuantityChange}
          aria-label={`Quantity for ${getProductName()}`}
        />
        
        {/* Total Price */}
        <div className="text-right min-w-[80px]">
          <div className="font-semibold text-gray-900">
            {item.total_price.toLocaleString()} сўм
          </div>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={loading}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          aria-label={`Remove ${getProductName()} from cart`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
