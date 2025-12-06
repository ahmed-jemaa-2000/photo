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
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        }
      />
    );
  }

  return (
    <div id="products" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8 }}
          className="group"
        >
          <ProductCard product={product} shop={shop} />
        </motion.div>
      ))}
    </div>
  );
}
