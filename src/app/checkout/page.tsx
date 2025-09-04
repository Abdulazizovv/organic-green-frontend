"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  ArrowLeft, 
  Loader2, 
  CheckCircle,
  User,
  MapPin,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useLanguage, getLocalizedName } from "@/lib/language";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/lib/authContext";
import orderService from "@/lib/api/orderService";
import type { CreateOrderRequest } from "@/types/order";

interface CheckoutFormData {
  full_name: string;
  contact_phone: string;
  delivery_address: string;
  notes: string;
  payment_method: 'cod' | 'click' | 'payme' | 'card';
}

interface FormErrors {
  full_name?: string;
  contact_phone?: string;
  delivery_address?: string;
  payment_method?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, summary, loading: cartLoading, clearCart } = useCart();
  const { language, t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<CheckoutFormData>({
    full_name: '',
    contact_phone: '',
    delivery_address: '',
    notes: '',
    payment_method: 'cod'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuestWarning, setShowGuestWarning] = useState(false);

  // Check if cart is empty and redirect if necessary
  useEffect(() => {
    if (!cartLoading && (!cart || cart.is_empty)) {
      router.push('/orders');
    }
  }, [cart, cartLoading, router]);

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : user.username || ''
      }));
    }
  }, [isAuthenticated, user]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = t('checkout.form_validation.full_name_required');
    }

    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = t('checkout.form_validation.phone_required');
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.contact_phone.trim())) {
      newErrors.contact_phone = t('checkout.form_validation.phone_invalid');
    }

    if (!formData.delivery_address.trim()) {
      newErrors.delivery_address = t('checkout.form_validation.address_required');
    }

    if (!formData.payment_method) {
      newErrors.payment_method = t('checkout.form_validation.payment_method_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (field in errors && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show guest warning for non-authenticated users
    if (!isAuthenticated) {
      setShowGuestWarning(true);
      return;
    }

    await processOrder();
  };

  const processOrder = async () => {
    setIsSubmitting(true);

    try {
      const orderData: CreateOrderRequest = {
        full_name: formData.full_name.trim(),
        contact_phone: formData.contact_phone.trim(),
        delivery_address: formData.delivery_address.trim(),
        notes: formData.notes.trim() || undefined,
        payment_method: formData.payment_method
      };

      // Prepare local cart items for potential sync
      const localCartItems = cart?.items?.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      })) || [];

      console.log('🛒 Checkout: Starting order creation', {
        orderData: { ...orderData, contact_phone: '***' },
        localCartItemsCount: localCartItems.length,
        cartIsEmpty: cart?.is_empty
      });

      // Create order with local cart items for potential sync
      const response = await orderService.createOrder(orderData, localCartItems);

      // Clear cart after successful order
      await clearCart();

      // Show success message
      showSuccess(t('order.order_success'));

      // Redirect to order detail page instead of success page
      router.push(`/orders/${response.order.id}`);

    } catch (error) {
      console.error('Order creation failed:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to create order';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Special handling for specific error types
        if (error.message.includes('Cart is empty')) {
          errorMessage = t('checkout.errors.cart_empty_retry');
        } else if (error.message.includes('Too many requests')) {
          errorMessage = error.message; // Already user-friendly
        }
      }
      
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while cart is loading
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart message if cart is empty
  if (!cart || cart.is_empty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('checkout.empty_cart_message')}
            </h1>
            <Link href="/products">
              <Button className="mt-4">
                {t('checkout.go_shopping')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = summary ? Number(summary.total_price) : Number(cart.total_price || 0);
  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/cart">
              <Button variant="outline" size="sm" className="hover:bg-green-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t('checkout.title')}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('checkout.contact_information')}
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.full_name')} *
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                        errors.full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('checkout.full_name_placeholder')}
                    />
                    {errors.full_name && (
                      <p className="text-sm text-red-600 mt-1">{errors.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.contact_phone')} *
                    </label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                        errors.contact_phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('checkout.phone_placeholder')}
                    />
                    {errors.contact_phone && (
                      <p className="text-sm text-red-600 mt-1">{errors.contact_phone}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="mb-2">
                        💡 {t('checkout.phone_note')}
                      </p>
                      <a
                        href="https://t.me/organic_green_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                      >
                        🔗 {t('checkout.telegram_bot_link')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('checkout.delivery_information')}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.delivery_address')} *
                    </label>
                    <textarea
                      value={formData.delivery_address}
                      onChange={(e) => handleInputChange('delivery_address', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none ${
                        errors.delivery_address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('checkout.delivery_address_placeholder')}
                    />
                    {errors.delivery_address && (
                      <p className="text-sm text-red-600 mt-1">{errors.delivery_address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.notes')}
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                      placeholder={t('checkout.notes_placeholder')}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t('checkout.payment_information')}
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { value: 'cod', label: t('checkout.cash_on_delivery') },
                    { value: 'click', label: t('checkout.click') },
                    { value: 'payme', label: t('checkout.payme') },
                    { value: 'card', label: t('checkout.bank_card') }
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.payment_method === method.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.value}
                        checked={formData.payment_method === method.value}
                        onChange={(e) => handleInputChange('payment_method', e.target.value as 'cod' | 'click' | 'payme' | 'card')}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-3 font-medium text-gray-900">{method.label}</span>
                    </label>
                  ))}
                </div>
                {errors.payment_method && (
                  <p className="text-sm text-red-600 mt-2">{errors.payment_method}</p>
                )}
              </div>

              {/* Place Order Button - Mobile */}
              <div className="lg:hidden">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('checkout.processing_order')}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {t('checkout.place_order')}
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          </div>

          {/* Order Summary - Desktop */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 sticky top-24"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {t('checkout.order_summary')}
              </h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => {
                  const productName = getLocalizedName({
                    name_uz: item.product.name_uz,
                    name_ru: item.product.name_ru,
                    name_en: item.product.name_en
                  }, language);

                  return (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          {item.quantity}x
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.unit_price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.total_price.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t('checkout.subtotal')} ({cart.total_items} {t('checkout.items')})
                  </span>
                  <span className="font-medium">{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('checkout.delivery_fee')}</span>
                  <span className="font-medium text-green-600">{t('checkout.free')}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span>{t('checkout.order_total')}</span>
                  <span className="text-green-600">{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Place Order Button - Desktop */}
              <Button 
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('checkout.processing_order')}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {t('checkout.place_order')}
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Guest Warning Modal */}
        {showGuestWarning && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-amber-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('checkout.guest_warning_title')}
                </h3>
                
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {t('checkout.guest_warning_message')}
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={async () => {
                      setShowGuestWarning(false);
                      await processOrder();
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('checkout.processing_order')}
                      </>
                    ) : (
                      t('checkout.guest_warning_accept')
                    )}
                  </Button>
                  
                  <Link href={`/login?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/checkout')}`} className="block">
                    <Button
                      variant="outline"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('checkout.guest_warning_login')}
                    </Button>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setShowGuestWarning(false)}
                    className="w-full text-gray-500 hover:text-gray-700"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
