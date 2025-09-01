'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

import { Product } from '@/lib/api';
import { getProductImage, buildImageUrl } from '@/lib/utils';
import { useLanguage } from '@/lib/language';

interface ImageGalleryProps {
  product: Product;
}

const DEFAULT_SPROUT_IMAGE = '/images/placeholder-sprout.svg';

export default function ImageGallery({ product }: ImageGalleryProps) {
  const { language, t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get all product images
  const allImages = React.useMemo(() => {
    const images: Array<{ url: string; alt: string }> = [];
    
    if (product.images && product.images.length > 0) {
      // Sort by order and add all images
      const sortedImages = [...product.images].sort((a, b) => a.order - b.order);
      
      sortedImages.forEach(img => {
        if (img.image) {
          const altText = img[`alt_text_${language}` as keyof typeof img] as string || 
                          img.alt_text_uz || 
                          `${product.name_uz} image`;
          
          images.push({
            url: buildImageUrl(img.image),
            alt: altText
          });
        }
      });
    }
    
    // Fallback to primary image if no images array
    if (images.length === 0) {
      const primaryImage = getProductImage(product);
      if (primaryImage) {
        images.push({
          url: buildImageUrl(primaryImage),
          alt: product.name_uz || 'Product image'
        });
      }
    }
    
    // If still no images, use placeholder
    if (images.length === 0) {
      images.push({
        url: DEFAULT_SPROUT_IMAGE,
        alt: t('product.no_image') || 'No image available'
      });
    }
    
    return images;
  }, [product, language, t]);

  const currentImage = allImages[selectedImageIndex] || allImages[0];

  const handleImageSelect = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setImageError(false);
  }, []);

  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex(prev => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  }, [allImages.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex(prev => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  }, [allImages.length]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        handlePrevImage();
        break;
      case 'ArrowRight':
        handleNextImage();
        break;
      case 'Enter':
      case ' ':
        setIsZoomed(!isZoomed);
        break;
    }
  }, [handlePrevImage, handleNextImage, isZoomed]);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square bg-gradient-to-br from-green-50 to-white rounded-2xl overflow-hidden shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImageIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            {imageError || currentImage.url === DEFAULT_SPROUT_IMAGE ? (
              // Placeholder with sprout
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-green-100 to-green-50">
                <div className="text-center">
                  <div className="text-6xl mb-4 opacity-60">🌱</div>
                  <p className="text-green-600 text-sm font-medium">
                    {t('product.no_image') || 'No image available'}
                  </p>
                </div>
              </div>
            ) : (
              <Image
                src={currentImage.url}
                alt={currentImage.alt}
                fill
                className={`object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-110' : 'scale-100'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={selectedImageIndex === 0}
                onError={handleImageError}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {allImages.length > 1 && !imageError && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              aria-label={t('gallery.previous') || 'Previous image'}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              aria-label={t('gallery.next') || 'Next image'}
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Zoom Button */}
        {!imageError && currentImage.url !== DEFAULT_SPROUT_IMAGE && (
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            aria-label={isZoomed ? (t('gallery.zoom_out') || 'Zoom out') : (t('gallery.zoom_in') || 'Zoom in')}
          >
            <ZoomIn className={`w-5 h-5 text-gray-700 transition-transform ${isZoomed ? 'scale-110' : ''}`} />
          </button>
        )}

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
            {selectedImageIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => handleImageSelect(index)}
              onKeyDown={handleKeyDown}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedImageIndex === index
                  ? 'border-green-500 shadow-lg'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              aria-label={`${t('gallery.select_image') || 'Select image'} ${index + 1}`}
            >
              {image.url === DEFAULT_SPROUT_IMAGE ? (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-green-100 to-green-50">
                  <span className="text-2xl opacity-60">🌱</span>
                </div>
              ) : (
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
