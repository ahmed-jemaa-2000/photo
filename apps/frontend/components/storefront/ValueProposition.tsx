'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { Sparkles, Diamond, Crown, Shield, Heart, Gem } from 'lucide-react';

export default function ValueProposition() {
  const stats = [
    { value: '10K+', label: 'Happy Customers', icon: Heart },
    { value: '99%', label: 'Satisfaction Rate', icon: Sparkles },
    { value: '5★', label: 'Average Rating', icon: Crown },
  ];

  const pillars = [
    {
      icon: Diamond,
      title: 'Curated Excellence',
      description: 'Hand-picked pieces that define contemporary elegance',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: Gem,
      title: 'Artisan Craft',
      description: 'Meticulous attention to every stitch and seam',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: Shield,
      title: 'Trusted Quality',
      description: 'Premium materials that stand the test of time',
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <Section background="gray" spacing="xl">
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold tracking-wider uppercase text-primary">
              The Difference
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Discerning Shoppers{' '}
            <span className="text-gradient-premium">Choose Us</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We don&apos;t just sell products. We curate experiences that elevate your everyday.
          </p>
        </motion.div>

        {/* Stats Row - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 md:gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 md:p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300">
                <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-3 opacity-80" />
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pillars - Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

              {/* Card */}
              <div className="relative h-full bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                {/* Decorative Corner */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${pillar.gradient} rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500`} />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <pillar.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>

                {/* Bottom Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${pillar.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-400 flex items-center justify-center gap-3">
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="font-medium">Trusted by thousands across Tunisia</span>
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </p>
        </motion.div>
      </Container>
    </Section>
  );
}
