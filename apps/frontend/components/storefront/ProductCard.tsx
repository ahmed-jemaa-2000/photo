'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product, Shop } from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface ProductCardProps {
  product: Product;
  shop: Shop;
}

export default function ProductCard({ product, shop }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const mainImage = product.images && product.images[0];

  const discountPercentage = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/product/${product.slug}`} className="block">
      <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 tap-feedback">
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          {mainImage ? (
            <>
              <Image
                src={getStrapiMediaUrl(mainImage.url)}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Subtle gradient overlay on hover - hidden on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges - Top Left */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5">
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-500 text-white shadow-sm">
                -{discountPercentage}%
              </span>
            )}
            {/* Featured Badge */}
            {product.isFeatured && (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-amber-400 text-amber-900 shadow-sm hidden sm:inline-flex">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Wishlist Button - Top Right with enhanced touch target */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-full transition-all duration-200 touch-target-44 flex items-center justify-center ${isWishlisted
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/90 text-gray-500 hover:text-red-500 shadow-sm'
              }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className="w-4 h-4"
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Low Stock Badge - Bottom */}
          {product.stock !== undefined && product.stock !== null && product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-orange-100 text-orange-700">
                Only {product.stock} left
              </span>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-gray-200 text-gray-600">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info - Compact on mobile */}
        <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
          {/* Product Name - 1 line on mobile, 2 on desktop */}
          <h3 className="font-semibold text-sm sm:text-base text-gray-800 leading-tight line-clamp-1 sm:line-clamp-2">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {product.price} TND
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {product.oldPrice} TND
              </span>
            )}
          </div>

          {/* Sizes - Hidden on mobile for compact look */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] px-1.5 py-0.5 text-gray-400">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Colors - Compact on mobile */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-gray-400">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
