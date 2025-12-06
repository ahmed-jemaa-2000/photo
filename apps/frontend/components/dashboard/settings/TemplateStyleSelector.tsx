'use client';

import { motion } from 'framer-motion';
import { ShopTemplate } from '@/lib/types';
import { Check } from 'lucide-react';

interface TemplateStyleSelectorProps {
  value: ShopTemplate;
  onChange: (template: ShopTemplate) => void;
}

interface TemplateOption {
  value: ShopTemplate;
  label: string;
  description: string;
  mockup: React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

const cardVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

// Visual mockups for each template
const MinimalMockup = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white p-3 rounded-lg">
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-2 w-16 bg-gray-800 rounded"></div>
        <div className="flex gap-1">
          <div className="h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
          <div className="h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      {/* Hero - Clean and minimal */}
      <div className="bg-gray-100 rounded p-2 mb-2">
        <div className="h-1 w-20 bg-gray-300 rounded mb-1.5"></div>
        <div className="h-0.5 w-16 bg-gray-200 rounded"></div>
      </div>

      {/* Products - Simple grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded p-1">
            <div className="aspect-square bg-gray-100 rounded mb-1"></div>
            <div className="h-0.5 w-full bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BoutiqueMockup = () => (
  <div className="w-full h-full bg-gradient-to-br from-rose-50 via-white to-amber-50 p-3 rounded-lg">
    <div className="space-y-2">
      {/* Header - Elegant */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-2.5 w-16 bg-rose-900 rounded-sm" style={{ fontFamily: 'serif' }}></div>
        <div className="flex gap-1">
          <div className="h-1.5 w-1.5 bg-rose-300 rounded-full"></div>
          <div className="h-1.5 w-1.5 bg-rose-300 rounded-full"></div>
        </div>
      </div>

      {/* Hero - Luxurious */}
      <div className="bg-gradient-to-r from-rose-100 to-amber-100 rounded-lg p-2 mb-2 border border-rose-200/50">
        <div className="h-1 w-24 bg-rose-800 rounded-sm mb-1.5"></div>
        <div className="h-0.5 w-20 bg-rose-600 rounded-sm"></div>
      </div>

      {/* Products - Card-heavy */}
      <div className="grid grid-cols-2 gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-rose-100 p-1.5">
            <div className="aspect-square bg-gradient-to-br from-rose-50 to-amber-50 rounded mb-1"></div>
            <div className="h-0.5 w-full bg-rose-200 rounded-sm"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PlayfulMockup = () => (
  <div className="w-full h-full bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 p-3 rounded-lg">
    <div className="space-y-2">
      {/* Header - Fun */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-2.5 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
        <div className="flex gap-1">
          <div className="h-1.5 w-1.5 bg-yellow-400 rounded-full"></div>
          <div className="h-1.5 w-1.5 bg-pink-400 rounded-full"></div>
        </div>
      </div>

      {/* Hero - Vibrant */}
      <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl p-2 mb-2 transform -rotate-1">
        <div className="h-1 w-20 bg-purple-700 rounded-full mb-1.5"></div>
        <div className="h-0.5 w-16 bg-purple-500 rounded-full"></div>
      </div>

      {/* Products - Fun cards */}
      <div className="grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-1 transform hover:rotate-2 transition-transform">
            <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg mb-1"></div>
            <div className="h-0.5 w-full bg-purple-300 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BoldMockup = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black p-3 rounded-lg">
    <div className="space-y-2">
      {/* Header - Strong */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-16 bg-gradient-to-r from-orange-500 to-red-500 rounded"></div>
        <div className="flex gap-1">
          <div className="h-1.5 w-1.5 bg-orange-500 rounded"></div>
          <div className="h-1.5 w-1.5 bg-orange-500 rounded"></div>
        </div>
      </div>

      {/* Hero - Bold and impactful */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded p-2 mb-2">
        <div className="h-1.5 w-24 bg-white rounded mb-1.5"></div>
        <div className="h-0.5 w-20 bg-orange-100 rounded"></div>
      </div>

      {/* Products - Bold cards */}
      <div className="grid grid-cols-2 gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-800 border-2 border-orange-500 rounded p-1.5">
            <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded mb-1"></div>
            <div className="h-0.5 w-full bg-orange-500 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const templates: TemplateOption[] = [
  {
    value: 'minimal',
    label: 'Modern Minimal',
    description: 'Clean lines, ample whitespace, focus on content',
    mockup: <MinimalMockup />,
  },
  {
    value: 'boutique',
    label: 'Boutique Luxe',
    description: 'Elegant cards, sophisticated styling, premium feel',
    mockup: <BoutiqueMockup />,
  },
  {
    value: 'playful',
    label: 'Playful & Fun',
    description: 'Vibrant colors, rounded edges, energetic vibe',
    mockup: <PlayfulMockup />,
  },
  {
    value: 'bold',
    label: 'Bold & Striking',
    description: 'High contrast, strong typography, dramatic impact',
    mockup: <BoldMockup />,
  },
];

export default function TemplateStyleSelector({
  value,
  onChange,
}: TemplateStyleSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Store Template Style
        </h3>
        <p className="text-sm text-gray-600">
          Choose the overall design approach that matches your brand personality
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {templates.map((template) => {
          const isSelected = value === template.value;

          return (
            <motion.button
              key={template.value}
              variants={itemVariants}
              onClick={() => onChange(template.value)}
              className="relative text-left"
              type="button"
            >
              <motion.div
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                className={`
                  relative rounded-xl border-2 transition-all duration-300 overflow-hidden
                  ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 z-10 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Mockup preview */}
                <div className="aspect-[4/3] p-2 bg-gray-50">
                  {template.mockup}
                </div>

                {/* Template info */}
                <div className="p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-semibold text-sm ${
                        isSelected ? 'text-indigo-900' : 'text-gray-900'
                      }`}
                    >
                      {template.label}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Bottom border accent */}
                {isSelected && (
                  <motion.div
                    layoutId="template-selector-border"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
