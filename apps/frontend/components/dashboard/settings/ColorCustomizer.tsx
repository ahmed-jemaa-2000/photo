'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check, Pipette, Sparkles, Sun, Moon, Droplets, Zap } from 'lucide-react';

interface ColorCustomizerProps {
  primaryColor: string;
  secondaryColor: string;
  onChange: (colors: { primaryColor: string; secondaryColor: string }) => void;
}

const COLOR_PALETTES = [
  { name: 'Ocean Blue', primary: '#2563EB', secondary: '#DBEAFE', mood: 'Professional', icon: '🌊' },
  { name: 'Forest Green', primary: '#059669', secondary: '#D1FAE5', mood: 'Natural', icon: '🌲' },
  { name: 'Sunset Orange', primary: '#EA580C', secondary: '#FED7AA', mood: 'Energetic', icon: '🌅' },
  { name: 'Royal Purple', primary: '#7C3AED', secondary: '#EDE9FE', mood: 'Luxury', icon: '👑' },
  { name: 'Rose Pink', primary: '#E11D48', secondary: '#FFE4E6', mood: 'Playful', icon: '🌸' },
  { name: 'Slate Gray', primary: '#475569', secondary: '#F1F5F9', mood: 'Minimal', icon: '🪨' },
  { name: 'Golden Yellow', primary: '#F59E0B', secondary: '#FEF3C7', mood: 'Warm', icon: '✨' },
  { name: 'Teal Aqua', primary: '#14B8A6', secondary: '#CCFBF1', mood: 'Fresh', icon: '💎' },
];

function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.replace('#', ''), 16);
    const r = ((rgb >> 16) & 255) / 255;
    const g = ((rgb >> 8) & 255) / 255;
    const b = (rgb & 255) / 255;
    const [rs, gs, bs] = [r, g, b].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export default function ColorCustomizer({ primaryColor, secondaryColor, onChange }: ColorCustomizerProps) {
  const contrastRatio = getContrastRatio(primaryColor, '#FFFFFF');
  const meetsWCAG = contrastRatio >= 4.5;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          Color Palette
        </h2>
        <p className="text-gray-600 mt-2">
          Choose colors that represent your brand and create the right mood for your customers.
        </p>
      </div>

      {/* Quick Palettes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Quick Palettes
          </h3>
          <span className="text-xs text-gray-500">Click to apply</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COLOR_PALETTES.map((palette) => {
            const isSelected = primaryColor === palette.primary && secondaryColor === palette.secondary;
            return (
              <motion.button
                key={palette.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onChange({ primaryColor: palette.primary, secondaryColor: palette.secondary })}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all
                  ${isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-gray-100 hover:border-gray-300 bg-white'
                  }
                `}
              >
                {/* Color Preview */}
                <div className="flex gap-1.5 mb-3">
                  <div
                    className="flex-1 h-12 rounded-lg shadow-inner"
                    style={{ backgroundColor: palette.primary }}
                  />
                  <div
                    className="flex-1 h-12 rounded-lg shadow-inner border border-gray-100"
                    style={{ backgroundColor: palette.secondary }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg">{palette.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{palette.name}</p>
                    <p className="text-xs text-gray-500">{palette.mood}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Primary Color */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <Sun className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Primary Color</h3>
              <p className="text-xs text-gray-500">Buttons, links, highlights</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => onChange({ primaryColor: e.target.value, secondaryColor })}
                  className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200"
                />
                <Pipette className="absolute bottom-2 right-2 w-4 h-4 text-white pointer-events-none drop-shadow-md" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">HEX Value</label>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                      onChange({ primaryColor: e.target.value, secondaryColor });
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Accessibility Check */}
            <div className={`rounded-xl p-4 ${meetsWCAG ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${meetsWCAG ? 'bg-green-100' : 'bg-amber-100'}`}>
                  {meetsWCAG ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Zap className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${meetsWCAG ? 'text-green-900' : 'text-amber-900'}`}>
                    {meetsWCAG ? 'Great contrast!' : 'Consider darker shade'}
                  </p>
                  <p className={`text-xs ${meetsWCAG ? 'text-green-700' : 'text-amber-700'}`}>
                    Contrast: {contrastRatio.toFixed(1)}:1 {!meetsWCAG && '(4.5:1 needed)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Color */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center border border-gray-200"
              style={{ backgroundColor: secondaryColor }}
            >
              <Droplets className="w-5 h-5" style={{ color: primaryColor }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Secondary Color</h3>
              <p className="text-xs text-gray-500">Backgrounds, badges, accents</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => onChange({ primaryColor, secondaryColor: e.target.value })}
                  className="w-20 h-20 rounded-xl cursor-pointer border-2 border-gray-200"
                />
                <Pipette className="absolute bottom-2 right-2 w-4 h-4 text-gray-600 pointer-events-none drop-shadow-md" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">HEX Value</label>
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                      onChange({ primaryColor, secondaryColor: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Color Harmony Preview */}
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-600 mb-3">Button Preview</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary
                </button>
                <button
                  type="button"
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm border-2"
                  style={{
                    backgroundColor: secondaryColor,
                    borderColor: primaryColor,
                    color: primaryColor
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Store Preview */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Live Store Preview</h3>
        <div
          className="rounded-xl p-6 border border-gray-200"
          style={{ backgroundColor: secondaryColor + '30' }}
        >
          {/* Mock Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200" />
              <div className="h-3 w-24 bg-gray-300 rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="h-3 w-12 bg-gray-200 rounded-full" />
              <div className="h-3 w-12 bg-gray-200 rounded-full" />
            </div>
          </div>

          {/* Mock Hero */}
          <div
            className="rounded-xl p-8 mb-6 text-center"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="h-4 w-48 bg-white/30 rounded-full mx-auto mb-3" />
            <div className="h-3 w-64 bg-white/20 rounded-full mx-auto" />
          </div>

          {/* Mock Products */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="aspect-square bg-gray-100 rounded-lg mb-2" />
                <div className="h-2 w-full bg-gray-200 rounded-full mb-1" />
                <div
                  className="h-2 w-1/2 rounded-full"
                  style={{ backgroundColor: primaryColor + '60' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
