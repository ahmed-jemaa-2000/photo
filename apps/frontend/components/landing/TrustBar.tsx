'use client';

import { motion } from 'framer-motion';

const stats = [
    { value: '500+', label: 'Active Stores' },
    { value: '10K+', label: 'Products Listed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
];

export default function TrustBar() {
    return (
        <section className="relative py-12 sm:py-16 border-y border-white/5 bg-gray-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <p className="text-gray-500 text-sm uppercase tracking-widest">
                        Trusted by entrepreneurs worldwide
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl sm:text-4xl font-bold text-gradient-premium mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-400 text-sm">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
