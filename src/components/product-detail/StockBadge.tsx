'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Package } from 'lucide-react';

import { Product } from '@/lib/api';
import { useLanguage } from '@/lib/language';

interface StockBadgeProps {
  product: Product;
  className?: string;
}

export default function StockBadge({ product, className = '' }: StockBadgeProps) {
  const { t } = useLanguage();

  const stock = product.stock;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;
  const isInStock = stock > 5;

  const getStockStatus = () => {
    if (isOutOfStock) {
      return {
        icon: XCircle,
        text: t('product.out_of_stock') || 'Out of stock',
        subtext: t('product.out_of_stock_desc') || 'This product is currently unavailable',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        iconColor: 'text-red-500',
        borderColor: 'border-red-200'
      };
    }
    
    if (isLowStock) {
      return {
        icon: AlertTriangle,
        text: t('product.low_stock') || 'Low stock',
        subtext: (t('product.only_left') || `Only ${stock} left`).replace('{count}', stock.toString()),
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        iconColor: 'text-orange-500',
        borderColor: 'border-orange-200'
      };
    }
    
    return {
      icon: CheckCircle,
      text: t('product.in_stock') || 'In stock',
      subtext: (t('product.available_count') || `${stock} available`).replace('{count}', stock.toString()),
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconColor: 'text-green-500',
      borderColor: 'border-green-200'
    };
  };

  const status = getStockStatus();
  const Icon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl border-2 ${status.bgColor} ${status.borderColor} ${className}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${status.iconColor}`} />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`font-semibold ${status.textColor}`}>
              {status.text}
            </span>
            
            {/* Stock count for in-stock items */}
            {!isOutOfStock && (
              <span className={`text-sm ${status.textColor} opacity-75`}>
                {stock} {t('product.units') || 'units'}
              </span>
            )}
          </div>
          
          <p className={`text-sm ${status.textColor} opacity-75 mt-1`}>
            {status.subtext}
          </p>
        </div>
      </div>

      {/* Additional info for low stock */}
      {isLowStock && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.2 }}
          className="mt-3 pt-3 border-t border-orange-200"
        >
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <Package className="w-4 h-4" />
            <span>{t('product.order_soon') || 'Order soon - limited quantity!'}</span>
          </div>
        </motion.div>
      )}

      {/* Restock info for out of stock */}
      {isOutOfStock && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.2 }}
          className="mt-3 pt-3 border-t border-red-200"
        >
          <div className="text-sm text-red-600">
            <p>{t('product.restock_info') || 'We are working to restock this item.'}</p>
            <p className="mt-1 text-xs opacity-75">
              {t('product.notify_restock') || 'Contact us to be notified when available.'}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
