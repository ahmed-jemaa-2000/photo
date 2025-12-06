'use client';

import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Package, Clock, TrendingUp, TrendingDown } from 'lucide-react';

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

const iconMap: Record<string, React.ElementType> = {
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
    },
    green: {
      bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
      light: 'bg-green-50',
      text: 'text-green-600',
      glow: 'shadow-green-500/20',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      light: 'bg-purple-50',
      text: 'text-purple-600',
      glow: 'shadow-purple-500/20',
    },
    orange: {
      bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      light: 'bg-orange-50',
      text: 'text-orange-600',
      glow: 'shadow-orange-500/20',
    },
    default: {
      bg: 'bg-gradient-to-br from-gray-500 to-gray-600',
      light: 'bg-gray-50',
      text: 'text-gray-600',
      glow: 'shadow-gray-500/20',
    },
  };

  const styles = colorStyles[color];
  const IconComponent = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg ${styles.glow} transition-all duration-300`}
    >
      {/* Background decoration */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${styles.light} rounded-full opacity-50`} />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${styles.bg} text-white shadow-lg ${styles.glow}`}>
            {IconComponent ? (
              <IconComponent className="w-6 h-6" />
            ) : (
              <span className="text-xl">{icon}</span>
            )}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${trend.isPositive
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
              }`}>
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
