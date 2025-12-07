'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Coffee, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Order } from '@busi/types';

interface DailyFocusProps {
    orders: Order[];
    userName?: string;
    shopName?: string;
}

export default function DailyFocus({ orders, userName = 'User', shopName }: DailyFocusProps) {
    const [mounted, setMounted] = useState(false);
    const [greeting, setGreeting] = useState('');
    const [timeIcon, setTimeIcon] = useState<any>(Sun);

    useEffect(() => {
        setMounted(true);
        const hour = new Date().getHours();

        if (hour < 12) {
            setGreeting('Good Morning');
            setTimeIcon(Coffee);
        } else if (hour < 18) {
            setGreeting('Good Afternoon');
            setTimeIcon(Sun);
        } else {
            setGreeting('Good Evening');
            setTimeIcon(Moon);
        }
    }, []);

    // Determine focus Item
    const pendingOrders = orders.filter(o => o.status === 'pending');

    // Use shop name if available, otherwise username
    const displayName = shopName || userName.split(' ')[0];

    const Icon = timeIcon;

    if (!mounted) return (
        <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-indigo-500/20"
        >
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between p-8 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-indigo-100">
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wide uppercase">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {greeting}, {displayName}!
                    </h1>
                </div>

                {/* Action Button */}
                {pendingOrders.length > 0 ? (
                    <Link
                        href="/dashboard/orders?status=pending"
                        className="group flex items-center gap-3 bg-white text-indigo-600 px-6 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <div className="relative">
                            <AlertCircle className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                        </div>
                        Review Orders
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                ) : (
                    <Link
                        href="/dashboard/products/create"
                        className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/20 transition-all"
                    >
                        Add New Product
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                )}
            </div>
        </motion.div>
    );
}
