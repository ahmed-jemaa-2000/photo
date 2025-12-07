'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        name: 'Sarah M.',
        role: 'Fashion Boutique Owner',
        avatar: '👩‍💼',
        content: 'I launched my store in one afternoon! The AI photo studio is amazing - my product photos look like they were shot by a professional.',
        rating: 5,
    },
    {
        name: 'Ahmed K.',
        role: 'Electronics Seller',
        avatar: '👨‍💻',
        content: 'The WhatsApp integration changed everything. I get orders directly and can respond instantly. Sales increased by 40% in the first month.',
        rating: 5,
    },
    {
        name: 'Fatima B.',
        role: 'Handmade Crafts',
        avatar: '👩‍🎨',
        content: 'As someone with no tech skills, this platform is a lifesaver. Beautiful store, easy to manage, and my customers love it!',
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="relative py-20 sm:py-28 bg-gray-900/50">
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
                        Testimonials
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Loved by <span className="text-gradient-premium">Entrepreneurs</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Join hundreds of sellers who transformed their business with Brandini
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            {/* Rating Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-gray-300 leading-relaxed mb-6">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-2xl">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{testimonial.name}</p>
                                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                                </div>
                            </div>

                            {/* Quote Mark */}
                            <div className="absolute top-6 right-6 text-6xl text-primary/10 font-serif leading-none">
                                "
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
