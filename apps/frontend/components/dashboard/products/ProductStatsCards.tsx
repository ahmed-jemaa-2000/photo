'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface ProductStatsCardsProps {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  lowStockCount?: number;
}

export default function ProductStatsCards({
  totalProducts,
  activeProducts,
  featuredProducts,
  lowStockCount = 0
}: ProductStatsCardsProps) {
  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'gray',
      bgColor: 'from-gray-50 to-white',
      borderColor: 'border-gray-100',
      textColor: 'text-gray-900',
      badgeColor: 'bg-gray-100 text-gray-700',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      badge: 'All items'
    },
    {
      label: 'Active',
      value: activeProducts,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'emerald',
      bgColor: 'from-emerald-50 to-white',
      borderColor: 'border-emerald-100',
      textColor: 'text-emerald-700',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      badge: 'Visible',
      percentage: totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0
    },
    {
      label: 'Featured',
      value: featuredProducts,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'amber',
      bgColor: 'from-amber-50 to-white',
      borderColor: 'border-amber-100',
      textColor: 'text-amber-700',
      badgeColor: 'bg-amber-100 text-amber-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      badge: 'Highlighted'
    },
    {
      label: 'Low Stock',
      value: lowStockCount,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'red',
      bgColor: 'from-red-50 to-white',
      borderColor: 'border-red-100',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-100 text-red-700',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      badge: '≤ 5 units'
    }
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={staggerItem}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`
            relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 shadow-sm transition-shadow hover:shadow-md
            ${stat.borderColor} ${stat.bgColor}
          `}
        >
          {/* Icon */}
          <div className="mb-3 flex items-center justify-between">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}>
              <div className={stat.iconColor}>
                {stat.icon}
              </div>
            </div>
            {stat.percentage !== undefined && (
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {stat.percentage}%
              </div>
            )}
          </div>

          {/* Label */}
          <p className="text-sm font-medium text-gray-600">{stat.label}</p>

          {/* Value and Badge */}
          <div className="mt-2 flex items-end justify-between">
            <p className={`text-3xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stat.badgeColor}`}>
              {stat.badge}
            </span>
          </div>

          {/* Decorative gradient overlay */}
          <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/30 blur-2xl" />
        </motion.div>
      ))}
    </motion.div>
  );
}
