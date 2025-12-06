import type { OrderStatus } from '@busi/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: '⏳',
    label: 'Pending',
  },
  confirmed: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: '✓',
    label: 'Confirmed',
  },
  shipped: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    icon: '🚚',
    label: 'Shipped',
  },
  delivered: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: '✓✓',
    label: 'Delivered',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: '✗',
    label: 'Cancelled',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export default function OrderStatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-semibold
        ${config.bg} ${config.text} ${sizeClasses[size]}
      `}
    >
      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
}
