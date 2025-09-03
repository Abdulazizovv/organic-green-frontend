"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  ChevronRight, 
  Calendar,
  Receipt,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { useToast } from "@/context/ToastContext";
import orderService from "@/lib/api/orderService";
import type { Order } from "@/types/order";

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'cod':
        return t('checkout.cash_on_delivery');
      case 'click':
        return 'Click';
      case 'payme':
        return 'Payme';
      case 'card':
        return t('checkout.bank_card');
      default:
        return method;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-mono font-semibold text-gray-900 mb-1">
            {order.order_number}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {t(`order.status.${order.status}`)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500">{t('order.total_amount')}</p>
          <p className="font-semibold text-gray-900">{order.total_price.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">{t('order.payment_method')}</p>
          <p className="font-medium text-gray-900">{getPaymentMethodDisplay(order.payment_method)}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-500 text-sm mb-1">{t('order.delivery_address')}</p>
        <p className="text-gray-900 text-sm line-clamp-2">{order.delivery_address}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {order.items.length} {order.items.length === 1 ? t('checkout.item_count') : t('checkout.items_count')}
        </span>
        
        <Link href={`/orders/${order.id}`}>
          <Button variant="outline" size="sm" className="hover:bg-green-50">
            {t('order.order_details')}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default function OrdersPage() {
  const { t } = useLanguage();
  const { showError, showSuccess } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousOrdersRef = useRef<Order[]>([]);

  const loadOrders = useCallback(async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await orderService.getOrders();
      const newOrders = response.results;
      
      // Check for status changes if this is an auto-refresh
      if (isAutoRefresh && previousOrdersRef.current.length > 0) {
        const statusChanges = newOrders.filter(newOrder => {
          const oldOrder = previousOrdersRef.current.find(order => order.id === newOrder.id);
          return oldOrder && oldOrder.status !== newOrder.status;
        });

        // Show notifications for status changes
        statusChanges.forEach(order => {
          showSuccess(`Order ${order.order_number} status updated to ${t(`order.status.${order.status}`)}`);
        });
      }
      
      setOrders(newOrders);
      previousOrdersRef.current = newOrders;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load orders';
      
      // Handle 429 (rate limiting) specially
      if (errorMessage.includes('Too many requests')) {
        setAutoRefreshEnabled(false);
        showError(errorMessage);
        
        // Re-enable auto-refresh after 30 seconds
        setTimeout(() => {
          setAutoRefreshEnabled(true);
        }, 30000);
      } else {
        setError(errorMessage);
        if (!isAutoRefresh) {
          showError(errorMessage);
        }
      }
    } finally {
      if (isAutoRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [showError, showSuccess, t]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefreshEnabled && !loading) {
      refreshIntervalRef.current = setInterval(() => {
        loadOrders(true);
      }, 5000); // Refresh every 5 seconds

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefreshEnabled, loading, loadOrders]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Initial load
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleManualRefresh = () => {
    loadOrders(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full w-20" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-1" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                </div>
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to load orders
            </h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleManualRefresh}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {t('order.my_orders')}
            </h1>
          </motion.div>

          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <Receipt className="w-12 h-12 text-gray-400" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('order.no_orders')}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('order.no_orders_description')}
            </p>
            
            <Link href="/products">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {t('order.my_orders')}
              </h1>
              <p className="text-gray-600">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Auto-refresh indicator */}
              {autoRefreshEnabled && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Auto-refresh</span>
                </div>
              )}
              
              {/* Manual refresh button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OrderCard order={order} />
            </motion.div>
          ))}
        </div>

        {/* Load More Button (if pagination is needed) */}
        {/* This can be implemented when the API supports pagination */}
      </div>
    </div>
  );
}
