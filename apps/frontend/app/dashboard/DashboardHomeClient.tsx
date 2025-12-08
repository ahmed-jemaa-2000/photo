'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from '@/components/dashboard/StatsCard';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import RecentOrders from '@/components/dashboard/RecentOrders';
import StorefrontCard from '@/components/dashboard/StorefrontCard';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DailyFocus from '@/components/dashboard/DailyFocus';
import { Shop, Product, Order, Category } from '@busi/types';
import { ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';

interface DashboardHomeClientProps {
    shop: Shop;
    orders: Order[];
    products: Product[];
    categories: Category[];
    totalRevenue: number;
    todayOrdersCount: number;
    activeProductsCount: number;
    pendingOrdersCount: number;
}

export default function DashboardHomeClient({
    shop,
    orders,
    products,
    categories,
    totalRevenue,
    todayOrdersCount,
    activeProductsCount,
    pendingOrdersCount,
}: DashboardHomeClientProps) {

    // Collapsible state with localStorage persistence
    const [analyticsExpanded, setAnalyticsExpanded] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('dashboard_analytics_expanded');
        if (saved !== null) {
            setAnalyticsExpanded(saved === 'true');
        }
    }, []);

    const toggleAnalytics = () => {
        const newState = !analyticsExpanded;
        setAnalyticsExpanded(newState);
        localStorage.setItem('dashboard_analytics_expanded', String(newState));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-6"
        >
            {/* Daily Focus Banner (replaces standard header) */}
            <motion.div variants={itemVariants}>
                <DailyFocus orders={orders} shopName={shop.name} />
            </motion.div>

            {/* Stats Grid - Compact row */}
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
            >
                <StatsCard
                    title="Total Revenue"
                    value={`${totalRevenue.toFixed(0)} TND`}
                    icon="💰"
                    color="green"
                    subtitle="From confirmed orders"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Total Orders"
                    value={orders.length}
                    icon="🛍️"
                    color="blue"
                    subtitle={`${todayOrdersCount} today`}
                    trend={{ value: 8, isPositive: true }}
                />
                <StatsCard
                    title="Active Products"
                    value={activeProductsCount}
                    icon="📦"
                    color="purple"
                    subtitle={`of ${products.length} total`}
                />
                <StatsCard
                    title="Pending Orders"
                    value={pendingOrdersCount}
                    icon="⏳"
                    color="orange"
                    subtitle="Awaiting confirmation"
                />
            </motion.div>

            {/* Collapsible Analytics Section */}
            {orders.length > 0 && (
                <motion.div variants={itemVariants}>
                    {/* Section Header with Toggle */}
                    <button
                        onClick={toggleAnalytics}
                        className="w-full flex items-center justify-between px-4 py-3 mb-3 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg font-bold text-gray-900">Analytics Overview</h2>
                                <p className="text-sm text-gray-500">Sales, orders & top products</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                {analyticsExpanded ? 'Collapse' : 'Expand'}
                            </span>
                            {analyticsExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            )}
                        </div>
                    </button>

                    {/* Collapsible Content */}
                    <AnimatePresence>
                        {analyticsExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <DashboardCharts orders={orders} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column - Recent Orders */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0 }
                    }}
                    className="lg:col-span-2 space-y-6"
                >
                    <RecentOrders orders={orders} />

                    {/* Quick Actions */}
                    <div>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <QuickActionCard
                                href="/dashboard/products/create"
                                title="Add Product"
                                description="Create a new product listing"
                                icon="➕"
                                color="blue"
                            />
                            <QuickActionCard
                                href="/dashboard/categories"
                                title="Categories"
                                description="Organize your products"
                                icon="🏷️"
                                color="purple"
                            />
                            <QuickActionCard
                                href="/dashboard/settings"
                                title="Settings"
                                description="Store preferences"
                                icon="⚙️"
                                color="default"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Sidebar */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, x: 20 },
                        show: { opacity: 1, x: 0 }
                    }}
                    className="space-y-6"
                >
                    <StorefrontCard shop={shop} />

                    {/* Shop Progress */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Shop Status</h3>
                        <div className="space-y-5">
                            {/* Products Progress */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Products</span>
                                    <span className="text-sm font-semibold text-gray-900">{activeProductsCount}/{products.length}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${products.length > 0 ? (activeProductsCount / products.length) * 100 : 0}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {products.length - activeProductsCount} draft{products.length - activeProductsCount !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Categories */}
                            <div className="flex items-center justify-between py-3 border-t border-gray-50">
                                <span className="text-sm text-gray-600">Categories</span>
                                <span className="text-sm font-semibold text-gray-900">{categories.length}</span>
                            </div>

                            {/* Order Completion Rate */}
                            <div className="flex items-center justify-between py-3 border-t border-gray-50">
                                <span className="text-sm text-gray-600">Order Success Rate</span>
                                <span className="text-sm font-semibold text-green-600">
                                    {orders.length > 0
                                        ? `${Math.round((orders.filter(o => ['delivered', 'completed'].includes(o.status)).length / orders.length) * 100)}%`
                                        : 'N/A'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
