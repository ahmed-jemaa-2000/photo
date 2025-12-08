'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Headphones, Sparkles, Zap } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: 'Express Delivery',
      description: 'Free shipping on orders over 100 TND',
      highlight: '2-3 Days',
    },
    {
      icon: ShieldCheck,
      title: 'Authenticity Guaranteed',
      description: 'Premium materials & craftsmanship',
      highlight: '100% Original',
    },
    {
      icon: RotateCcw,
      title: 'Hassle-Free Returns',
      description: 'No questions asked policy',
      highlight: '30 Days',
    },
    {
      icon: Headphones,
      title: 'Concierge Support',
      description: 'Personal shopping assistance',
      highlight: '24/7 Available',
    },
  ];

  return (
    <Section background="white" spacing="lg">
      <Container>
        {/* Luxury Feature Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent rounded-3xl" />

          {/* Content */}
          <div className="relative px-6 py-8 md:py-12">
            {/* Small Header Badge */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60">
                The Brandili Promise
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group text-center"
                >
                  {/* Icon Container */}
                  <div className="relative inline-flex mb-4">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-white/20 transition-all duration-300">
                      <feature.icon
                        className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-primary transition-colors duration-300"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Highlight Badge */}
                  <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 mb-2">
                    <span className="text-xs font-bold text-primary">
                      {feature.highlight}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm md:text-base font-semibold text-white mb-1">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-white/40"
            >
              <Zap className="w-4 h-4" />
              <span className="text-xs tracking-wide">
                Experience shopping excellence
              </span>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

