'use client';

import { motion } from 'framer-motion';
import { ShopCardStyle } from '@/lib/types';
import { Check, Package, Info } from 'lucide-react';
import { useState } from 'react';

interface ProductCardConfiguratorProps {
  value: ShopCardStyle;
  onChange: (style: ShopCardStyle) => void;
}

interface CardOption {
  value: ShopCardStyle;
  label: string;
  description: string;
  preview: React.ReactNode;
  features: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

// Product card style previews
const CleanCardPreview = () => (
  <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    {/* Image */}
    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
      <Package className="w-8 h-8 text-gray-400" />
    </div>

    {/* Content */}
    <div className="p-3 space-y-1.5">
      <div className="h-1.5 w-3/4 bg-gray-800 rounded"></div>
      <div className="h-1 w-1/2 bg-gray-400 rounded"></div>
      <div className="flex items-center justify-between pt-1">
        <div className="h-1.5 w-12 bg-emerald-500 rounded"></div>
        <div className="h-1.5 w-1.5 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  </div>
);

const ElevatedCardPreview = () => (
  <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
    {/* Image */}
    <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
      <Package className="w-8 h-8 text-purple-400" />
      {/* Floating badge */}
      <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
        %
      </div>
    </div>

    {/* Content */}
    <div className="p-3 space-y-1.5">
      <div className="h-1.5 w-3/4 bg-gray-900 rounded"></div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full"></div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="h-0.5 w-8 bg-gray-400 line-through rounded mb-0.5"></div>
          <div className="h-1.5 w-10 bg-red-500 rounded"></div>
        </div>
        <div className="h-5 w-5 bg-indigo-600 rounded-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-sm"></div>
        </div>
      </div>
    </div>
  </div>
);

const MinimalCardPreview = () => (
  <div className="w-full bg-white overflow-hidden group">
    {/* Image */}
    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-200">
      <Package className="w-8 h-8 text-gray-300" />
    </div>

    {/* Content - very minimal */}
    <div className="p-3 space-y-2">
      <div className="space-y-1">
        <div className="h-1 w-2/3 bg-gray-700 rounded"></div>
        <div className="h-1.5 w-10 bg-gray-900 rounded"></div>
      </div>
    </div>
  </div>
);

const BorderedCardPreview = () => (
  <div className="w-full bg-white rounded-lg border-2 border-gray-900 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
    {/* Image */}
    <div className="aspect-square bg-gradient-to-br from-yellow-200 to-pink-200 flex items-center justify-center relative border-b-2 border-gray-900">
      <Package className="w-8 h-8 text-gray-900" />
      {/* Badge */}
      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-gray-900 text-white text-[8px] font-bold rounded">
        NEW
      </div>
    </div>

    {/* Content */}
    <div className="p-3 space-y-1.5">
      <div className="h-1.5 w-3/4 bg-gray-900 rounded"></div>
      <div className="h-1 w-1/2 bg-gray-600 rounded"></div>
      <div className="flex items-center gap-2 pt-1">
        <div className="h-1.5 w-12 bg-gray-900 rounded"></div>
        <div className="h-6 w-6 bg-yellow-300 border-2 border-gray-900 rounded flex items-center justify-center text-[10px] font-bold">
          +
        </div>
      </div>
    </div>
  </div>
);

const CompactCardPreview = () => (
  <div className="w-full bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden flex">
    {/* Image - smaller */}
    <div className="w-24 aspect-square bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
      <Package className="w-6 h-6 text-emerald-500" />
    </div>

    {/* Content */}
    <div className="flex-1 p-2 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="h-1 w-3/4 bg-gray-800 rounded"></div>
        <div className="h-0.5 w-1/2 bg-gray-400 rounded"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-1 w-10 bg-emerald-600 rounded"></div>
        <div className="h-4 w-4 bg-gray-900 rounded-full"></div>
      </div>
    </div>
  </div>
);

const cardStyles: CardOption[] = [
  {
    value: 'clean',
    label: 'Clean & Simple',
    description: 'Straightforward cards with essential information',
    preview: <CleanCardPreview />,
    features: ['Easy to scan', 'Fast loading', 'Works everywhere'],
  },
  {
    value: 'elevated',
    label: 'Elevated',
    description: 'Enhanced cards with shadows, badges, and ratings',
    preview: <ElevatedCardPreview />,
    features: ['Rich visuals', 'Sale badges', 'Star ratings', 'Quick add button'],
  },
  {
    value: 'minimal',
    label: 'Ultra Minimal',
    description: 'Stripped-down design focusing on product image',
    preview: <MinimalCardPreview />,
    features: ['Image-first', 'Reduced text', 'Premium feel'],
  },
  {
    value: 'bordered',
    label: 'Bold Bordered',
    description: 'Strong borders and bold shadows for impact',
    preview: <BorderedCardPreview />,
    features: ['Eye-catching', 'Playful style', 'Strong presence'],
  },
  {
    value: 'compact',
    label: 'Compact List',
    description: 'Horizontal layout showing more products at once',
    preview: <CompactCardPreview />,
    features: ['Space efficient', 'Mobile friendly', 'Quick browsing'],
  },
];

export default function ProductCardConfigurator({
  value,
  onChange,
}: ProductCardConfiguratorProps) {
  const [hoveredCard, setHoveredCard] = useState<ShopCardStyle | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Product Card Design
        </h3>
        <p className="text-sm text-gray-600">
          Choose how your products will be displayed in the catalog
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {cardStyles.map((style) => {
          const isSelected = value === style.value;
          const isHovered = hoveredCard === style.value;

          return (
            <motion.button
              key={style.value}
              variants={itemVariants}
              onClick={() => onChange(style.value)}
              onHoverStart={() => setHoveredCard(style.value)}
              onHoverEnd={() => setHoveredCard(null)}
              className="text-left"
              type="button"
            >
              <motion.div
                initial={false}
                animate={{
                  y: isHovered ? -4 : 0,
                  boxShadow: isSelected
                    ? '0 20px 25px -5px rgba(79, 70, 229, 0.2)'
                    : isHovered
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                transition={{ duration: 0.2 }}
                className={`
                  relative rounded-xl border-2 transition-colors duration-200 overflow-hidden
                  ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/30'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-3 right-3 z-10 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Preview */}
                <div className="p-4 bg-gray-50">
                  <div className="w-full max-w-[200px] mx-auto">
                    {style.preview}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div>
                    <h4
                      className={`font-semibold text-sm mb-1 ${
                        isSelected ? 'text-indigo-900' : 'text-gray-900'
                      }`}
                    >
                      {style.label}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-1">
                    {style.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-1.5 text-xs text-gray-700"
                      >
                        <div
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? 'bg-indigo-600' : 'bg-gray-400'
                          }`}
                        ></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom accent */}
                {isSelected && (
                  <motion.div
                    layoutId="card-configurator-border"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <p className="font-semibold mb-1">Choose Based on Your Products</p>
          <p className="text-amber-800">
            <strong>Elevated</strong> works great for e-commerce with sales and promotions.
            <strong> Minimal</strong> is perfect for luxury or photography.
            <strong> Compact</strong> is ideal for catalogs with many items.
          </p>
        </div>
      </div>
    </div>
  );
}
