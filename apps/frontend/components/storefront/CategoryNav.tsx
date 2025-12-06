'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Category } from '@busi/types';
import { motion } from 'framer-motion';

interface CategoryNavProps {
  categories: Category[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname();

  if (categories.length === 0) return null;

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  const allCategories = [
    { id: 0, name: 'All Products', slug: '', path: '/' },
    ...categories.map(cat => ({ ...cat, path: `/category/${cat.slug}` }))
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Shop by Category
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-100 to-transparent ml-4" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {allCategories.map((category, index) => {
            const active = isActive(category.path);
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={category.path}
                  className={`
                    relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
                    text-sm font-medium whitespace-nowrap transition-all duration-300
                    ${active
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-primary/50 hover:text-primary hover:shadow-md'
                    }
                  `}
                >
                  {/* Category Icon */}
                  {category.id === 0 ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  ) : (
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-primary'}`} />
                  )}

                  <span>{category.name}</span>

                  {/* Active Indicator Glow */}
                  {active && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-purple-600 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
