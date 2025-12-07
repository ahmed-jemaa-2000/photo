'use client';

import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Package, Clock, TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/AnimatedCounter';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'default';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const iconMap: Record<string, LucideIcon> = {
  '💰': DollarSign,
  '🛍️': ShoppingBag,
  '📦': Package,
  '⏳': Clock,
};

export default function StatsCard({
  title,
  value,
  icon,
  color = 'default',
  trend,
  subtitle,
}: StatsCardProps) {
  const colorStyles = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      light: 'bg-blue-50',
      text: 'text-blue-600',
      glow: 'shadow-blue-500/20',
      border: 'border-blue-100',
    },
    green: {
      bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
      light: 'bg-green-50',
      text: 'text-green-600',
      glow: 'shadow-green-500/20',
      border: 'border-green-100',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      light: 'bg-purple-50',
      text: 'text-purple-600',
      glow: 'shadow-purple-500/20',
      border: 'border-purple-100',
    },
    orange: {
      bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      light: 'bg-orange-50',
      text: 'text-orange-600',
      glow: 'shadow-orange-500/20',
      border: 'border-orange-100',
    },
    default: {
      bg: 'bg-gradient-to-br from-gray-500 to-gray-600',
      light: 'bg-gray-50',
      text: 'text-gray-600',
      glow: 'shadow-gray-500/20',
      border: 'border-gray-100',
    },
  };

  const styles = colorStyles[color];
  const IconComponent = iconMap[icon];

  // Extract numeric value for animation
  const getNumericValue = (val: string | number): number => {
    if (typeof val === 'number') return val;
    // Extract number from strings like "1234 TND" or "$1,234"
    const match = val.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''), 10);
    }
    return 0;
  };

  const getSuffix = (val: string | number): string => {
    if (typeof val === 'number') return '';
    // Extract suffix from strings like "1234 TND"
    const match = val.match(/[\d,]+\s*(.*)$/);
    return match ? ` ${match[1]}` : '';
  };

  const numericValue = getNumericValue(value);
  const suffix = getSuffix(value);
  const canAnimate = numericValue > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden bg-white/80 backdrop-blur-md rounded-3xl border ${styles.border} p-6 shadow-xl ${styles.glow} transition-all duration-300`}
    >
      {/* Background decoration */}
      <div className={`absolute -top-12 -right-12 w-40 h-40 ${styles.light} rounded-full opacity-50 blur-2xl`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-3.5 rounded-2xl ${styles.bg} text-white shadow-lg shadow-black/5 ring-4 ring-white/50`}>
            {IconComponent ? (
              <IconComponent className="w-6 h-6" />
            ) : (
              <span className="text-xl">{icon}</span>
            )}
          </div>
          {trend && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${trend.isPositive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
              }`}>
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500 mb-1 tracking-wide">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {canAnimate ? (
                <AnimatedNumber value={numericValue} duration={2} />
              ) : (
                value
              )}
            </h3>
            <span className="text-lg font-medium text-gray-500">{suffix}</span>
          </div>

          {subtitle && (
            <p className="text-xs font-medium text-gray-400 mt-2 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

