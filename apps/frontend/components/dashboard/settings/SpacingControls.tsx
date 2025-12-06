'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { RotateCcw, Info } from 'lucide-react';

interface SpacingControlsProps {
  spacing: {
    productGap: number;
    sectionPadding: number;
    cardPadding: number;
    borderRadius: number;
  };
  onChange: (spacing: {
    productGap: number;
    sectionPadding: number;
    cardPadding: number;
    borderRadius: number;
  }) => void;
}

interface SliderControlProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  presets?: { label: string; value: number }[];
}

const SliderControl = ({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  presets,
}: SliderControlProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-900 mb-0.5">
            {label}
          </label>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: isDragging ? 1.1 : 1,
            }}
            className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-lg font-semibold text-sm min-w-[60px] text-center"
          >
            {value}
            {unit}
          </motion.div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Progress fill */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            initial={false}
            animate={{
              width: `${percentage}%`,
            }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Slider input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Presets */}
      {presets && (
        <div className="flex gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`
                px-2.5 py-1 rounded-md text-xs font-medium transition-all
                ${
                  value === preset.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

const defaultSpacing = {
  productGap: 24,
  sectionPadding: 48,
  cardPadding: 16,
  borderRadius: 12,
};

export default function SpacingControls({
  spacing,
  onChange,
}: SpacingControlsProps) {
  const handleReset = () => {
    onChange(defaultSpacing);
  };

  const hasChanges =
    spacing.productGap !== defaultSpacing.productGap ||
    spacing.sectionPadding !== defaultSpacing.sectionPadding ||
    spacing.cardPadding !== defaultSpacing.cardPadding ||
    spacing.borderRadius !== defaultSpacing.borderRadius;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Spacing & Sizing
          </h3>
          <p className="text-sm text-gray-600">
            Fine-tune the spacing and dimensions for a perfect layout
          </p>
        </div>

        {hasChanges && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </motion.button>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Product Gap */}
        <motion.div variants={itemVariants}>
          <SliderControl
            label="Product Grid Spacing"
            description="Space between product cards in the grid"
            value={spacing.productGap}
            onChange={(value) => onChange({ ...spacing, productGap: value })}
            min={8}
            max={64}
            step={4}
            unit="px"
            presets={[
              { label: 'Tight', value: 12 },
              { label: 'Normal', value: 24 },
              { label: 'Spacious', value: 40 },
            ]}
          />
        </motion.div>

        {/* Section Padding */}
        <motion.div variants={itemVariants}>
          <SliderControl
            label="Section Padding"
            description="Padding around main content sections"
            value={spacing.sectionPadding}
            onChange={(value) =>
              onChange({ ...spacing, sectionPadding: value })
            }
            min={16}
            max={96}
            step={8}
            unit="px"
            presets={[
              { label: 'Compact', value: 32 },
              { label: 'Standard', value: 48 },
              { label: 'Generous', value: 64 },
            ]}
          />
        </motion.div>

        {/* Card Padding */}
        <motion.div variants={itemVariants}>
          <SliderControl
            label="Product Card Padding"
            description="Internal padding within each product card"
            value={spacing.cardPadding}
            onChange={(value) => onChange({ ...spacing, cardPadding: value })}
            min={8}
            max={32}
            step={4}
            unit="px"
            presets={[
              { label: 'Minimal', value: 12 },
              { label: 'Standard', value: 16 },
              { label: 'Comfortable', value: 24 },
            ]}
          />
        </motion.div>

        {/* Border Radius */}
        <motion.div variants={itemVariants}>
          <SliderControl
            label="Corner Roundness"
            description="Border radius for cards and buttons"
            value={spacing.borderRadius}
            onChange={(value) =>
              onChange({ ...spacing, borderRadius: value })
            }
            min={0}
            max={24}
            step={2}
            unit="px"
            presets={[
              { label: 'Sharp', value: 0 },
              { label: 'Soft', value: 8 },
              { label: 'Round', value: 16 },
            ]}
          />
        </motion.div>
      </motion.div>

      {/* Visual preview */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-100">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Live Preview
        </h4>

        <div
          className="bg-white rounded-lg overflow-hidden"
          style={{
            padding: `${spacing.sectionPadding}px`,
          }}
        >
          <div
            className="grid grid-cols-3 gap-4"
            style={{
              gap: `${spacing.productGap}px`,
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-50 border-2 border-gray-200 overflow-hidden"
                style={{
                  borderRadius: `${spacing.borderRadius}px`,
                  padding: `${spacing.cardPadding}px`,
                }}
              >
                <div
                  className="aspect-square bg-gradient-to-br from-indigo-200 to-purple-200 mb-2"
                  style={{
                    borderRadius: `${spacing.borderRadius * 0.75}px`,
                  }}
                ></div>
                <div className="space-y-1">
                  <div
                    className="h-2 bg-gray-300 rounded-full"
                    style={{
                      borderRadius: `${spacing.borderRadius * 0.5}px`,
                    }}
                  ></div>
                  <div
                    className="h-1.5 w-2/3 bg-gray-200 rounded-full"
                    style={{
                      borderRadius: `${spacing.borderRadius * 0.5}px`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pro tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">Spacing Best Practices</p>
          <ul className="text-blue-800 space-y-0.5">
            <li>
              • <strong>Tight spacing</strong> (12-16px) works well for catalogs
              with many products
            </li>
            <li>
              • <strong>Normal spacing</strong> (24-32px) is ideal for most
              e-commerce stores
            </li>
            <li>
              • <strong>Generous spacing</strong> (40-48px) creates a premium,
              luxury feel
            </li>
            <li>
              • <strong>Round corners</strong> (12-16px) feel modern and
              friendly
            </li>
            <li>
              • <strong>Sharp corners</strong> (0-4px) convey professionalism and
              precision
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
