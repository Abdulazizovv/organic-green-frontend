"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft,
  Loader2,
  Leaf,
  Truck,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useLanguage, getLocalizedName } from "@/lib/language";
import { useToast } from "@/context/ToastContext";
import type { CartItem } from "@/types/cart";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    x: -100, 
    transition: { duration: 0.3 }
  }
};

const quantityVariants = {
  tap: { scale: 0.95 },
  hover: { scale: 1.05 }
};

const bounceVariants = {
  bounce: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.3 }
  }
};

// Loading skeleton component
const CartItemSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-green-100 animate-pulse">
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-xl" />
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between items-center">
          <div className="h-10 bg-gray-200 rounded-lg w-24" />
          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Cart Item Component
const CartItemCard = ({ 
  item, 
  onQuantityChange, 
  onRemove, 
  isUpdating 
}: {
  item: CartItem;
  onQuantityChange: (itemId: string, newQuantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  isUpdating: boolean;
}) => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false);
  const [quantityLoading, setQuantityLoading] = useState<'increase' | 'decrease' | null>(null);

  const productName = getLocalizedName({
    name_uz: item.product.name_uz,
    name_ru: item.product.name_ru,
    name_en: item.product.name_en
  }, language);

  const handleQuantityChange = async (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) return;
    
    // Check stock limit
    if (newQuantity > item.product.stock) {
      showToast(t('outOfStock'), 'error');
      return;
    }

    setQuantityLoading(change > 0 ? 'increase' : 'decrease');
    
    try {
      await onQuantityChange(item.id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      showToast(t('updateFailed'), 'error');
    } finally {
      setQuantityLoading(null);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      showToast(t('removeFailed'), 'error');
      setIsRemoving(false);
    }
  };

  const isAtMaxStock = item.quantity >= item.product.stock;
  const formattedPrice = (item.total_price || (item.unit_price * item.quantity)).toLocaleString();

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-green-100 hover:shadow-md transition-all duration-300 hover:border-green-200"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="relative w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
          {item.product.primary_image_url || item.product.image_url ? (
            <Image
              src={item.product.primary_image_url || item.product.image_url || '/placeholder-product.jpg'}
              alt={productName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Leaf className="w-8 h-8 text-green-400" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight mb-1 truncate">
                {productName}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {item.unit_price.toLocaleString()} {t('currency')} × {item.quantity}
              </p>
            </div>
            
            {/* Remove Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRemove}
              disabled={isRemoving}
              className="self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              aria-label={t('removeFromCart')}
            >
              {isRemoving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </motion.button>
          </div>

          {/* Quantity Controls and Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Quantity Controls */}
              <div className="flex items-center bg-gray-50 rounded-lg p-1">
                <motion.button
                  variants={quantityVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={item.quantity <= 1 || quantityLoading === 'decrease'}
                  className="p-2 hover:bg-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={t('decreaseQuantity')}
                >
                  {quantityLoading === 'decrease' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-600" />
                  )}
                </motion.button>

                <motion.span 
                  key={item.quantity}
                  variants={bounceVariants}
                  animate={quantityLoading ? "bounce" : ""}
                  className="px-3 py-2 min-w-[3rem] text-center font-medium text-gray-900"
                >
                  {item.quantity}
                </motion.span>

                <motion.button
                  variants={quantityVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isAtMaxStock || quantityLoading === 'increase'}
                  className="p-2 hover:bg-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={t('increaseQuantity')}
                  title={isAtMaxStock ? t('maxStockReached') : ''}
                >
                  {quantityLoading === 'increase' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-600" />
                  )}
                </motion.button>
              </div>

              {/* Stock Warning */}
              {isAtMaxStock && (
                <span className="text-xs text-orange-600 font-medium">
                  {t('maxStock')}: {item.product.stock}
                </span>
              )}
            </div>

            {/* Item Total Price */}
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {formattedPrice} {t('currency')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Cart Summary Component
const CartSummary = ({ 
  isSticky = false, 
  className = "" 
}: { 
  isSticky?: boolean; 
  className?: string; 
}) => {
  const { cart, summary, loading } = useCart();
  const { t } = useLanguage();

  if (!cart || cart.is_empty) return null;

  const subtotal = summary?.total_price || cart.total_price || 0;
  const deliveryFee = subtotal > 100000 ? 0 : 15000; // Free delivery over 100k
  const total = subtotal + deliveryFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 shadow-lg border border-green-100 ${isSticky ? 'sticky top-24' : ''} ${className}`}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">{t('orderSummary')}</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">{t('subtotal')} ({cart.total_items} {t('items')})</span>
          <span className="font-medium">{subtotal.toLocaleString()} {t('currency')}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">{t('delivery')}</span>
          </div>
          <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
            {deliveryFee === 0 ? t('free') : `${deliveryFee.toLocaleString()} ${t('currency')}`}
          </span>
        </div>
        
        {deliveryFee === 0 && (
          <div className="flex items-center space-x-2 text-green-600 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('freeDeliveryEligible')}</span>
          </div>
        )}
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between items-center text-lg font-bold">
          <span>{t('total')}</span>
          <span className="text-green-600">{total.toLocaleString()} {t('currency')}</span>
        </div>
      </div>
      
      <Button 
        size="lg"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <CreditCard className="w-5 h-5 mr-2" />
        )}
        {t('proceedToCheckout')}
      </Button>
      
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3" />
          <span>{t('securePayment')}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Truck className="w-3 h-3" />
          <span>{t('fastDelivery')}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Empty Cart Component
const EmptyCart = () => {
  const { t } = useLanguage();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 px-4"
    >
      <div className="max-w-md mx-auto">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
        >
          <ShoppingBag className="w-12 h-12 text-green-600" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cartEmpty')}</h2>
        <p className="text-gray-600 mb-8">{t('cartEmptyDescription')}</p>
        
        <Link href="/products">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Leaf className="w-5 h-5 mr-2" />
            {t('startShopping')}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

// Main Cart Page Component
export default function CartPage() {
  const { cart, loading, updateItem, removeItem, refreshCart } = useCart();
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Loading state
  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <CartItemSkeleton key={i} />
              ))}
            </div>
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || cart.is_empty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/products">
              <Button variant="outline" size="sm" className="hover:bg-green-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('continueShopping')}
              </Button>
            </Link>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {t('shoppingCart')}
          </h1>
          <p className="text-gray-600">
            {cart.total_items} {t('itemsInCart')}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {cart.items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onQuantityChange={updateItem}
                    onRemove={removeItem}
                    isUpdating={loading}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Cart Summary - Desktop */}
          <div className="hidden lg:block">
            <CartSummary isSticky />
          </div>
        </div>

        {/* Mobile Summary - Fixed Bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 shadow-lg z-40">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-between mb-4"
            >
              <span className="font-semibold text-gray-900">{t('orderSummary')}</span>
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <CartSummary className="border-0 shadow-none p-0 bg-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {isCollapsed && (
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">{t('total')}</span>
                <span className="font-bold text-green-600">
                  {(cart.total_price + (cart.total_price > 100000 ? 0 : 15000)).toLocaleString()} {t('currency')}
                </span>
              </div>
            )}
            
            <Button 
              size="lg"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 rounded-xl"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {t('proceedToCheckout')}
            </Button>
          </div>
        </div>

        {/* Bottom Spacer for Mobile */}
        <div className="lg:hidden h-32" />
      </div>
    </div>
  );
}
