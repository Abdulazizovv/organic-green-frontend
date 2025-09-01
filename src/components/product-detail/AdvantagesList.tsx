'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Leaf, Heart, Shield, Sparkles, Star } from 'lucide-react';

import { Product } from '@/lib/api';
import { getLocalizedName } from '@/lib/utils';
import { useLanguage } from '@/lib/language';

interface AdvantagesListProps {
  product: Product;
  className?: string;
}

// Generate advantages based on product properties
const generateAdvantages = (product: Product, t: (key: string) => string) => {
  const advantages = [];

  // Organic certification
  if (product.is_featured) {
    advantages.push({
      id: 'organic',
      icon: Leaf,
      text: t('product.advantage.organic') || '100% Organic & Natural',
      color: 'text-green-600',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-100'
    });
  }

  // Fresh products
  advantages.push({
    id: 'fresh',
    icon: Sparkles,
    text: t('product.advantage.fresh') || 'Farm Fresh Quality',
    color: 'text-blue-600',
    bgColor: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-100'
  });

  // Health benefits
  advantages.push({
    id: 'health',
    icon: Heart,
    text: t('product.advantage.health') || 'Rich in Nutrients & Vitamins',
    color: 'text-red-600',
    bgColor: 'from-red-50 to-pink-50',
    borderColor: 'border-red-100'
  });

  // Quality guarantee
  advantages.push({
    id: 'quality',
    icon: Shield,
    text: t('product.advantage.quality') || 'Quality Guaranteed',
    color: 'text-purple-600',
    bgColor: 'from-purple-50 to-violet-50',
    borderColor: 'border-purple-100'
  });

  // Premium product badge
  if (product.is_on_sale) {
    advantages.push({
      id: 'value',
      icon: Award,
      text: t('product.advantage.value') || 'Best Value for Money',
      color: 'text-orange-600',
      bgColor: 'from-orange-50 to-amber-50',
      borderColor: 'border-orange-100'
    });
  }

  return advantages;
};

export default function AdvantagesList({ product, className = '' }: AdvantagesListProps) {
  const { language, t } = useLanguage();

  const advantages = generateAdvantages(product, t);

  if (advantages.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Award className="w-5 h-5 text-green-600" />
        {t('product.advantages') || 'Key Benefits'}
      </h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-3"
      >
        {advantages.map((advantage, index) => {
          const IconComponent = advantage.icon;
          
          return (
            <motion.div
              key={advantage.id}
              variants={itemVariants}
              whileHover={{ 
                x: 4,
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.1)"
              }}
              className={`flex items-start gap-3 p-3 bg-gradient-to-r ${advantage.bgColor} rounded-lg border ${advantage.borderColor} hover:border-green-200 transition-all duration-200`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <IconComponent className={`w-5 h-5 ${advantage.color}`} />
              </div>
              
              <div className="flex-1">
                <p className="text-gray-700 font-medium leading-relaxed">
                  {advantage.text}
                </p>
              </div>
              
              {/* Star rating for featured products */}
              {product.is_featured && index === 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-shrink-0"
                >
                  <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Additional info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
      >
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {t('product.advantages_note') || 'All benefits are based on product certification and quality standards'}
        </p>
      </motion.div>
    </div>
  );
}
