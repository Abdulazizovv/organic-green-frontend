'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartIconBadgeProps {
  className?: string;
  showZero?: boolean;
}

export function CartIconBadge({ className = '', showZero = false }: CartIconBadgeProps) {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();
  
  return (
    <div className={`relative ${className}`}>
      <ShoppingBag className="w-6 h-6" aria-label="Shopping cart" />
      {(itemCount > 0 || showZero) && (
        <span 
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          aria-label={`${itemCount} items in cart`}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </div>
  );
}
