"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Truck,
  Shield,
  ArrowLeft,
  Loader2,
  ShoppingCart
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage, getLocalizedName } from "@/lib/language";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, loading, error, updateCartItem, removeCartItem, clearCart } = useCart();
  const { t, language } = useLanguage();
  const [isUpdatingItem, setIsUpdatingItem] = useState<string | null>(null);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setIsUpdatingItem(itemId);
      await updateCartItem({ item_id: itemId, quantity: newQuantity });
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Qayta urinib ko&apos;rish
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
                Orqaga
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{t('cart')}</h1>
          </div>

          {/* Empty Cart */}
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Savatchangiz bo&apos;sh
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Hozircha savatchangizda hech qanday mahsulot yo&apos;q. Mahsulotlarni ko&apos;rish va sotib olish uchun do&apos;konimizga tashrif buyuring.
            </p>
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Xarid qilishni boshlash
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
                Orqaga
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{t('cart')}</h1>
          </div>
          
          {cart && cart.items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Savatni tozalash
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart?.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product.primary_image_url ? (
                          <Image
                            src={`http://api.organicgreen.uz${item.product.primary_image_url}`}
                            alt={getLocalizedName(item.product, language)}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {getLocalizedName(item.product, language)}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-xl text-gray-900">
                            {item.unit_price.toLocaleString()} {t('currency')}
                          </span>
                          {item.product.is_on_sale && (
                            <span className="text-sm text-gray-500 line-through">
                              {parseFloat(item.product.price).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdatingItem === item.id}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            
                            <span className="w-12 text-center font-medium">
                              {isUpdatingItem === item.id ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.max_quantity || isUpdatingItem === item.id}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Total Price & Remove Button */}
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-lg text-green-600">
                              {item.total_price.toLocaleString()} {t('currency')}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Buyurtma xulosasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items Summary */}
                <div className="flex justify-between text-sm">
                  <span>Mahsulotlar ({cart?.total_items}):</span>
                  <span>{cart?.total_price.toLocaleString()} {t('currency')}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Yetkazib berish:
                  </span>
                  <span className="text-green-600 font-medium">Bepul</span>
                </div>

                <hr className="border-gray-200" />

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Jami:</span>
                  <span className="text-green-600">
                    {cart?.total_price.toLocaleString()} {t('currency')}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buyurtma berish
                </Button>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-4">
                  <Shield className="w-4 h-4 text-green-600" />
                  Xavfsiz to&apos;lov tizimi
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
