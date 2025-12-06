'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { ThemePreset } from '@/lib/constants/presets';

interface PresetCardProps {
  preset: ThemePreset;
  isSelected: boolean;
  onPreview: () => void;
  onApply: () => void;
}

const cardVariants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  hover: {
    scale: 1.02,
    y: -8,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

const overlayVariants = {
  rest: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

export default function PresetCard({ preset, isSelected, onPreview, onApply }: PresetCardProps) {
  const getBadgeStyles = (badge?: string) => {
    switch (badge) {
      case 'popular':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'premium':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'new':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return '';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fashion':
        return '👗';
      case 'electronics':
        return '📱';
      case 'food':
        return '🍔';
      case 'handmade':
        return '✋';
      case 'beauty':
        return '💄';
      default:
        return '🏪';
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={`group relative overflow-hidden rounded-2xl bg-white transition-all duration-200 ${
        isSelected
          ? 'border-2 border-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10'
          : 'border border-gray-200'
      }`}
    >
      {/* Screenshot/Preview Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {/* Placeholder for now - will be actual screenshots */}
        <div
          className="flex h-full w-full items-center justify-center text-6xl"
          style={{
            background: `linear-gradient(135deg, ${preset.values.primaryColor} 0%, ${preset.values.secondaryColor} 100%)`,
          }}
        >
          {getCategoryIcon(preset.category)}
        </div>

        {/* Hover Overlay */}
        <motion.div
          variants={overlayVariants}
          className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <div className="space-y-3 text-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview Live
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Apply Preset
            </button>
          </div>
        </motion.div>

        {/* Badge */}
        {preset.badge && (
          <div className="absolute left-3 top-3">
            <span
              className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeStyles(
                preset.badge
              )}`}
            >
              {preset.badge === 'popular' && '⭐'}
              {preset.badge === 'premium' && '💎'}
              {preset.badge === 'new' && '✨'}
              {preset.badge.charAt(0).toUpperCase() + preset.badge.slice(1)}
            </span>
          </div>
        )}

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Name & Description */}
        <h3 className="text-lg font-bold text-gray-900">{preset.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{preset.description}</p>

        {/* Changes Chip - Key Differences */}
        {preset.changes && preset.changes.length > 0 && (
          <div className="mt-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3 border border-blue-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-900 mb-1.5 flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Key Changes
            </p>
            <ul className="space-y-0.5">
              {preset.changes.slice(0, 3).map((change, index) => (
                <li key={index} className="flex items-start gap-1.5 text-xs text-gray-700">
                  <span className="text-blue-600 font-bold">+</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {/* Color Swatches */}
          <div className="flex items-center gap-1">
            <div
              className="h-5 w-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
              style={{ backgroundColor: preset.values.primaryColor }}
              title="Primary color"
            />
            <div
              className="h-5 w-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
              style={{ backgroundColor: preset.values.secondaryColor }}
              title="Secondary color"
            />
          </div>

          {/* Font */}
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {preset.values.font.charAt(0).toUpperCase() + preset.values.font.slice(1)}
          </span>

          {/* Template */}
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 capitalize">
            {preset.values.template}
          </span>
        </div>

        {/* Best For */}
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Best for:</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {preset.bestFor.slice(0, 2).map((tag, index) => (
              <span key={index} className="text-xs text-gray-600">
                {tag}
                {index < Math.min(preset.bestFor.length - 1, 1) && ','}
              </span>
            ))}
            {preset.bestFor.length > 2 && (
              <span className="text-xs text-gray-400">+{preset.bestFor.length - 2} more</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onPreview}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Preview
          </button>
          <button
            onClick={onApply}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Apply
          </button>
        </div>
      </div>
    </motion.div>
  );
}
