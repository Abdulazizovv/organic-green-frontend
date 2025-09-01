'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

import { Product, favoritesAPI } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';

interface FavoriteButtonProps {
  product: Product;
  className?: string;
}

export default function FavoriteButton({ product, className = '' }: FavoriteButtonProps) {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check favorite status on mount
  useEffect(() => {
    async function checkFavoriteStatus() {
      try {
        const result = await favoritesAPI.check(product.id);
        setIsFavorite(result.is_favorite);
        setFavoriteId(result.favorite_id || null);
      } catch (error) {
        console.error('Failed to check favorite status:', error);
      }
    }

    checkFavoriteStatus();
  }, [product.id]);

  const handleToggleFavorite = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Optimistic update
    const previousState = isFavorite;
    const previousFavoriteId = favoriteId;
    setIsFavorite(!isFavorite);
    
    try {
      if (isFavorite && favoriteId) {
        // Remove from favorites
        await favoritesAPI.remove(favoriteId);
        setFavoriteId(null);
        showSuccess(
          t('favorites.removed_success') || 'Removed from favorites',
          '💔'
        );
      } else {
        // Add to favorites
        const result = await favoritesAPI.add(product.id);
        setFavoriteId(result.id);
        showSuccess(
          t('favorites.added_success') || 'Added to favorites',
          '💖'
        );
      }
    } catch (error: any) {
      // Revert optimistic update
      setIsFavorite(previousState);
      setFavoriteId(previousFavoriteId);
      
      console.error('Failed to update favorites:', error);
      
      // Handle 429 throttling
      if (error?.response?.status === 429) {
        showError(
          t('error.too_many_requests') || 'Too many requests 🌱 please wait a moment',
          'Rate Limited'
        );
      } else {
        showError(
          t('favorites.update_error') || 'Failed to update favorites',
          'Favorites Error'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <Button
        variant={isFavorite ? "default" : "outline"}
        size="sm"
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`relative overflow-hidden ${
          isFavorite 
            ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
            : 'hover:bg-red-50 hover:border-red-200 hover:text-red-700'
        }`}
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <motion.div
              animate={{
                scale: isFavorite ? [1, 1.3, 1] : 1,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite ? 'fill-current text-red-500' : ''
                }`}
              />
            </motion.div>
          )}
          
          <span className="text-sm font-medium">
            {isFavorite 
              ? (t('favorites.remove') || 'Remove')
              : (t('favorites.add') || 'Add to Favorites')
            }
          </span>
        </div>

        {/* Heart particles animation */}
        {isFavorite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: '50%', 
                  y: '50%',
                  scale: 0 
                }}
                animate={{
                  x: [
                    '50%',
                    `${50 + (Math.random() - 0.5) * 100}%`
                  ],
                  y: [
                    '50%',
                    `${20 + Math.random() * 30}%`
                  ],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute"
              >
                <Heart className="w-3 h-3 fill-current text-red-400" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
}
