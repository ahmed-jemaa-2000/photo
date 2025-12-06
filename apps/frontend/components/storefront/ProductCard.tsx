'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product, Shop } from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
  shop: Shop;
}

export default function ProductCard({ product, shop }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { cardStyle } = shop;
  const mainImage = product.images && product.images[0];

  const cardClasses = `group bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl card-lift-premium ${cardStyle === 'rounded' ? 'rounded-2xl' :
    cardStyle === 'square' ? 'rounded-none' :
      'rounded-xl'
    } shadow-lg`;

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
      <div className={cardClasses}>
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 kenburns-hover">
          {mainImage ? (
            <>
              <Image
                src={getStrapiMediaUrl(mainImage.url)}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Shine Effect */}
              <div className="absolute inset-0 shine-effect" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges Container */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <span className="badge-gradient px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse-glow">
                -{discountPercentage}%
              </span>
            )}

            <div className="ml-auto flex items-center gap-2">
              {/* Wishlist Heart Button */}
              <button
                onClick={handleWishlistClick}
                className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 heart-pop ${isWishlisted
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
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

              {/* Featured Badge */}
              {product.isFeatured && (
                <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Stock Indicator */}
          {product.stock !== undefined && product.stock !== null && product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-3 left-3 z-10">
              <Badge variant="warning" size="sm">
                🔥 Only {product.stock} left
              </Badge>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute bottom-3 left-3 z-10">
              <Badge variant="error" size="sm">
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Quick View Button - Premium Glass */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <div className="glass-premium rounded-xl px-5 py-3 text-center text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer shadow-lg cta-pulse">
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Quick View
              </span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 space-y-3">
          {/* Product Name */}
          <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 min-h-[3.5rem] tracking-tight">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gradient-premium">
              {product.price} TND
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-sm text-gray-400 line-through font-medium">
                {product.oldPrice} TND
              </span>
            )}
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.slice(0, 5).map((size) => (
                <span
                  key={size}
                  className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors duration-200 font-medium"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 5 && (
                <span className="text-xs px-2.5 py-1 text-gray-400 font-medium">
                  +{product.sizes.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Colors Preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-gray-400 mr-1">Colors:</span>
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-5 h-5 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200 transform hover:scale-125 transition-transform duration-200"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-400 font-medium">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

