'use client';

import React from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';

interface FavoriteButtonProps {
  product: {
    id: string;
    name_en?: string;
    name_ru?: string;
    name_uz?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const FavoriteButtonNew: React.FC<FavoriteButtonProps> = ({
  product,
  size = 'md',
  variant = 'ghost',
  className = '',
}) => {
  const { isFavorited, toggleFavorite, loading } = useFavorites();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(product.id);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const isFav = isFavorited(product.id);

  return (
    <Button
      variant={variant}
      size="icon"
      className={`${sizeClasses[size]} hover:bg-red-50 hover:border-red-200 transition-colors ${className}`}
      onClick={handleClick}
      disabled={loading}
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      {loading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin text-gray-500`} />
      ) : (
        <Heart
          className={`${iconSizes[size]} transition-colors ${
            isFav
              ? 'fill-red-500 text-red-500'
              : 'text-gray-400 hover:text-red-400'
          }`}
        />
      )}
    </Button>
  );
};

export default FavoriteButtonNew;
