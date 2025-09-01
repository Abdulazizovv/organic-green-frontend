'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Loader2, Trash2 } from 'lucide-react';

import { useLanguage } from '@/lib/language';
import { Button } from '@/components/ui/button';

interface QuantityControlProps {
  quantity: number;
  maxQuantity: number;
  isLoading?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function QuantityControl({
  quantity,
  maxQuantity,
  isLoading = false,
  onIncrease,
  onDecrease,
  onRemove,
  size = 'md',
  className = ''
}: QuantityControlProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };

  const spanClasses = {
    sm: 'px-2 py-1 text-sm min-w-[2rem]',
    md: 'px-3 py-2 text-base min-w-[2.5rem]',
    lg: 'px-4 py-3 text-lg min-w-[3rem]'
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Quantity Controls */}
      <div className="flex items-center border rounded-lg bg-gray-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDecrease}
          disabled={isLoading || quantity <= 0}
          className={`${sizeClasses[size]} p-0`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <span className={`${spanClasses[size]} font-medium text-center flex items-center justify-center`}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            quantity
          )}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onIncrease}
          disabled={isLoading || quantity >= maxQuantity}
          className={`${sizeClasses[size]} p-0`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Remove Button */}
      {onRemove && (
        <motion.div variants={buttonVariants} whileTap="tap" whileHover="hover">
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            disabled={isLoading}
            className={`${sizeClasses[size]} p-0 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300`}
            title={t('products.remove_from_cart') || 'Remove from cart'}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
