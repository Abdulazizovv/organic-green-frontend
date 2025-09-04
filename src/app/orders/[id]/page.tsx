"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Package, 
  CreditCard, 
  Calendar, 
  RefreshCw, 
  XCircle, 
  MapPin, 
  User,
  Download,
  Loader2,
  AlertCircle,
  Phone
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage, getLocalizedName } from "@/lib/language";
import { useToast } from "@/context/ToastContext";
import { TelegramPromoCard } from "@/components/TelegramPromo";
import { downloadReceipt, formatUzbekistanDateTime } from "@/utils/receiptGenerator";
import orderService from "@/lib/api/orderService";
import type { Order } from "@/types/order";

export default function OrderDetailPage() {
  const params = useParams();
  const { language, t } = useLanguage();
  const { showSuccess, showError } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [showTelegramPromo, setShowTelegramPromo] = useState(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousStatusRef = useRef<string | null>(null);

  const orderId = params.id as string;

  const loadOrderDetail = useCallback(async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const orderData = await orderService.getOrderDetail(orderId);
      
      // Check for status change if this is an auto-refresh
      if (isAutoRefresh && previousStatusRef.current && previousStatusRef.current !== orderData.status) {
        showSuccess(`Order status updated to ${t(`order.status.${orderData.status}`)}`);
      }
      
      setOrder(orderData);
      previousStatusRef.current = orderData.status;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load order details';
      
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
  }, [orderId, showError, showSuccess, t]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefreshEnabled && !loading && order) {
      refreshIntervalRef.current = setInterval(() => {
        loadOrderDetail(true);
      }, 5000); // Refresh every 5 seconds

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefreshEnabled, loading, order, loadOrderDetail]);

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
    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId, loadOrderDetail]);

  const handleManualRefresh = () => {
    loadOrderDetail(false);
  };

  const handleCancelOrder = async () => {
    if (!order || !window.confirm(t('order.confirm_cancel'))) {
      return;
    }

    try {
      setCanceling(true);
      await orderService.cancelOrder(order.id);
      
      // Update local state
      setOrder(prev => prev ? { ...prev, status: 'canceled' } : null);
      showSuccess(t('order.order_canceled'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('order.cannot_cancel');
      showError(errorMessage);
    } finally {
      setCanceling(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!order) return;

    try {
      setDownloadingReceipt(true);
      await downloadReceipt(order, t);
      showSuccess(t('order.download_receipt') + ' ✓');
    } catch (error) {
      console.error('Failed to download receipt:', error);
      showError('Failed to download receipt');
    } finally {
      setDownloadingReceipt(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const canCancelOrder = (status: string) => {
    return ['pending', 'processing'].includes(status);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">{t('order.loading_order_details')}</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('order.order_not_found')}
            </h1>
            <p className="text-gray-600 mb-4">
              {error || t('order.unauthorized_order')}
            </p>
            <Link href="/orders">
              <Button>
                {t('order.detail.back_to_orders')}
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
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/orders">
              <Button variant="outline" size="sm" className="hover:bg-green-50 border-green-200">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('order.detail.back_to_orders')}
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {t('order.detail.title')}
              </h1>
              <p className="font-mono text-lg text-gray-600 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                {order.order_number}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Auto-refresh indicator */}
              {autoRefreshEnabled && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{t('order.auto_refresh')}</span>
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
                {t('order.refresh')}
              </Button>
              
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {t(`order.status.${order.status}`)}
              </span>
              
              {/* Download Receipt Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReceipt}
                disabled={downloadingReceipt}
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                {downloadingReceipt ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {downloadingReceipt ? t('order.downloading_receipt') : t('order.download_receipt')}
              </Button>
              
              {canCancelOrder(order.status) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelOrder}
                  disabled={canceling}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  {canceling ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  {t('order.cancel_order')}
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Telegram Promo Card */}
        {showTelegramPromo && (
          <TelegramPromoCard 
            onDismiss={() => setShowTelegramPromo(false)}
          />
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-green-100"
            >
              <div className="flex items-center mb-6">
                <Package className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('order.detail.items')}
                </h2>
              </div>

              {order.items && order.items.length > 0 ? (
                <div className="space-y-4">
                  {order.items.map((item) => {
                    // Handle the actual API response format
                    const productName = item.product_name || 
                                      getLocalizedName({
                                        name_uz: item.product_name_uz,
                                        name_ru: item.product_name_ru,
                                        name_en: item.product_name_en
                                      }, language);

                    return (
                      <div key={item.id} className="flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-100 hover:border-green-200 transition-colors">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden border border-gray-200">
                          {item.product_image_url ? (
                            <Image
                              src={item.product_image_url}
                              alt={productName || t('order.detail.product_image')}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 text-green-600">
                              <span className="text-2xl">🌿</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                            {productName}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <span className="font-medium mr-1">{t('order.detail.quantity')}:</span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="font-medium mr-1">{t('order.detail.unit_price')}:</span>
                              <span className="font-semibold">{Number(item.unit_price).toLocaleString()} UZS</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="font-medium mr-1">{t('order.detail.total_price')}:</span>
                              <span className="font-bold text-green-600">{Number(item.total_price).toLocaleString()} UZS</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('order.detail.empty')}</p>
                </div>
              )}
            </motion.div>

            {/* Contact & Delivery Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-green-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t('order.contact_delivery_info')}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">{t('order.customer')}</p>
                      <p className="font-medium text-gray-900">{order.full_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">{t('order.contact_phone')}</p>
                      <p className="font-medium text-gray-900">{order.contact_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">{t('order.delivery_address')}</p>
                      <p className="font-medium text-gray-900">{order.delivery_address}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CreditCard className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">{t('order.payment_method')}</p>
                      <p className="font-medium text-gray-900">
                        {getPaymentMethodDisplay(order.payment_method)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">{t('order.notes')}</p>
                  <p className="text-gray-900">{order.notes}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t('order.order_summary')}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">{t('order.created_at')}</p>
                    <p className="font-medium text-gray-900">
                      {formatUzbekistanDateTime(order.created_at)}
                    </p>
                  </div>
                </div>
                
                {order.updated_at && order.updated_at !== order.created_at && (
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">{t('order.updated_at')}</p>
                      <p className="font-medium text-gray-900">
                        {formatUzbekistanDateTime(order.updated_at)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('order.subtotal')}</span>
                  <span className="font-medium">{Number(order.subtotal).toLocaleString()} UZS</span>
                </div>
                
                {Number(order.discount_total) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('order.discount')}</span>
                    <span className="font-medium text-green-600">
                      -{Number(order.discount_total).toLocaleString()} UZS
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('order.delivery')}</span>
                  <span className="font-medium text-green-600">{t('order.delivery_free')}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span>{t('order.total')}</span>
                  <span className="text-green-600">{Number(order.total_price).toLocaleString()} UZS</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
