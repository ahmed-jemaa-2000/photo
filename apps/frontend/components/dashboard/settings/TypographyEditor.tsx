'use client';

import { motion } from 'framer-motion';
import type { ShopFont } from '@busi/types';
import { Type, Check, Sparkles } from 'lucide-react';

interface TypographyEditorProps {
  font: ShopFont;
  onChange: (font: ShopFont) => void;
}

const FONT_FAMILIES: Record<ShopFont, string> = {
  inter: '"Inter", sans-serif',
  playfair: '"Playfair Display", serif',
  montserrat: '"Montserrat", sans-serif',
  roboto: '"Roboto", sans-serif',
  poppins: '"Poppins", sans-serif',
};

const FONTS: Array<{
  value: ShopFont;
  label: string;
  description: string;
  bestFor: string;
  style: 'Sans-serif' | 'Serif';
  personality: string;
}> = [
    {
      value: 'inter',
      label: 'Inter',
      description: 'Modern and highly legible',
      bestFor: 'Tech, Modern, Professional',
      style: 'Sans-serif',
      personality: 'Clean & Modern',
    },
    {
      value: 'playfair',
      label: 'Playfair Display',
      description: 'Elegant with classic serifs',
      bestFor: 'Luxury, Fashion, Boutiques',
      style: 'Serif',
      personality: 'Elegant & Refined',
    },
    {
      value: 'montserrat',
      label: 'Montserrat',
      description: 'Geometric with urban feel',
      bestFor: 'Streetwear, Bold Brands',
      style: 'Sans-serif',
      personality: 'Bold & Urban',
    },
    {
      value: 'roboto',
      label: 'Roboto',
      description: 'Friendly and versatile',
      bestFor: 'General, E-commerce',
      style: 'Sans-serif',
      personality: 'Friendly & Versatile',
    },
    {
      value: 'poppins',
      label: 'Poppins',
      description: 'Rounded and approachable',
      bestFor: 'Kids, Playful Brands',
      style: 'Sans-serif',
      personality: 'Playful & Fun',
    },
  ];

export default function TypographyEditor({ font, onChange }: TypographyEditorProps) {
  const selectedFont = FONTS.find(f => f.value === font);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Type className="w-5 h-5 text-white" />
          </div>
          Typography
        </h2>
        <p className="text-gray-600 mt-2">
          Choose a font that matches your brand's personality.
        </p>
      </div>

      {/* Font Selection Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FONTS.map((fontOption) => {
          const isSelected = font === fontOption.value;
          return (
            <motion.button
              key={fontOption.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => onChange(fontOption.value)}
              className={`
                relative p-5 rounded-2xl border-2 text-left transition-all
                ${isSelected
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-gray-100 hover:border-gray-300 bg-white'
                }
              `}
            >
              {/* Font Sample */}
              <div
                className="text-3xl font-bold text-gray-900 mb-3 truncate"
                style={{ fontFamily: FONT_FAMILIES[fontOption.value] }}
              >
                Aa Bb Cc
              </div>

              {/* Font Name & Style */}
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-gray-900">{fontOption.label}</h4>
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                  {fontOption.style}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-3">{fontOption.description}</p>

              {/* Best For */}
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-gray-600">{fontOption.bestFor}</span>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900">Live Preview</h3>
          {selectedFont && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {selectedFont.label}
            </span>
          )}
        </div>

        <div
          className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-8 space-y-8"
          style={{ fontFamily: FONT_FAMILIES[font] }}
        >
          {/* Headings */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-sans">Headings</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Your Store</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Featured Collection</h2>
            <h3 className="text-xl font-semibold text-gray-700">Product Categories</h3>
          </div>

          {/* Body Text */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-sans">Body Text</p>
            <p className="text-base text-gray-700 leading-relaxed">
              Discover our curated selection of premium products. Each item is carefully selected to ensure the highest quality for our customers.
            </p>
          </div>

          {/* UI Elements */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-sans">UI Elements</p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl">
                Add to Cart
              </button>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-full text-sm">
                Category Tag
              </span>
              <span className="text-2xl font-bold text-gray-900">$129.00</span>
            </div>
          </div>

          {/* Numbers */}
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-sans">Numbers & Prices</p>
            <div className="flex items-baseline gap-6">
              <span className="text-4xl font-bold text-gray-900">1234567890</span>
              <span className="text-2xl text-gray-600">$€¥£</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Tip */}
      {selectedFont && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Type className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">
                {selectedFont.label} is {selectedFont.personality}
              </h4>
              <p className="text-sm text-gray-600">
                This font works best for: <strong>{selectedFont.bestFor}</strong>.
                It gives your store a {selectedFont.personality.toLowerCase()} feel that resonates with customers.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
