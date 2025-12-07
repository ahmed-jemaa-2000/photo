'use client';

import type { Shop, Product } from '@busi/types';
import ProductCard from './ProductCard';
import EmptyState from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';

interface ProductGridProps {
  products: Product[];
  shop: Shop;
}

export default function ProductGrid({ products, shop }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products available"
        description="Check back soon for new arrivals and exciting products."
        icon={
          <svg className="w-16 h-16 sm:w-24 sm:h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        }
      />
    );
  }

  return (
    <div id="products" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{
            duration: 0.3,
            delay: Math.min(index * 0.03, 0.15) // Faster stagger for quicker perceived load
          }}
          className="group"
        >
          <ProductCard product={product} shop={shop} />
        </motion.div>
      ))}
    </div>
  );
}

