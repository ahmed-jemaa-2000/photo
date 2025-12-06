'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ThemePreset } from '@/lib/constants/presets';
import { themeDefinitions } from '@/components/shared/ThemeProvider';

interface PresetPreviewModalProps {
  preset: ThemePreset | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const modalVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

const contentVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export default function PresetPreviewModal({ preset, isOpen, onClose, onApply }: PresetPreviewModalProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');

  if (!preset) return null;

  const deviceDimensions = {
    desktop: { width: '100%', maxWidth: '1440px', height: '100%' },
    tablet: { width: '768px', maxWidth: '100%', height: '100%' },
    mobile: { width: '375px', maxWidth: '100%', height: '100%' },
  };

  const getBadgeStyles = (badge?: string) => {
    switch (badge) {
      case 'popular':
        return 'bg-amber-100 text-amber-700';
      case 'premium':
        return 'bg-purple-100 text-purple-700';
      case 'new':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={contentVariants}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[95vh] w-[95vw] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Back to Gallery</span>
                </button>

                <div className="h-6 w-px bg-gray-300" />

                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">{preset.name}</h2>
                  {preset.badge && (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeStyles(preset.badge)}`}>
                      {preset.badge === 'popular' && '⭐ '}
                      {preset.badge === 'premium' && '💎 '}
                      {preset.badge === 'new' && '✨ '}
                      {preset.badge.charAt(0).toUpperCase() + preset.badge.slice(1)}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-6">
                {/* Device Toggle */}
                <div className="mb-6">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Preview Device</p>
                  <div className="flex gap-2 rounded-lg bg-white p-1 shadow-sm">
                    <button
                      onClick={() => setDevice('desktop')}
                      className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
                        device === 'desktop'
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Desktop (1440px)"
                    >
                      <svg className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDevice('tablet')}
                      className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
                        device === 'tablet'
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Tablet (768px)"
                    >
                      <svg className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDevice('mobile')}
                      className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
                        device === 'mobile'
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="Mobile (375px)"
                    >
                      <svg className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Preset Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">About</h3>
                    <p className="text-sm text-gray-700">{preset.description}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Best For</h3>
                    <div className="flex flex-wrap gap-2">
                      {preset.bestFor.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Mood</h3>
                    <div className="flex flex-wrap gap-2">
                      {preset.mood.map((mood, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
                        >
                          {mood}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Changes */}
                  {preset.changes && preset.changes.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">Key Differences</h3>
                      <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3 border border-blue-100">
                        <ul className="space-y-1.5">
                          {preset.changes.map((change, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                              <span className="text-blue-600 font-bold mt-0.5">+</span>
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Theme Tokens</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Button Style</span>
                        <span className="text-sm font-medium capitalize text-gray-900">
                          {themeDefinitions[preset.themeId]?.buttonStyle || 'pill'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Navigation</span>
                        <span className="text-sm font-medium capitalize text-gray-900">
                          {themeDefinitions[preset.themeId]?.navStyle || 'pill'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Spacing</span>
                        <span className="text-sm font-medium capitalize text-gray-900">
                          {themeDefinitions[preset.themeId]?.spacingScale || 'normal'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Shadows</span>
                        <span className="text-sm font-medium capitalize text-gray-900">
                          {themeDefinitions[preset.themeId]?.shadowDepth || 'subtle'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Card Style</span>
                        <span className="text-sm font-medium capitalize text-gray-900">
                          {themeDefinitions[preset.themeId]?.cardStyle || 'elevated'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4">
                    <button
                      onClick={onApply}
                      className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
                    >
                      Apply This Preset
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview Area */}
              <div className="flex flex-1 items-center justify-center overflow-auto bg-gray-100 p-8">
                <motion.div
                  key={device}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={deviceDimensions[device]}
                  className="overflow-hidden rounded-lg bg-white shadow-2xl"
                >
                  {/* Preview Content - Placeholder for now */}
                  <div
                    className="flex h-full w-full flex-col"
                    style={{
                      background: `linear-gradient(180deg, ${preset.values.secondaryColor} 0%, #ffffff 100%)`,
                    }}
                  >
                    {/* Mock Header */}
                    <div className="border-b border-gray-200 bg-white px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-10 w-10 rounded-full"
                            style={{ backgroundColor: preset.values.primaryColor }}
                          />
                          <span
                            className="text-lg font-bold"
                            style={{ color: preset.values.primaryColor }}
                          >
                            Your Shop
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm font-medium text-gray-600">
                          <span>Products</span>
                          <span>About</span>
                          <span>Contact</span>
                        </div>
                      </div>
                    </div>

                    {/* Mock Hero */}
                    <div
                      className="flex items-center justify-center py-16"
                      style={{
                        backgroundColor: preset.values.primaryColor,
                        color: '#ffffff',
                      }}
                    >
                      <div className="text-center">
                        <h1 className="text-4xl font-bold">Welcome to Your Store</h1>
                        <p className="mt-2 text-lg opacity-90">Discover amazing products</p>
                      </div>
                    </div>

                    {/* Mock Products */}
                    <div className="flex-1 p-8">
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`overflow-hidden bg-white ${
                              preset.values.cardStyle === 'rounded' ? 'rounded-lg' :
                              preset.values.cardStyle === 'square' ? 'rounded-none' :
                              'rounded-lg shadow-lg'
                            }`}
                            style={{
                              border: `1px solid ${preset.values.secondaryColor}`,
                            }}
                          >
                            <div
                              className="aspect-square"
                              style={{ backgroundColor: preset.values.secondaryColor }}
                            />
                            <div className="p-4">
                              <div className="mb-2 h-4 rounded bg-gray-200" />
                              <div className="h-6 w-16 rounded" style={{ backgroundColor: preset.values.primaryColor }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
