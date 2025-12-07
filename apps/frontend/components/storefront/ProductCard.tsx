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
    <Link href={`/product/${product.slug}`} className="block h-full">
      <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          {mainImage ? (
            <>
              <Image
                src={getStrapiMediaUrl(mainImage.url)}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Quick View Button - Desktop */}
              <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:flex">
                <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-2 rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-transform">
                  Quick View
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Badges - Floating Style */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {discountPercentage > 0 && (
              <span className="self-start px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-white text-red-600 shadow-md border border-red-50">
                -{discountPercentage}%
              </span>
            )}
            {product.isFeatured && (
              <span className="self-start px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-amber-400 text-amber-950 shadow-md">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 z-10 ${isWishlisted
              ? 'bg-red-500 text-white shadow-lg scale-110'
              : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500 shadow-md hover:scale-105'
              }`}
            aria-label="Wishlist"
          >
            <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Price Tag */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                {product.price} <span className="text-sm font-semibold text-gray-500">TND</span>
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xs text-gray-400 line-through decoration-gray-300">
                  {product.oldPrice}
                </span>
              )}
            </div>
          </div>

          {/* Stock & Colors Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
            {/* Colors */}
            <div className="flex items-center -space-x-1.5">
              {product.colors?.slice(0, 3).map((color, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors && product.colors.length > 3 && (
                <div className="w-5 h-5 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[8px] font-bold text-gray-500 shadow-sm">
                  +{product.colors.length - 3}
                </div>
              )}
            </div>

            {/* Low Stock text */}
            {product.stock && product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                Only {product.stock} left
              </span>
            )}
            {/* Show 'In Stock' if ample stock, to balance the footer */}
            {(!product.stock || product.stock > 5) && (
              <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                In Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
