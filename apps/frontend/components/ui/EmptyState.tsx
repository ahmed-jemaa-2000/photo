'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  Tags,
  Image,
  FileText,
  Plus,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

type EmptyStateType = 'products' | 'orders' | 'categories' | 'gallery' | 'general';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

const typeConfig: Record<EmptyStateType, {
  icon: ReactNode;
  gradient: string;
  bgGradient: string;
  defaultTitle: string;
  defaultDesc: string;
  defaultAction: string;
  defaultHref: string;
}> = {
  products: {
    icon: <Package className="w-10 h-10" />,
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50',
    defaultTitle: 'No products yet',
    defaultDesc: 'Start by adding your first product to showcase in your store',
    defaultAction: 'Add Product',
    defaultHref: '/dashboard/products/new',
  },
  orders: {
    icon: <ShoppingBag className="w-10 h-10" />,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    defaultTitle: 'No orders yet',
    defaultDesc: 'When customers place orders, they will appear here',
    defaultAction: 'View Store',
    defaultHref: '/',
  },
  categories: {
    icon: <Tags className="w-10 h-10" />,
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'from-amber-50 to-orange-50',
    defaultTitle: 'No categories yet',
    defaultDesc: 'Create categories to organize your products',
    defaultAction: 'Add Category',
    defaultHref: '/dashboard/categories',
  },
  gallery: {
    icon: <Image className="w-10 h-10" />,
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    defaultTitle: 'No AI images yet',
    defaultDesc: 'Generate stunning product photos with AI',
    defaultAction: 'Open AI Studio',
    defaultHref: 'https://studio.brandili.shop',
  },
  general: {
    icon: <FileText className="w-10 h-10" />,
    gradient: 'from-gray-500 to-slate-600',
    bgGradient: 'from-gray-50 to-slate-50',
    defaultTitle: 'Nothing here yet',
    defaultDesc: 'This section is empty',
    defaultAction: 'Get Started',
    defaultHref: '/dashboard',
  },
};

export default function EmptyState({
  type = 'general',
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  const config = typeConfig[type];

  const finalTitle = title || config.defaultTitle;
  const finalDescription = description || config.defaultDesc;
  const finalIcon = icon || config.icon;
  const finalAction = action?.label || config.defaultAction;
  const finalHref = action?.href || config.defaultHref;
  const hasOnClick = !!action?.onClick;

  const ActionButton = () => (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${config.gradient} text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer text-sm`}
    >
      <Plus className="w-4 h-4" />
      {finalAction}
      <ArrowRight className="w-4 h-4" />
    </motion.span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-gradient-to-br ${config.bgGradient} border border-gray-100`}
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg mb-5`}
      >
        {finalIcon}
      </motion.div>

      {/* Content */}
      <h3 className="text-lg font-bold text-gray-900 mb-1.5 text-center">{finalTitle}</h3>
      <p className="text-gray-500 text-center text-sm max-w-xs mb-5">{finalDescription}</p>

      {/* Action Button */}
      {hasOnClick ? (
        <button onClick={action?.onClick}>
          <ActionButton />
        </button>
      ) : (
        <Link href={finalHref}>
          <ActionButton />
        </Link>
      )}
    </motion.div>
  );
}

