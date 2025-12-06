'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free delivery on orders over 100 TND',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      icon: ShieldCheck,
      title: 'Quality Guaranteed',
      description: 'Premium materials and craftsmanship',
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      borderColor: 'border-emerald-200'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Always here to help you',
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-100',
      borderColor: 'border-amber-200'
    }
  ];

  return (
    <Section background="white" spacing="lg">
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Shop with Confidence
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className={`
                relative h-full p-6 rounded-2xl bg-white border ${feature.borderColor}
                shadow-sm hover:shadow-lg transition-all duration-300
                flex flex-col items-center text-center
              `}>
                {/* Icon */}
                <div className={`
                  w-14 h-14 rounded-xl ${feature.bgColor} ${feature.iconColor}
                  flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className={`
                  absolute top-0 right-0 w-16 h-16 ${feature.bgColor} opacity-30
                  rounded-bl-[40px] rounded-tr-2xl -z-10
                `} />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
