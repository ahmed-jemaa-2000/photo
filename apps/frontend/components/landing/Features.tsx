'use client';

import { motion } from 'framer-motion';
import { Sparkles, Store, Smartphone, Package, MessageCircle, BarChart3 } from 'lucide-react';

const features = [
    {
        icon: Sparkles,
        title: 'AI Photo Studio',
        description: 'Transform product photos with AI. Professional results in seconds.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Store,
        title: 'Instant Storefront',
        description: 'Beautiful templates that work. No design skills needed.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Smartphone,
        title: 'Mobile-First Design',
        description: 'Perfect on every device. Your customers shop anywhere.',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: Package,
        title: 'Easy Product Management',
        description: 'Add, edit, organize products with our intuitive dashboard.',
        color: 'from-orange-500 to-yellow-500',
    },
    {
        icon: MessageCircle,
        title: 'WhatsApp Integration',
        description: 'Receive orders directly via WhatsApp. No payment gateway needed.',
        color: 'from-green-400 to-green-600',
    },
    {
        icon: BarChart3,
        title: 'Analytics Dashboard',
        description: 'Track views, orders, and growth. Make data-driven decisions.',
        color: 'from-indigo-500 to-purple-500',
    },
];

export default function Features() {
    return (
        <section id="features" className="relative py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Everything You Need to <span className="text-gradient-premium">Sell Online</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Powerful tools designed for entrepreneurs. Start selling in minutes, not months.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover Glow */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
