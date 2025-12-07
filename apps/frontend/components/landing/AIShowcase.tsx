'use client';

import { motion } from 'framer-motion';
import { Sparkles, Wand2, Image as ImageIcon } from 'lucide-react';

export default function AIShowcase() {
    return (
        <section className="relative py-20 sm:py-28 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left - Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Before/After Cards */}
                        <div className="relative">
                            {/* Before Card */}
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <div className="aspect-[4/3] bg-gradient-to-br from-gray-700 to-gray-800 p-8 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <p className="text-gray-400 text-sm">Original Product Photo</p>
                                        <p className="text-gray-500 text-xs mt-1">Basic, unedited image</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-300">
                                    Before
                                </div>
                            </div>

                            {/* After Card - Overlapping */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="absolute -bottom-8 -right-4 sm:-right-8 w-3/4 rounded-2xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/20"
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 via-gray-900 to-primary/20 p-8 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center border border-primary/30">
                                            <Sparkles className="w-12 h-12 text-primary" />
                                        </div>
                                        <p className="text-white text-sm font-medium">AI Enhanced</p>
                                        <p className="text-primary text-xs mt-1">Professional quality</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-primary to-purple-600 rounded-full text-xs font-medium text-white">
                                    After ✨
                                </div>
                            </motion.div>

                            {/* Floating AI Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 right-0 sm:right-16 p-3 bg-gray-800/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl"
                            >
                                <Wand2 className="w-6 h-6 text-primary" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:pl-8"
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            AI Photo Studio
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Transform Your Photos with <span className="text-gradient-premium">AI Magic</span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Upload any product photo and watch it transform into a professional,
                            studio-quality image. Our AI removes backgrounds, enhances colors,
                            and creates stunning visuals that sell.
                        </p>

                        {/* Benefits List */}
                        <ul className="space-y-4 mb-8">
                            {[
                                'Remove backgrounds instantly',
                                'Add professional lighting effects',
                                'Generate lifestyle scenes',
                                'Batch process multiple images',
                            ].map((benefit, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-300">{benefit}</span>
                                </motion.li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <a
                            href="/dashboard/login"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                        >
                            <Sparkles className="w-5 h-5" />
                            Try AI Studio Free
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
