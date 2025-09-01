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
  Star,
  Heart,
  Gift,
  CheckCircle,
  ArrowLeft,
  PercentIcon,
  Loader2
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage, getLocalizedName } from "@/lib/language";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Organic кўкат йиғиндиси",
      description: "Табиий ва соғлом кўкатлар арлашмаси - салат барглари, шпинат, руккола",
      price: 45000,
      originalPrice: 50000,
      quantity: 2,
      category: "Кўкатлар",
      inStock: true,
      weight: "500г",
      discount: 10,
      rating: 4.8,
      freshness: "Янги йиғилган"
    },
    {
      id: 2,
      name: "Органик мева қутиси",
      description: "Мавсумий мевалар арлашмаси - олма, анор, узум, бехи",
      price: 120000,
      originalPrice: 140000,
      quantity: 1,
      category: "Мевалар",
      inStock: true,
      weight: "2кг",
      discount: 15,
      rating: 4.9,
      freshness: "Буюк йиғилган"
    },
    {
      id: 3,
      name: "Табиий асал",
      description: "Тоғ гуллари асали - 100% табиий ва тоза, консервантсиз",
      price: 85000,
      originalPrice: 95000,
      quantity: 1,
      category: "Асал",
      inStock: true,
      weight: "1кг",
      discount: 10,
      rating: 5.0,
      freshness: "Янги ишлаб чиқарилган"
    },
    {
      id: 4,
      name: "Органик йонгоқ арлашмаси",
      description: "Ёнгоқлар арлашмаси - бодом, жангак, фундуқ табиий холда",
      price: 75000,
      originalPrice: 85000,
      quantity: 1,
      category: "Йонгоқлар",
      inStock: true,
      weight: "500г",
      discount: 12,
      rating: 4.7,
      freshness: "Янги қуритилган"
    }
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode === "ORGANIC20") {
      setAppliedPromo({ code: "ORGANIC20", discount: 20, type: "percentage" });
    } else if (promoCode === "NEWUSER") {
      setAppliedPromo({ code: "NEWUSER", discount: 15000, type: "fixed" });
    }
  };

  const stats = [
    {
      icon: ShoppingBag,
      title: "Маҳсулотлар",
      value: cartItems.length.toString(),
      description: "Саватдаги маҳсулотлар"
    },
    {
      icon: Truck,
      title: "Бепул етказиб бериш",
      value: "200,000+ сўм",
      description: "Минимал сумма"
    },
    {
      icon: Shield,
      title: "Сифат кафолати",
      value: "100%",
      description: "Маҳсулот сифати"
    },
    {
      icon: Gift,
      title: "Бонус баллар",
      value: "350",
      description: "Ҳарид учун балл"
    }
  ];

  const recommendations = [
    {
      id: 5,
      name: "Органик зайтун ёғи",
      price: 95000,
      originalPrice: 110000,
      rating: 4.8,
      discount: 15,
      category: "Ёғлар",
      weight: "500мл"
    },
    {
      id: 6,
      name: "Табиий мурабба",
      price: 35000,
      originalPrice: 42000,
      rating: 4.9,
      discount: 17,
      category: "Мураббалар",
      weight: "450г"
    },
    {
      id: 7,
      name: "Органик кунжут ёғи",
      price: 65000,
      originalPrice: 75000,
      rating: 4.7,
      discount: 13,
      category: "Ёғлар",
      weight: "250мл"
    }
  ];

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const promoDiscount = appliedPromo 
    ? appliedPromo.type === 'percentage' 
      ? subtotal * (appliedPromo.discount / 100)
      : appliedPromo.discount
    : 0;
  const discountedSubtotal = subtotal - promoDiscount;
  const deliveryFee = discountedSubtotal >= 200000 ? 0 : 25000;
  const total = discountedSubtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full opacity-20"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>

        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button 
                variant="outline" 
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Харидни давом эттириш
              </Button>
            </motion.div>

            <motion.h1 
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Харид{" "}
              <span className="text-green-600">савати</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Сифатли organic маҳсулотларингизни кўриб чиқинг ва 
              буюртмангизни расмийлаштиринг
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{stat.title}</h3>
                    <p className="text-sm text-gray-600">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {cartItems.length === 0 ? (
        /* Empty Cart */
        <section className="py-20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag className="w-16 h-16 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Саватингиз бўш</h2>
              <p className="text-xl text-gray-600 mb-8">
                Энг сифатли organic маҳсулотларни танлаб, саватингизни тўлдиринг
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Харид қилишни бошлаш
              </Button>
            </div>
          </div>
        </section>
      ) : (
        /* Cart Items Section */
        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="xl:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-900 font-heading">
                    Сават <span className="text-green-600">({cartItems.length} та маҳсулот)</span>
                  </h2>
                  <Button 
                    variant="outline" 
                    className="border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => setCartItems([])}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Ҳаммасини ўчириш
                  </Button>
                </div>

                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          {/* Product Image */}
                          <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex-shrink-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl mb-1">🥬</div>
                              <div className="text-xs text-green-600 font-medium">{item.category}</div>
                            </div>
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{item.description}</p>
                                
                                <div className="flex items-center gap-4 mb-3">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${
                                          i < Math.floor(item.rating) 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-300'
                                        }`} 
                                      />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-1">({item.rating})</span>
                                  </div>
                                  <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {item.freshness}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                    {item.category}
                                  </span>
                                  <span className="font-medium">{item.weight}</span>
                                  <span className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    Мавжуд
                                  </span>
                                  {item.discount > 0 && (
                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1">
                                      <PercentIcon className="w-3 h-3" />
                                      -{item.discount}%
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-gray-600 border-gray-200 hover:bg-gray-50"
                                >
                                  <Heart className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="text-2xl font-bold text-green-600">
                                  {item.price.toLocaleString()} сўм
                                </div>
                                {item.discount > 0 && (
                                  <div className="text-lg text-gray-500 line-through">
                                    {item.originalPrice.toLocaleString()} сўм
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-10 h-10 p-0 border-green-200 text-green-700 hover:bg-green-50"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-lg font-medium text-gray-900 min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-10 h-10 p-0 border-green-200 text-green-700 hover:bg-green-50"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-4 h-4" />
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
              <div className="xl:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-green-100 shadow-xl sticky top-8">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900">Буюртма хулосаси</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Promo Code */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Промо код</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="ORGANIC20"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-1 px-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                          <Button 
                            size="sm"
                            onClick={applyPromoCode}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Қўллаш
                          </Button>
                        </div>
                        {appliedPromo && (
                          <div className="text-sm text-green-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Промо код &ldquo;{appliedPromo.code}&rdquo; қўлланди
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Оралиқ сумма:</span>
                          <span className="font-medium">{subtotal.toLocaleString()} сўм</span>
                        </div>
                        
                        {promoDiscount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Промо чегирма:</span>
                            <span className="text-green-600 font-medium">-{promoDiscount.toLocaleString()} сўм</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Етказиб бериш:</span>
                          <span className={deliveryFee === 0 ? "text-green-600 font-medium" : "font-medium"}>
                            {deliveryFee === 0 ? "Бепул" : `${deliveryFee.toLocaleString()} сўм`}
                          </span>
                        </div>
                        
                        {deliveryFee === 0 && (
                          <div className="text-sm text-green-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Бепул етказиб бериш қўлланилди
                          </div>
                        )}
                        
                        <hr className="border-green-100" />
                        
                        <div className="flex justify-between text-lg font-bold">
                          <span>Жами:</span>
                          <span className="text-green-600">{total.toLocaleString()} сўм</span>
                        </div>
                        
                        <div className="text-sm text-green-600">
                          Сиз {(subtotal - (subtotal - promoDiscount)).toLocaleString()} сўм тежадингиз!
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Button 
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Тўловга ўтиш
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full border-green-200 text-green-700 hover:bg-green-50 py-3 rounded-xl"
                        >
                          Харидни давом эттириш
                        </Button>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          Хавфсиз тўлов (SSL шифрлаш)
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-green-600" />
                          24 соат ичида етказиш
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          14 кун қайтариш кафолати
                        </div>
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-green-600" />
                          Ҳар харидда бонус баллар
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-green-100/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
              Сизга <span className="text-green-600">тавсия этамиз</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ушбу маҳсулотлар сизнинг танловингизга мос келиши мумкин
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-t-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🫒</div>
                        <div className="text-sm text-green-600 font-medium">{product.category}</div>
                      </div>
                    </div>
                    {product.discount > 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        -{product.discount}%
                      </div>
                    )}
                    <Button 
                      size="sm"
                      variant="outline"
                      className="absolute top-4 right-4 w-10 h-10 p-0 bg-white border-gray-200 hover:bg-gray-50"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.weight}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="text-xl font-bold text-green-600">
                          {product.price.toLocaleString()} сўм
                        </div>
                        {product.discount > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            {product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl"
                      onClick={() => {
                        const newItem = {
                          ...product,
                          quantity: 1,
                          description: `Юқори сифатли ${product.name.toLowerCase()}`,
                          inStock: true,
                          freshness: "Янги келган"
                        };
                        setCartItems(prev => [...prev, newItem]);
                      }}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Саватга қўшиш
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
