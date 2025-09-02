'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, Leaf, Award, Clock } from 'lucide-react';

import { Product } from '@/api/products';
import { useLanguage, getLocalizedName, getLocalizedDescription } from '@/lib/language';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { t, language } = useLanguage();

  const productDescription = getLocalizedDescription(product, language);
  const productName = getLocalizedName(product, language);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const advantagesList = [
    {
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      title: t('products.advantage_organic') || '100% Organic',
      description: t('products.advantage_organic_desc') || 'Grown without chemicals or pesticides'
    },
    {
      icon: <Award className="w-6 h-6 text-green-600" />,
      title: t('products.advantage_quality') || 'Premium Quality',
      description: t('products.advantage_quality_desc') || 'Carefully selected and quality controlled'
    },
    {
      icon: <Clock className="w-6 h-6 text-green-600" />,
      title: t('products.advantage_fresh') || 'Always Fresh',
      description: t('products.advantage_fresh_desc') || 'Harvested daily for maximum freshness'
    },
    {
      icon: <Package className="w-6 h-6 text-green-600" />,
      title: t('products.advantage_packaging') || 'Eco Packaging',
      description: t('products.advantage_packaging_desc') || 'Environmentally friendly packaging'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Product Description */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('products.about_product') || 'About This Product'}
        </h2>
        
        {productDescription ? (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              {productDescription}
            </p>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed text-lg">
            {t('products.default_description') || 
             `Experience the pure goodness of ${productName}. Our premium organic microgreens are carefully cultivated to deliver exceptional taste and nutritional value.`}
          </p>
        )}

        {/* Product Details */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">
              {t('products.category') || 'Category'}
            </div>
            <div className="text-gray-900 font-semibold mt-1">
              {product.localized_category_name}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">
              {t('products.availability') || 'Availability'}
            </div>
            <div className="text-gray-900 font-semibold mt-1">
              {product.available_stock > 0 
                ? (t('products.in_stock') || 'In Stock')
                : (t('products.out_of_stock') || 'Out of Stock')
              }
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">
              {t('products.freshness') || 'Freshness'}
            </div>
            <div className="text-gray-900 font-semibold mt-1">
              {t('products.daily_harvest') || 'Daily Harvest'}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">
              {t('products.origin') || 'Origin'}
            </div>
            <div className="text-gray-900 font-semibold mt-1">
              {t('products.origin_uzbekistan') || 'Uzbekistan'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Product Advantages */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 lg:p-8 border border-green-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('products.why_choose') || 'Why Choose Our Products?'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advantagesList.map((advantage, index) => (
            <motion.div
              key={index}
              className="flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {advantage.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {advantage.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Nutritional Benefits */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {t('products.nutritional_benefits') || 'Nutritional Benefits'}
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700 mb-1">40x</div>
            <div className="text-sm text-green-600">
              {t('products.more_nutrients') || 'More Nutrients'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 mb-1">100%</div>
            <div className="text-sm text-blue-600">
              {t('products.natural') || 'Natural'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-700 mb-1">0</div>
            <div className="text-sm text-orange-600">
              {t('products.chemicals') || 'Chemicals'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700 mb-1">7-14</div>
            <div className="text-sm text-purple-600">
              {t('products.days_fresh') || 'Days Fresh'}
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            {t('products.rich_in') || 'Rich in:'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              t('products.vitamin_a') || 'Vitamin A',
              t('products.vitamin_c') || 'Vitamin C', 
              t('products.vitamin_k') || 'Vitamin K',
              t('products.folate') || 'Folate',
              t('products.iron') || 'Iron',
              t('products.antioxidants') || 'Antioxidants'
            ].map((nutrient, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm border"
              >
                {nutrient}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Storage Instructions */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('products.storage_instructions') || 'Storage & Care Instructions'}
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">1</span>
            </div>
            <p className="text-gray-700">
              {t('products.storage_1') || 'Store in refrigerator at 2-4°C'}
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">2</span>
            </div>
            <p className="text-gray-700">
              {t('products.storage_2') || 'Keep in original packaging until use'}
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">3</span>
            </div>
            <p className="text-gray-700">
              {t('products.storage_3') || 'Consume within 7-10 days for best quality'}
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">4</span>
            </div>
            <p className="text-gray-700">
              {t('products.storage_4') || 'Rinse gently before consumption'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
