'use client';

import { Order } from '@busi/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Truck, Package, XCircle, ArrowRight, Eye, Printer, MoreHorizontal } from 'lucide-react';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface RecentOrdersProps {
    orders: Order[];
}

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock, border: 'border-amber-200' },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2, border: 'border-blue-200' },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck, border: 'border-purple-200' },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: Package, border: 'border-green-200' },
    completed: { label: 'Paid', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, border: 'border-emerald-200' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle, border: 'border-red-200' },
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200/50">
                    <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                    When customers place orders via WhatsApp, they will appear here.
                </p>
                <Link
                    href="/"
                    className="mt-6 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    Visit Store
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/40 h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <div>
                    <h2 className="font-bold text-gray-900 text-lg">Recent Orders</h2>
                    <p className="text-sm text-gray-500 font-medium">Latest 5 transactions</p>
                </div>
                <Link
                    href="/dashboard/orders"
                    className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all duration-200"
                >
                    View all
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {/* Orders List */}
            <div className="divide-y divide-gray-50 overflow-y-auto custom-scrollbar flex-1">
                {orders.slice(0, 5).map((order, index) => {
                    const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                    const StatusIcon = statusConfig.icon;
                    const total = order.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;

                    // Get first product detail for thumbnail
                    const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                    let productImageUrl = null;

                    if (firstItem && firstItem.product) {
                        try {
                            const prod = firstItem.product as any;
                            // Handle Strapi's nested structure variations or standard
                            const images = prod.images || prod.data?.attributes?.images;
                            if (images && images.length > 0) {
                                productImageUrl = getStrapiMediaUrl(images[0].url);
                            } else if (images && images.data && images.data.length > 0) {
                                // Strapi v4 populated
                                productImageUrl = getStrapiMediaUrl(images.data[0].attributes.url);
                            }
                        } catch (e) {
                            console.error('Error parsing product image', e);
                        }
                    }

                    return (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="p-4 hover:bg-gray-50/80 transition-all duration-200 group relative"
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    {/* Product Thumbnail or Avatar */}
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-gray-50 flex-shrink-0 group-hover:shadow-md transition-shadow">
                                        {productImageUrl ? (
                                            <Image
                                                src={productImageUrl}
                                                alt="Product"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-500 font-bold text-xs">
                                                #{order.id}
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Info */}
                                    <div>
                                        <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {order.customerName || 'Guest Customer'}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs font-medium text-gray-500 mt-1">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">#{order.id}</span>
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Status & Actions */}
                                <div className="flex items-center gap-6">
                                    {/* Status Badge */}
                                    <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.color} ${statusConfig.border}`}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {statusConfig.label}
                                    </span>

                                    {/* Total Price */}
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 group-hover:scale-105 transition-transform">
                                            {total.toFixed(0)} <span className="text-xs font-medium text-gray-500">TND</span>
                                        </p>
                                    </div>

                                    {/* Hover Actions (Desktop) */}
                                    <div className="hidden lg:flex opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 items-center gap-1">
                                        <button className="p-2 hover:bg-white hover:shadow-md rounded-xl text-gray-500 hover:text-indigo-600 transition-all" title="View Details">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white hover:shadow-md rounded-xl text-gray-500 hover:text-gray-900 transition-all" title="Print Invoice">
                                            <Printer className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Click Target */}
                            <Link href={`/dashboard/orders/${order.id}`} className="absolute inset-0 z-0 lg:hidden" />
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            {orders.length > 5 && (
                <div className="p-3 bg-gray-50/50 border-t border-gray-100 text-center">
                    <Link href="/dashboard/orders" className="text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
                        +{orders.length - 5} older orders
                    </Link>
                </div>
            )}
        </div>
    );
}
