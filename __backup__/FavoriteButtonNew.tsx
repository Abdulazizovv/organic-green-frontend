'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

import { Product } from '@/api/products';
import { useFavorites } from '@/hooks/useProducts';
import { useLanguage } from '@/lib/language';

interface FavoriteButtonProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ 
  product, 
  className = '', 
  size = 'md' 
}: FavoriteButtonProps) {
  const { t } = useLanguage();
  const { checkFavorite, toggleFavorite, loading } = useFavorites();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Size variants
  const sizeVariants = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Check if product is favorited on mount
  useEffect(() => {
    async function checkFavoriteStatus() {
      try {
        setIsChecking(true);
        const response = await checkFavorite(product.id);
        setIsFavorited(response.is_favorited);
        setFavoriteId(response.favorite_id || null);
      } catch (error) {
        // If not authenticated, just set as not favorited
        setIsFavorited(false);
        setFavoriteId(null);
      } finally {
        setIsChecking(false);
      }
    }

    checkFavoriteStatus();
  }, [product.id, checkFavorite]);

  const handleToggleFavorite = async () => {
    try {
      // Optimistic update
      const wasAlreadyFavorited = isFavorited;
      setIsFavorited(!isFavorited);

      const response = await toggleFavorite(product.id);
      
      // Update state based on API response
      setIsFavorited(response.action === 'added');
      if (response.favorite) {
        setFavoriteId(response.favorite.id);
      } else {
        setFavoriteId(null);
      }
    } catch (error) {
      // Rollback optimistic update on error
      setIsFavorited(isFavorited);
      console.error('Failed to toggle favorite:', error);
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    favorited: { 
      scale: [1, 1.2, 1], 
      transition: { duration: 0.3 } 
    }
  };

  const heartVariants = {
    unfavorited: { 
      scale: 1,
      fill: 'none',
      stroke: '#6B7280'
    },
    favorited: { 
      scale: 1,
      fill: '#EF4444',
      stroke: '#EF4444'
    }
  };

  if (isChecking) {
    return (
      <div className={`${sizeVariants[size]} ${className} rounded-full bg-gray-100 flex items-center justify-center`}>
        <div className="animate-pulse">
          <Heart className={`${iconSizes[size]} text-gray-400`} />
        </div>
      </div>
    );
  }

  return (
    <motion.button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
        ${sizeVariants[size]} ${className}
        rounded-full flex items-center justify-center
        transition-all duration-200
        ${isFavorited 
          ? 'bg-red-50 hover:bg-red-100 border-2 border-red-200' 
          : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        shadow-sm hover:shadow-md
      `}
      variants={buttonVariants}
      initial="idle"
      whileHover={!loading ? "hover" : "idle"}
      whileTap={!loading ? "tap" : "idle"}
      animate={isFavorited ? "favorited" : "idle"}
      title={isFavorited 
        ? (t('favorites.remove_tooltip') || 'Remove from favorites') 
        : (t('favorites.add_tooltip') || 'Add to favorites')
      }
    >
      <motion.div
        variants={heartVariants}
        animate={isFavorited ? "favorited" : "unfavorited"}
        transition={{ duration: 0.2 }}
      >
        <Heart 
          className={`${iconSizes[size]} transition-all duration-200`}
          fill={isFavorited ? '#EF4444' : 'none'}
          stroke={isFavorited ? '#EF4444' : '#6B7280'}
        />
      </motion.div>

      {/* Loading indicator */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
        </motion.div>
      )}
    </motion.button>
  );
}
