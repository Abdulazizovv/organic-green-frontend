'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language';
import { TELEGRAM_BOT_URL } from '@/utils/receiptGenerator';

interface TelegramPromoCardProps {
  onDismiss?: () => void;
  className?: string;
}

export function TelegramPromoCard({ onDismiss, className = '' }: TelegramPromoCardProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleJoinBot = () => {
    window.open(TELEGRAM_BOT_URL, '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 shadow-sm ${className}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              {/* Telegram Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">🌿</span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('order.telegram_promo.title')}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {t('order.telegram_promo.subtitle')}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleJoinBot}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('order.telegram_promo.cta')}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm"
                  >
                    {t('order.telegram_promo.dismiss')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface TelegramPromoBannerProps {
  className?: string;
}

export function TelegramPromoBanner({ className = '' }: TelegramPromoBannerProps) {
  const { t } = useLanguage();

  const handleJoinBot = () => {
    window.open(TELEGRAM_BOT_URL, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-sm">
              {t('order.telegram_promo.title')}
            </p>
            <p className="text-blue-100 text-xs">
              {t('order.telegram_promo.subtitle')}
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleJoinBot}
          variant="outline"
          size="sm"
          className="bg-white text-blue-600 hover:bg-blue-50 border-white"
        >
          {t('order.telegram_promo.cta')}
        </Button>
      </div>
    </motion.div>
  );
}
