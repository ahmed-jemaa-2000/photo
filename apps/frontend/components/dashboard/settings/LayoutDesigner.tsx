'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ShopTemplate, ShopHeroStyle, ShopCardStyle, ShopTheme } from '@busi/types';
import { Layout, Image, Grid3X3, Check, Sparkles, Monitor, Tablet, Smartphone } from 'lucide-react';

interface LayoutDesignerProps {
  template: ShopTemplate;
  heroStyle: ShopHeroStyle;
  cardStyle: ShopCardStyle;
  theme: ShopTheme;
  onChange: (layout: {
    template?: ShopTemplate;
    heroStyle?: ShopHeroStyle;
    cardStyle?: ShopCardStyle;
  }) => void;
}

const TEMPLATES: Array<{ value: ShopTemplate; label: string; description: string; icon: string }> = [
  { value: 'minimal', label: 'Modern Minimal', description: 'Clean and simple', icon: '✨' },
  { value: 'boutique', label: 'Boutique Luxe', description: 'Elegant and refined', icon: '💎' },
  { value: 'street', label: 'Bold Street', description: 'Urban and edgy', icon: '🔥' },
];

const HERO_STYLES: Array<{ value: ShopHeroStyle; label: string; description: string }> = [
  { value: 'big-banner', label: 'Full Banner', description: 'Full-width hero image' },
  { value: 'small-hero', label: 'Compact', description: 'Smaller, focused hero' },
  { value: 'carousel', label: 'Carousel', description: 'Multiple sliding images' },
];

const CARD_STYLES: Array<{ value: ShopCardStyle; label: string; description: string }> = [
  { value: 'rounded', label: 'Rounded', description: 'Soft corners' },
  { value: 'square', label: 'Square', description: 'Sharp edges' },
  { value: 'elevated', label: 'Elevated', description: 'Floating with shadow' },
];

export default function LayoutDesigner({
  template,
  heroStyle,
  cardStyle,
  theme,
  onChange,
}: LayoutDesignerProps) {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          Layout Designer
        </h2>
        <p className="text-gray-600 mt-2">
          Customize how your store's elements are displayed.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left Side - Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Style */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Store Template
            </h3>
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onChange({ template: t.value })}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all
                    ${template === t.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-100 hover:border-gray-200'
                    }
                  `}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{t.label}</p>
                    <p className="text-xs text-gray-500">{t.description}</p>
                  </div>
                  {template === t.value && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Style */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Image className="w-4 h-4 text-blue-500" />
              Hero Section
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {HERO_STYLES.map((h) => (
                <button
                  key={h.value}
                  type="button"
                  onClick={() => onChange({ heroStyle: h.value })}
                  className={`
                    p-3 rounded-xl border-2 text-center transition-all
                    ${heroStyle === h.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-100 hover:border-gray-200'
                    }
                  `}
                >
                  {/* Mini Preview */}
                  <div className="w-full aspect-video bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                    {h.value === 'big-banner' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-200" />
                    )}
                    {h.value === 'small-hero' && (
                      <div className="absolute inset-x-2 inset-y-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded" />
                    )}
                    {h.value === 'carousel' && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-200" />
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          <div className="w-1 h-1 bg-gray-500 rounded-full" />
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-900">{h.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Card Style */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-green-500" />
              Product Cards
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {CARD_STYLES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => onChange({ cardStyle: c.value })}
                  className={`
                    p-3 rounded-xl border-2 text-center transition-all
                    ${cardStyle === c.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-100 hover:border-gray-200'
                    }
                  `}
                >
                  {/* Mini Card Preview */}
                  <div className="w-full aspect-square mb-2 relative">
                    <div
                      className={`
                        absolute inset-1 bg-white border border-gray-200
                        ${c.value === 'rounded' ? 'rounded-lg' : ''}
                        ${c.value === 'square' ? 'rounded-none' : ''}
                        ${c.value === 'elevated' ? 'rounded-lg shadow-lg' : ''}
                      `}
                    >
                      <div className={`h-2/3 bg-gray-100 ${c.value === 'rounded' || c.value === 'elevated' ? 'rounded-t-lg' : ''}`} />
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-900">{c.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Live Preview */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-4">
            {/* Preview Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-900">Live Preview</h3>
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                {[
                  { id: 'desktop', icon: Monitor },
                  { id: 'tablet', icon: Tablet },
                  { id: 'mobile', icon: Smartphone },
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPreviewDevice(id as 'desktop' | 'tablet' | 'mobile')}
                    className={`
                      p-2 rounded-md transition-colors
                      ${previewDevice === id
                        ? 'bg-primary text-white'
                        : 'text-gray-500 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-6 bg-gray-100 min-h-[500px] flex justify-center">
              <motion.div
                initial={false}
                animate={{ width: deviceWidths[previewDevice] }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200"
                style={{ maxWidth: '100%' }}
              >
                {/* Browser Chrome */}
                <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div className="flex-1 mx-4">
                    <div className="h-4 bg-gray-200 rounded-md max-w-[200px] mx-auto" />
                  </div>
                </div>

                {/* Store Preview */}
                <div className="p-3">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3 px-2">
                    <div className="w-6 h-6 rounded bg-gray-200" />
                    <div className="flex gap-2">
                      <div className="w-8 h-2 bg-gray-200 rounded-full" />
                      <div className="w-8 h-2 bg-gray-200 rounded-full" />
                    </div>
                  </div>

                  {/* Hero */}
                  <div
                    className={`mb-3 rounded-lg overflow-hidden ${heroStyle === 'big-banner' ? 'h-24' :
                        heroStyle === 'small-hero' ? 'h-16 mx-4' : 'h-20'
                      }`}
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {heroStyle === 'carousel' && (
                      <div className="h-full flex items-end justify-center pb-2">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                          <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Products Grid */}
                  <div className={`grid gap-2 px-2 ${previewDevice === 'mobile' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className={`
                          bg-white border border-gray-100
                          ${cardStyle === 'rounded' ? 'rounded-lg' : ''}
                          ${cardStyle === 'square' ? 'rounded-none' : ''}
                          ${cardStyle === 'elevated' ? 'rounded-lg shadow-md' : ''}
                        `}
                      >
                        <div
                          className={`aspect-square bg-gray-100 ${cardStyle === 'rounded' || cardStyle === 'elevated' ? 'rounded-t-lg' : ''
                            }`}
                        />
                        <div className="p-2">
                          <div className="h-1.5 bg-gray-200 rounded-full w-3/4 mb-1" />
                          <div
                            className="h-1.5 rounded-full w-1/2"
                            style={{ backgroundColor: theme.primaryColor + '60' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Config Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="font-bold text-gray-900 mb-4">Current Configuration</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-indigo-100">
            <p className="text-xs text-indigo-600 font-semibold uppercase mb-1">Template</p>
            <p className="font-bold text-gray-900 capitalize">{template.replace('-', ' ')}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-indigo-100">
            <p className="text-xs text-indigo-600 font-semibold uppercase mb-1">Hero Style</p>
            <p className="font-bold text-gray-900 capitalize">{heroStyle.replace('-', ' ')}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-indigo-100">
            <p className="text-xs text-indigo-600 font-semibold uppercase mb-1">Card Style</p>
            <p className="font-bold text-gray-900 capitalize">{cardStyle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
