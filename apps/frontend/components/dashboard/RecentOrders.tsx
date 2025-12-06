'use client';

import { Order } from '@busi/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Truck, Package, XCircle, ArrowRight } from 'lucide-react';

interface RecentOrdersProps {
    orders: Order[];
}

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: Package },
    completed: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                    When customers place orders via WhatsApp, they will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div>
                    <h2 className="font-bold text-gray-900 text-lg">Recent Orders</h2>
                    <p className="text-sm text-gray-500">Latest 5 orders</p>
                </div>
                <Link
                    href="/dashboard/orders"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-white bg-primary/10 hover:bg-primary rounded-lg transition-all duration-200"
                >
                    View all
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Orders List */}
            <div className="divide-y divide-gray-50">
                {orders.slice(0, 5).map((order, index) => {
                    const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                    const StatusIcon = statusConfig.icon;
                    const total = order.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;

                    return (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="p-4 hover:bg-gray-50/50 transition-colors group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Order Avatar */}
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-purple-100 flex items-center justify-center text-primary font-bold text-sm border border-primary/10">
                                        #{order.id}
                                    </div>

                                    {/* Customer Info */}
                                    <div>
                                        <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                            {order.customerName || 'Guest Customer'}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side */}
                                <div className="text-right flex items-center gap-4">
                                    {/* Status Badge */}
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.color}`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {statusConfig.label}
                                    </span>

                                    {/* Total */}
                                    <div className="min-w-[80px]">
                                        <p className="font-bold text-gray-900">
                                            {total.toFixed(0)} <span className="text-xs font-normal text-gray-500">TND</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            {orders.length > 5 && (
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                        +{orders.length - 5} more orders
                    </p>
                </div>
            )}
        </div>
    );
}
