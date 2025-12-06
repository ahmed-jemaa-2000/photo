'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Product, Category } from '@busi/types';
import { getStrapiMediaUrl } from '@/lib/strapi';
import ProductStatsCards from './ProductStatsCards';
import ProductSearch from './ProductSearch';
import ProductFilters from './ProductFilters';
import ProductListActions from '@/components/dashboard/ProductListActions';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface ProductListClientProps {
  products: Product[];
  categories: Category[];
  categoryMap: Record<number, string>;
}

export default function ProductListClient({
  products,
  categories,
  categoryMap
}: ProductListClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStock, setSelectedStock] = useState('');

  // Calculate stats
  const totalActive = products.filter((p) => p.isActive).length;
  const totalFeatured = products.filter((p) => p.isFeatured).length;
  const lowStockCount = products.filter((p) =>
    p.stock !== undefined && p.stock !== null && p.stock <= 5 && p.stock > 0
  ).length;

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const categoryName = typeof product.category === 'object'
          ? product.category.name?.toLowerCase()
          : categoryMap[product.category as number]?.toLowerCase() || '';

        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          categoryName.includes(query) ||
          product.slug?.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory) {
        const productCategoryId = typeof product.category === 'object'
          ? product.category.id
          : product.category;

        if (productCategoryId?.toString() !== selectedCategory) return false;
      }

      // Status filter
      if (selectedStatus) {
        if (selectedStatus === 'active' && !product.isActive) return false;
        if (selectedStatus === 'inactive' && product.isActive) return false;
        if (selectedStatus === 'featured' && !product.isFeatured) return false;
      }

      // Stock filter
      if (selectedStock) {
        const stock = product.stock ?? 0;
        if (selectedStock === 'in-stock' && stock <= 0) return false;
        if (selectedStock === 'low-stock' && (stock > 5 || stock <= 0)) return false;
        if (selectedStock === 'out-of-stock' && stock > 0) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus, selectedStock, categoryMap]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedStock('');
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <ProductStatsCards
        totalProducts={products.length}
        activeProducts={totalActive}
        featuredProducts={totalFeatured}
        lowStockCount={lowStockCount}
      />

      {/* Search and Filters */}
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <ProductSearch onSearch={setSearchQuery} />
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          selectedStock={selectedStock}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          onStockChange={setSelectedStock}
          onClearFilters={handleClearFilters}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{products.length}</span> products
          </p>

          {filteredProducts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Products List */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-800">
              {searchQuery || selectedCategory || selectedStatus || selectedStock
                ? 'No products found'
                : 'No products yet'}
            </p>
            <p className="text-sm text-gray-500">
              {searchQuery || selectedCategory || selectedStatus || selectedStock
                ? 'Try adjusting your filters or search query'
                : 'Add your first product to start selling'}
            </p>
            {!(searchQuery || selectedCategory || selectedStatus || selectedStock) && (
              <Link
                href="/dashboard/products/create"
                className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Create your first product
              </Link>
            )}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="divide-y divide-gray-100"
          >
            {filteredProducts.map((product) => {
              const categoryId = typeof product.category === 'object' ? product.category.id : product.category;
              const categoryName = categoryId ? categoryMap[categoryId] : 'Uncategorized';
              const mainImage = product.images?.[0];
              const stockStatus = product.stock !== undefined && product.stock !== null
                ? product.stock > 5 ? 'healthy' : product.stock > 0 ? 'low' : 'out'
                : null;

              return (
                <motion.div
                  key={product.id}
                  variants={staggerItem}
                  className="grid grid-cols-1 gap-4 p-4 transition hover:bg-gray-50 md:grid-cols-[auto,1fr,auto]"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                      {mainImage ? (
                        <Image
                          src={getStrapiMediaUrl(mainImage.url)}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        {product.isFeatured && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                            ⭐ Featured
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        {categoryName}
                      </p>

                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-bold text-gray-900">{product.price} TND</span>
                        {product.oldPrice && (
                          <>
                            <span className="text-xs text-gray-500 line-through">
                              {product.oldPrice} TND
                            </span>
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.isActive ? '✓ Active' : 'Inactive'}
                    </span>

                    {stockStatus && (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          stockStatus === 'healthy'
                            ? 'bg-blue-100 text-blue-700'
                            : stockStatus === 'low'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {stockStatus === 'healthy' && '📦 '}
                        {stockStatus === 'low' && '⚠️ '}
                        {stockStatus === 'out' && '❌ '}
                        Stock: {product.stock}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end">
                    <ProductListActions productId={product.id} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
