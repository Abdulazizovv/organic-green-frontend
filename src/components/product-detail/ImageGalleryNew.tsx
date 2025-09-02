'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import Image from 'next/image';

import { Product } from '@/api/products';
import { useLanguage, getLocalizedName } from '@/lib/language';

interface ImageGalleryProps {
  product: Product;
}

export default function ImageGallery({ product }: ImageGalleryProps) {
  const { language } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Get all product images, fallback to primary image if no images
  const images = product.images && product.images.length > 0 
    ? product.images.sort((a, b) => a.order - b.order)
    : product.primary_image 
      ? [product.primary_image]
      : [];

  // Fallback to placeholder if no images
  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[selectedImageIndex] : null;
  
  // Get localized alt text
  const getAltText = (image: any) => {
    if (!image) return getLocalizedName(product, language);
    
    switch (language) {
      case 'ru':
        return image.alt_text_ru || image.alt_text_uz || getLocalizedName(product, language);
      case 'en':
        return image.alt_text_en || image.alt_text_uz || getLocalizedName(product, language);
      default:
        return image.alt_text_uz || getLocalizedName(product, language);
    }
  };

  const nextImage = () => {
    if (images.length > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Fallback Image Component
  const FallbackImage = () => (
    <div className="aspect-square bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center border-2 border-green-100">
      <div className="text-center">
        <div className="text-6xl mb-4">🌱</div>
        <p className="text-green-600 font-medium">
          {getLocalizedName(product, language)}
        </p>
        <p className="text-sm text-green-500 mt-2">Organic Green</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <motion.div
          className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border border-green-100"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {hasImages && currentImage ? (
            <div className="relative w-full h-full">
              <Image
                src={currentImage.image_url || currentImage.image}
                alt={getAltText(currentImage)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
              
              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomModalOpen(true)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
              >
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </button>
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <FallbackImage />
          )}
        </motion.div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index 
                  ? 'border-green-500 shadow-md' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={image.image_url || image.image}
                alt={getAltText(image)}
                fill
                className="object-cover"
                sizes="80px"
              />
              {selectedImageIndex === index && (
                <div className="absolute inset-0 bg-green-500/10" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomModalOpen && hasImages && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage.image_url || currentImage.image}
                alt={getAltText(currentImage)}
                fill
                className="object-contain"
                sizes="100vw"
              />
              
              {/* Close Button */}
              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>

              {/* Navigation in Modal */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
