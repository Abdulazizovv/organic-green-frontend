"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Calendar,
  Receipt,
  AlertCircle,
  ExternalLink,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";

interface GuestOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function GuestOrdersPage() {
  const { t } = useLanguage();
  const [guestOrders, setGuestOrders] = useState<GuestOrder[]>([]);

  useEffect(() => {
    // Load guest orders from localStorage
    const stored = localStorage.getItem('guestOrders');
    if (stored) {
      try {
        setGuestOrders(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing guest orders:', error);
      }
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('orders')}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('order.guest.warning')}
          </p>
        </motion.div>

        {/* Guest Warning */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl shadow-sm"
        >
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 mb-2 text-lg">
                {t('order.guest.notice_title')}
              </h3>
              <p className="text-amber-700 mb-4 leading-relaxed">
                {t('order.guest.notice_message')}
              </p>
              <Link href={`/register?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/guest-orders')}`}>
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium"
                >
                  <User className="w-4 h-4 mr-2" />
                  {t('order.guest.create_account')}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {guestOrders.length > 0 ? (
          <div className="space-y-6">
            {guestOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          Order #{order.id.slice(-8)}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-600 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{formatDate(order.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                      <div className="text-2xl font-bold text-gray-900 mt-2">
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="font-semibold text-gray-800 mb-4">{t('order.detail.items')}:</h4>
                    <div className="space-y-3">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                          <span className="text-gray-700 font-medium">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-bold text-green-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {t('order.no_orders')}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              {t('order.guest.no_orders_guest')}
            </p>
            <div className="space-y-4 max-w-sm mx-auto">
              <Link href="/products">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 font-semibold">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {t('order.guest.start_shopping')}
                </Button>
              </Link>
              <Link href={`/login?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/guest-orders')}`}>
                <Button variant="outline" size="lg" className="w-full border-green-200 text-green-700 hover:bg-green-50 font-semibold">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  {t('order.guest.login_to_view')}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
