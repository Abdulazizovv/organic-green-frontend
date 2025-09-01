"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sprout, Users, TrendingUp, Award, ArrowRight, Play, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/ui/ProductCard";
import { useFeaturedProducts, useCategories } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

// Fixed positions for animations to avoid hydration mismatch
const animationParticles = [
  { left: 15, top: 25 },
  { left: 85, top: 15 },
  { left: 65, top: 75 },
  { left: 25, top: 85 },
  { left: 75, top: 35 },
  { left: 45, top: 65 },
  { left: 35, top: 15 },
  { left: 55, top: 95 },
  { left: 95, top: 45 },
  { left: 5, top: 55 },
  { left: 80, top: 80 },
  { left: 20, top: 20 },
  { left: 90, top: 60 },
  { left: 10, top: 90 },
  { left: 60, top: 10 },
  { left: 40, top: 40 },
  { left: 70, top: 70 },
  { left: 30, top: 30 },
  { left: 50, top: 50 },
  { left: 85, top: 25 }
];

const floatingParticles = [
  { left: 30, top: 20 },
  { left: 70, top: 30 },
  { left: 50, top: 60 },
  { left: 80, top: 40 },
  { left: 20, top: 70 },
  { left: 60, top: 15 },
  { left: 40, top: 80 },
  { left: 90, top: 50 }
];

const heroStats = [
  { number: "500+", labelKey: "happy_customers", icon: Users },
  { number: "50+", labelKey: "product_types", icon: Sprout },
  { number: "3", labelKey: "years_experience", icon: TrendingUp },
  { number: "15+", labelKey: "quality_certificates", icon: Award },
];

const directions = [
  {
    titleKey: "directions.microgreens_title",
    descriptionKey: "directions.microgreens_description",
    image: "/images/microgreens.jpg",
    benefitKeys: ["directions.microgreens_benefit1", "directions.microgreens_benefit2", "directions.microgreens_benefit3"],
    href: "/products?category=microgreens"
  },
  {
    titleKey: "directions.supplements_title",
    descriptionKey: "directions.supplements_description",
    image: "/images/supplements.jpg", 
    benefitKeys: ["directions.supplements_benefit1", "directions.supplements_benefit2", "directions.supplements_benefit3"],
    href: "/products?category=supplements"
  },
  {
    titleKey: "directions.franchise_title",
    descriptionKey: "directions.franchise_description",
    image: "/images/franchise.jpg",
    benefitKeys: ["directions.franchise_benefit1", "directions.franchise_benefit2", "directions.franchise_benefit3"],
    href: "/franchise"
  },
  {
    titleKey: "directions.education_title",
    descriptionKey: "directions.education_description",
    image: "/images/education.jpg",
    benefitKeys: ["directions.education_benefit1", "directions.education_benefit2", "directions.education_benefit3"],
    href: "/education"
  }
];

const testimonials = [
  {
    name: "Азиза Каримова",
    role: "Мижоз",
    content: "Organic Green маҳсулотлари ҳақиқатан ҳам сифатли. Микрозелень жуда тоза ва мазали!",
    rating: 5,
    image: "/images/testimonials/aziza.jpg"
  },
  {
    name: "Шерзод Ахмедов", 
    role: "Франшиза эгаси",
    content: "Франшиза олгандан кейин даромадим 3 баробар ошди. Жуда мамнунман!",
    rating: 5,
    image: "/images/testimonials/sherzod.jpg"
  },
  {
    name: "Малика Рустамова",
    role: "Курс битирувчиси",
    content: "Таълим курси жуда фойдали эди. Энди ўзим микрозелень етиштирамаан!",
    rating: 5,
    image: "/images/testimonials/malika.jpg"
  }
];

const certificates = [
  { name: "ISO 9001", image: "/images/certificates/iso9001.jpg" },
  { name: "HALAL", image: "/images/certificates/halal.jpg" },
  { name: "ORGANIC", image: "/images/certificates/organic.jpg" },
  { name: "GMP", image: "/images/certificates/gmp.jpg" },
];

// Featured Products Component
const FeaturedProductsSection = () => {
  const { data: productsData, loading, error } = useFeaturedProducts();
  const { t, language } = useLanguage();
  const products = productsData?.results || [];

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
                                <p className="mt-4 text-gray-600">{t('loading_products')}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null; // Don't show section if there are errors or no products
  }

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('featured_products_title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t('featured_products_description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/products">
            <Button 
              size="lg" 
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              {t('view_all_products')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { t, language } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/microgreens-pattern.svg')] opacity-5"></div>
          {animationParticles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6"
              >
                <Sprout className="w-4 h-4 mr-2" />
                Ўзбекистонда №1 микрозелень компанияси
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-heading leading-tight"
              >
                <span className="text-green-600">{t('hero_title')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-lg text-gray-600 mb-8 max-w-2xl"
              >
                {t('hero_description')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Button size="xl" className="group bg-green-600 hover:bg-green-700 text-white">
                  {t('shop_now')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="xl" className="group border-green-300 text-green-700 hover:bg-green-50">
                  <Play className="w-5 h-5 mr-2" />
                  {t('learn_more')}
                </Button>
              </motion.div>

              {/* Hero Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {heroStats.map((stat, index) => (
                  <motion.div
                    key={stat.labelKey}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                    className="text-center lg:text-left"
                  >
                    <div className="flex items-center justify-center lg:justify-start mb-2">
                      <stat.icon className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-2xl font-bold text-gray-900">{stat.number}</span>
                    </div>
                    <p className="text-sm text-gray-600">{t(stat.labelKey)}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Microgreen Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-b from-green-100 to-green-200 p-8">
                {/* Growing microgreens animation */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bottom-0 w-1 bg-green-600 rounded-t-full"
                      style={{
                        left: `${10 + (i * 5)}%`,
                        height: `${30 + Math.random() * 40}%`,
                      }}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${30 + Math.random() * 40}%`, opacity: 1 }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 1,
                      }}
                    >
                      {/* Leaves */}
                      <motion.div
                        className="absolute -top-1 -left-1 w-3 h-2 bg-green-400 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-2 bg-green-300 rounded-full"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, -5, 5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.1 + 0.5,
                        }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Floating particles */}
                {floatingParticles.map((particle, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-green-300 rounded-full"
                    style={{
                      left: `${particle.left}%`,
                      top: `${particle.top}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                  />
                ))}

                {/* Main microgreen image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-3xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProductsSection />

      {/* Directions Section */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              {t('directions.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('directions.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {directions.map((direction, index) => (
              <motion.div
                key={direction.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                  <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-t-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sprout className="w-16 h-16 text-green-600" />
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-bold group-hover:text-green-600 transition-colors">
                      {t(direction.titleKey)}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {t(direction.descriptionKey)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {direction.benefitKeys.map((benefitKey, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {t(benefitKey)}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all"
                    >
                      {t('directions.details')}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Мижозларимиз <span className="text-green-600">фикри</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Мижозларимизнинг ижобий фикрлари биз учун энг қимматли мукофот
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Card className="p-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-lg text-gray-700 mb-6 italic">
                  &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                </blockquote>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {testimonials[currentTestimonial].name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Testimonial indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial 
                      ? "bg-green-600" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="py-20 bg-gradient-to-b from-white to-yellow-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
              Сифат <span className="text-gold">кафолати</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Халқаро стандартлар бўйича сертификатлашган маҳсулотларимиз
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center group"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center mb-4 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-300 shadow-lg">
                  <Award className="w-12 h-12 text-gold group-hover:text-yellow-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 text-center group-hover:text-gold transition-colors">
                  {cert.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-green-700 to-green-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/microgreens-pattern.svg')]"></div>
        </div>
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Соғлом турмуш тарзини бугундан <span className="text-yellow-300">бошланг!</span>
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Табиий маҳсулотларимиз билан танишинг ёки франшиза олиб ўз 
              бизнесингизни бошланг
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="outline" className="bg-white text-green-600 hover:bg-gray-50 border-white">
                Маҳсулотлар
              </Button>
              <Button size="xl" variant="gold" className="bg-gold hover:bg-yellow-600 text-white border-gold">
                Франшиза олиш
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
