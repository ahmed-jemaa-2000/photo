'use client';

import { motion } from 'framer-motion';
import { ShopHeroStyle } from '@/lib/types';
import { Check, Sparkles, Image as ImageIcon, Video, Layout } from 'lucide-react';
import { useState } from 'react';

interface HeroSectionBuilderProps {
  value: ShopHeroStyle;
  onChange: (style: ShopHeroStyle) => void;
}

interface HeroOption {
  value: ShopHeroStyle;
  label: string;
  description: string;
  icon: React.ReactNode;
  preview: React.ReactNode;
  bestFor: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

// Hero style previews
const FullImagePreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg relative overflow-hidden">
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

    {/* Content */}
    <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
      <div className="h-2 w-24 bg-white rounded mb-1"></div>
      <div className="h-1 w-32 bg-white/80 rounded"></div>
      <div className="flex gap-1 mt-2">
        <div className="h-1.5 w-12 bg-white rounded-full"></div>
        <div className="h-1.5 w-12 bg-white/60 rounded-full"></div>
      </div>
    </div>

    {/* Decorative image icon */}
    <div className="absolute top-3 right-3">
      <ImageIcon className="w-4 h-4 text-white/40" />
    </div>
  </div>
);

const SplitPreview = () => (
  <div className="w-full h-full rounded-lg overflow-hidden flex">
    {/* Left: Content */}
    <div className="w-1/2 bg-white p-2 flex flex-col justify-center">
      <div className="space-y-1">
        <div className="h-1.5 w-16 bg-gray-800 rounded"></div>
        <div className="h-0.5 w-20 bg-gray-600 rounded"></div>
        <div className="flex gap-1 mt-2">
          <div className="h-1 w-8 bg-blue-500 rounded"></div>
          <div className="h-1 w-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    {/* Right: Image */}
    <div className="w-1/2 bg-gradient-to-br from-emerald-400 to-teal-500 relative">
      <ImageIcon className="w-4 h-4 text-white/40 absolute top-2 right-2" />
    </div>
  </div>
);

const VideoPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-lg relative overflow-hidden">
    {/* Video play button */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
        <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-gray-900 border-b-4 border-b-transparent ml-0.5"></div>
      </div>
    </div>

    {/* Overlay gradient */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

    {/* Content */}
    <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
      <div className="h-1.5 w-20 bg-white rounded"></div>
      <div className="h-0.5 w-24 bg-white/80 rounded"></div>
    </div>

    <Video className="w-4 h-4 text-white/40 absolute top-2 right-2" />
  </div>
);

const MinimalPreview = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 flex flex-col items-center justify-center border border-gray-200">
    <div className="space-y-2 text-center">
      <div className="h-2 w-24 bg-gray-800 rounded mx-auto"></div>
      <div className="h-1 w-32 bg-gray-600 rounded mx-auto"></div>
      <div className="flex gap-1 justify-center mt-3">
        <div className="h-1.5 w-10 bg-gray-800 rounded-full"></div>
        <div className="h-1.5 w-10 bg-gray-300 rounded-full"></div>
      </div>
    </div>

    {/* Minimal decoration */}
    <div className="absolute top-2 left-2 w-1 h-1 bg-gray-300 rounded-full"></div>
    <div className="absolute bottom-2 right-2 w-1 h-1 bg-gray-300 rounded-full"></div>
  </div>
);

const SliderPreview = () => (
  <div className="w-full h-full rounded-lg overflow-hidden relative">
    {/* Stacked slides effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 to-pink-500 opacity-0"></div>

    {/* Content */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
      <div className="text-white space-y-1 w-full">
        <div className="h-1.5 w-20 bg-white rounded"></div>
        <div className="h-0.5 w-24 bg-white/80 rounded"></div>
      </div>
    </div>

    {/* Navigation dots */}
    <div className="absolute bottom-2 right-2 flex gap-1">
      <div className="w-1 h-1 bg-white rounded-full"></div>
      <div className="w-1 h-1 bg-white/50 rounded-full"></div>
      <div className="w-1 h-1 bg-white/50 rounded-full"></div>
    </div>

    <Sparkles className="w-4 h-4 text-white/40 absolute top-2 right-2" />
  </div>
);

const heroStyles: HeroOption[] = [
  {
    value: 'full-image',
    label: 'Full Image Hero',
    description: 'Full-width background image with overlaid text',
    icon: <ImageIcon className="w-5 h-5" />,
    preview: <FullImagePreview />,
    bestFor: ['Fashion', 'Photography', 'Lifestyle'],
  },
  {
    value: 'split',
    label: 'Split Layout',
    description: 'Content on one side, image on the other',
    icon: <Layout className="w-5 h-5" />,
    preview: <SplitPreview />,
    bestFor: ['SaaS', 'Services', 'Professional'],
  },
  {
    value: 'video',
    label: 'Video Background',
    description: 'Engaging video background with content overlay',
    icon: <Video className="w-5 h-5" />,
    preview: <VideoPreview />,
    bestFor: ['Events', 'Entertainment', 'Food'],
  },
  {
    value: 'minimal',
    label: 'Minimal Text',
    description: 'Clean, text-focused design with subtle accents',
    icon: <Layout className="w-5 h-5" />,
    preview: <MinimalPreview />,
    bestFor: ['Luxury', 'Minimal', 'Editorial'],
  },
  {
    value: 'slider',
    label: 'Image Slider',
    description: 'Multiple slides showcasing different content',
    icon: <Sparkles className="w-5 h-5" />,
    preview: <SliderPreview />,
    bestFor: ['E-commerce', 'Multi-product', 'Promotions'],
  },
];

export default function HeroSectionBuilder({
  value,
  onChange,
}: HeroSectionBuilderProps) {
  const [hoveredStyle, setHoveredStyle] = useState<ShopHeroStyle | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Hero Section Style
        </h3>
        <p className="text-sm text-gray-600">
          Choose how you want to welcome visitors to your store
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {heroStyles.map((style) => {
          const isSelected = value === style.value;
          const isHovered = hoveredStyle === style.value;

          return (
            <motion.button
              key={style.value}
              variants={itemVariants}
              onClick={() => onChange(style.value)}
              onHoverStart={() => setHoveredStyle(style.value)}
              onHoverEnd={() => setHoveredStyle(null)}
              className="w-full text-left"
              type="button"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isHovered ? 1.01 : 1,
                  boxShadow: isSelected
                    ? '0 10px 15px -3px rgba(79, 70, 229, 0.2)'
                    : isHovered
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                transition={{ duration: 0.2 }}
                className={`
                  relative rounded-xl border-2 transition-colors duration-300
                  ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/30'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Preview thumbnail */}
                  <div className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden shadow-md">
                    {style.preview}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className={`
                            p-1.5 rounded-lg transition-colors
                            ${
                              isSelected
                                ? 'bg-indigo-100 text-indigo-600'
                                : 'bg-gray-100 text-gray-600'
                            }
                          `}
                          >
                            {style.icon}
                          </div>
                          <h4
                            className={`font-semibold text-base ${
                              isSelected ? 'text-indigo-900' : 'text-gray-900'
                            }`}
                          >
                            {style.label}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {style.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {style.bestFor.map((tag) => (
                            <span
                              key={tag}
                              className={`
                                inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                ${
                                  isSelected
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-100 text-gray-700'
                                }
                              `}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Selected indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom border accent */}
                {isSelected && (
                  <motion.div
                    layoutId="hero-builder-border"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-b-lg"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Quick tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Pro Tips
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Full Image</strong> works best with high-quality, atmospheric photos</li>
          <li>• <strong>Split Layout</strong> is perfect for highlighting key products or features</li>
          <li>• <strong>Video</strong> creates engagement but ensure it loads quickly</li>
          <li>• <strong>Minimal</strong> puts focus on your message without distractions</li>
          <li>• <strong>Slider</strong> is great for showcasing multiple promotions or collections</li>
        </ul>
      </div>
    </div>
  );
}
