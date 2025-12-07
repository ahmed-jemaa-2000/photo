'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { Media } from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageGalleryProps {
  images: Media[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle touch swipe for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swipe left - next image
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        // Swipe right - previous image
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square sm:aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-400 text-sm">No images available</span>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
      {/* Main Image Container */}
      <div
        className="relative flex-1 aspect-square sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsZoomed(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
          >
            <Image
              src={getStrapiMediaUrl(selectedImage.url)}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              fill
              className="object-cover"
              priority={selectedIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Mobile Swipe Hint - Shows briefly on first load */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-0 p-4 lg:hidden pointer-events-none">
            <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
              Swipe for more
            </div>
          </div>
        )}

        {/* Dot Indicators - Mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 lg:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === selectedIndex
                    ? 'bg-white w-4'
                    : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        )}

        {/* Image Counter - Desktop */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 hidden lg:block">
            <div className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        )}

        {/* Navigation Arrows - Desktop only */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-md hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-md hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Zoom Hint - Desktop */}
        <div className="absolute bottom-3 right-3 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Zoom
          </div>
        </div>
      </div>

      {/* Thumbnails - Horizontal scroll on mobile, vertical on desktop */}
      {images.length > 1 && (
        <div
          ref={scrollContainerRef}
          className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] pb-1 lg:pb-0 scrollbar-hide order-first lg:order-none"
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden transition-all duration-200 ${index === selectedIndex
                  ? 'ring-2 ring-primary ring-offset-1 shadow-md'
                  : 'ring-1 ring-gray-200 opacity-60 hover:opacity-100'
                }`}
            >
              <Image
                src={getStrapiMediaUrl(image.url)}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[85vh] w-full h-full"
            >
              <Image
                src={getStrapiMediaUrl(selectedImage.url)}
                alt={productName}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            {/* Close button */}
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              onClick={() => setIsZoomed(false)}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation in zoom mode */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
