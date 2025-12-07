'use client';

import type { Shop, Product } from '@busi/types';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface HeroProps {
  shop: Shop;
  featuredProducts: Product[];
}

export default function Hero({ shop, featuredProducts }: HeroProps) {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[50vh] sm:min-h-[65vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden storefront-page">
      {/* Premium Background - Simplified for mobile performance */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-20" />

        {/* Floating Orbs - Reduced size and blur on mobile for performance */}
        <div className="absolute top-1/4 left-1/4 w-[150px] sm:w-[250px] lg:w-[350px] h-[150px] sm:h-[250px] lg:h-[350px] rounded-full blur-[60px] sm:blur-[100px] lg:blur-[120px] animate-float opacity-30 sm:opacity-40 lg:opacity-50 storefront-brand-bg" />
        <div className="absolute bottom-1/3 right-1/4 w-[120px] sm:w-[200px] lg:w-[300px] h-[120px] sm:h-[200px] lg:h-[300px] rounded-full blur-[50px] sm:blur-[80px] lg:blur-[100px] animate-float-slow opacity-25 sm:opacity-30 lg:opacity-40 storefront-secondary-bg" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto space-y-6 sm:space-y-8"
        >
          {/* Glass Card - Smaller padding on mobile */}
          <div className="glass-dark-premium p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden">
            {/* Welcome Tag - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium tracking-wide uppercase text-white/70 border border-white/20 rounded-full mb-4 sm:mb-6">
                Welcome to
              </span>
            </motion.div>

            {/* Shop Name - Responsive sizing */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-4"
            >
              <span className="text-gradient-premium">{shop.name}</span>
            </motion.h1>

            {/* Tagline - Simpler on mobile */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-xl text-gray-300 max-w-xl mx-auto leading-relaxed"
            >
              Discover our exclusive collection
              <span className="hidden sm:inline">. Quality that speaks for itself.</span>
            </motion.p>

            {/* CTA Buttons - Stack on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8"
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto min-w-[180px] text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8 rounded-full btn-gradient transition-all duration-300 active:scale-95"
                onClick={scrollToProducts}
              >
                <span className="flex items-center justify-center gap-2">
                  Shop Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[180px] text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8 rounded-full border-white/30 text-white hover:bg-white/10 transition-all duration-300 active:scale-95"
                onClick={scrollToProducts}
              >
                Browse Catalog
              </Button>
            </motion.div>
          </div>

          {/* Trust Indicators - Simplified on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-white/50 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Easy Returns</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 hidden sm:block"
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
