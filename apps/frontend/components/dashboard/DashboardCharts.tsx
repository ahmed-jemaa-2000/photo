'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Order } from '@busi/types';

interface DashboardChartsProps {
    orders: Order[];
}

/**
 * Order Status Donut Chart
 * Visual breakdown of orders by status
 */
function OrderStatusChart({ orders }: { orders: Order[] }) {
    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const total = orders.length;

    const statusConfig = [
        { key: 'pending', label: 'Pending', color: '#F59E0B', bgClass: 'bg-amber-500' },
        { key: 'confirmed', label: 'Confirmed', color: '#3B82F6', bgClass: 'bg-blue-500' },
        { key: 'shipped', label: 'Shipped', color: '#8B5CF6', bgClass: 'bg-purple-500' },
        { key: 'delivered', label: 'Delivered', color: '#10B981', bgClass: 'bg-emerald-500' },
        { key: 'completed', label: 'Completed', color: '#059669', bgClass: 'bg-green-600' },
        { key: 'cancelled', label: 'Cancelled', color: '#EF4444', bgClass: 'bg-red-500' },
    ];

    // Calculate percentages for donut chart
    let cumulativePercent = 0;
    const segments = statusConfig
        .filter(s => statusCounts[s.key] > 0)
        .map(status => {
            const count = statusCounts[status.key] || 0;
            const percent = total > 0 ? (count / total) * 100 : 0;
            const startPercent = cumulativePercent;
            cumulativePercent += percent;
            return { ...status, count, percent, startPercent };
        });

    // SVG donut chart calculations
    const size = 160;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Orders by Status</h3>

            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Donut Chart */}
                <div className="relative">
                    <svg width={size} height={size} className="transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke="#F3F4F6"
                            strokeWidth={strokeWidth}
                        />

                        {/* Segments */}
                        {segments.map((segment, index) => {
                            const dashArray = (segment.percent / 100) * circumference;
                            const dashOffset = -((segment.startPercent / 100) * circumference);

                            return (
                                <motion.circle
                                    key={segment.key}
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                                    strokeDashoffset={dashOffset}
                                    initial={{ strokeDasharray: `0 ${circumference}` }}
                                    animate={{ strokeDasharray: `${dashArray} ${circumference - dashArray}` }}
                                    transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                                    strokeLinecap="round"
                                />
                            );
                        })}
                    </svg>

                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <motion.p
                                className="text-3xl font-bold text-gray-900"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                {total}
                            </motion.p>
                            <p className="text-xs text-gray-500">Total</p>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2">
                    {segments.map((segment, index) => (
                        <motion.div
                            key={segment.key}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${segment.bgClass}`} />
                                <span className="text-sm text-gray-600">{segment.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">{segment.count}</span>
                                <span className="text-xs text-gray-400">({segment.percent.toFixed(0)}%)</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Sales Over Time Chart
 * Simple bar chart showing sales for the last 7 days
 */
function SalesChart({ orders }: { orders: Order[] }) {
    // Use state to track if we're on the client (avoids hydration mismatch)
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Calculate days data only on client to avoid hydration issues with Date
    const { days, maxTotal } = useMemo(() => {
        if (!isClient) {
            return { days: [], maxTotal: 1 };
        }

        const daysArr: { date: Date; label: string; total: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            daysArr.push({
                date,
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                total: 0,
            });
        }

        // Calculate totals per day
        orders
            .filter(o => ['confirmed', 'shipped', 'delivered', 'completed'].includes(o.status))
            .forEach(order => {
                const orderDate = new Date(order.createdAt);
                orderDate.setHours(0, 0, 0, 0);

                const dayEntry = daysArr.find(d => d.date.getTime() === orderDate.getTime());
                if (dayEntry && order.items) {
                    dayEntry.total += order.items.reduce((sum, item) => sum + item.totalPrice, 0);
                }
            });

        return {
            days: daysArr,
            maxTotal: Math.max(...daysArr.map(d => d.total), 1)
        };
    }, [isClient, orders]);

    // Show loading skeleton during SSR/initial hydration
    if (!isClient) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="flex items-end justify-between gap-2 h-40">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full h-24 bg-gray-100 rounded-t-lg animate-pulse" />
                            <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Sales This Week</h3>
                <span className="text-sm text-gray-500">Last 7 days</span>
            </div>

            <div className="flex items-end justify-between gap-2 h-40">
                {days.map((day, index) => {
                    const height = maxTotal > 0 ? (day.total / maxTotal) * 100 : 0;
                    const isToday = index === days.length - 1;

                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <motion.div
                                className="w-full relative group"
                                style={{ height: '120px' }}
                            >
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                        {day.total.toFixed(0)} TND
                                    </div>
                                </div>

                                {/* Bar */}
                                <motion.div
                                    className={`absolute bottom-0 w-full rounded-t-lg ${isToday
                                        ? 'bg-gradient-to-t from-purple-600 to-indigo-500'
                                        : 'bg-gradient-to-t from-gray-300 to-gray-200'
                                        }`}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(height, 4)}%` }}
                                    transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                                />
                            </motion.div>

                            <span className={`text-xs ${isToday ? 'font-semibold text-purple-600' : 'text-gray-400'}`}>
                                {day.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Top Products Chart
 * Horizontal bar chart showing best-selling products
 */
function TopProductsChart({ orders }: { orders: Order[] }) {
    // Count product sales
    const productSales: Record<string, { name: string; count: number; revenue: number }> = {};

    orders
        .filter(o => !['cancelled'].includes(o.status))
        .forEach(order => {
            order.items?.forEach(item => {
                // Safely extract product name from various possible formats
                // Strapi can return: { product: { name: "..." } } or { product: { data: { attributes: { name: "..." } } } }
                // or just a product ID
                let productName = 'Unknown Product';

                if (item.product) {
                    if (typeof item.product === 'object') {
                        // Direct object with name property
                        if ((item.product as any).name) {
                            productName = (item.product as any).name;
                        }
                        // Strapi nested data format: { data: { attributes: { name: "..." } } }
                        else if ((item.product as any).data?.attributes?.name) {
                            productName = (item.product as any).data.attributes.name;
                        }
                        // Just has an id but no name
                        else if ((item.product as any).id) {
                            productName = `Product #${(item.product as any).id}`;
                        }
                    } else if (typeof item.product === 'number') {
                        productName = `Product #${item.product}`;
                    }
                }

                if (!productSales[productName]) {
                    productSales[productName] = { name: productName, count: 0, revenue: 0 };
                }
                productSales[productName].count += item.quantity;
                productSales[productName].revenue += item.totalPrice;
            });
        });

    const topProducts = Object.values(productSales)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const maxCount = Math.max(...topProducts.map(p => p.count), 1);

    if (topProducts.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Top Products</h3>
                <div className="text-center py-8 text-gray-400">
                    <p>No product data yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Top Products</h3>

            <div className="space-y-4">
                {topProducts.map((product, index) => {
                    const width = (product.count / maxCount) * 100;

                    return (
                        <motion.div
                            key={product.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-gray-700 truncate max-w-[60%]" title={product.name}>
                                    {product.name}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {product.count} sold
                                </span>
                            </div>

                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${width}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                                />
                            </div>

                            <p className="text-xs text-gray-400 mt-1">
                                {product.revenue.toFixed(0)} TND revenue
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Dashboard Charts Container
 * Displays all analytics charts in a responsive grid
 */
export default function DashboardCharts({ orders }: DashboardChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <SalesChart orders={orders} />
            <OrderStatusChart orders={orders} />
            <TopProductsChart orders={orders} />
        </div>
    );
}

// Export individual charts for flexible use
export { OrderStatusChart, SalesChart, TopProductsChart };
