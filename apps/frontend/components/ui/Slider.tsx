'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  unit?: string;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  unit = '',
  className = '',
  disabled = false
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return;
    updateValue(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateValue = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    let newValue = min + percentage * (max - min);

    // Round to nearest step
    newValue = Math.round(newValue / step) * step;
    newValue = Math.max(min, Math.min(max, newValue));

    onChange(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
          {showValue && (
            <span className="text-sm font-semibold text-gray-900">
              {value}
              {unit}
            </span>
          )}
        </div>
      )}

      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        className={`
          group relative h-2 cursor-pointer rounded-full bg-gray-200
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        {/* Filled track */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {/* Thumb */}
        <motion.div
          className={`
            absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-md
            transition-transform
            ${!disabled && 'group-hover:scale-110'}
            ${isDragging && 'scale-125'}
          `}
          style={{ left: `${percentage}%`, x: '-50%' }}
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Tooltip on hover */}
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg"
            >
              {value}
              {unit}
              <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Marks (optional, for showing min/max or steps) */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

/**
 * Range Slider for min/max values
 */
interface RangeSliderProps {
  values: [number, number];
  onChange: (values: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  className?: string;
}

export function RangeSlider({
  values: [minValue, maxValue],
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit = '',
  className = ''
}: RangeSliderProps) {
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

  const updateValue = (clientX: number, isMin: boolean) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    let newValue = min + percentage * (max - min);
    newValue = Math.round(newValue / step) * step;
    newValue = Math.max(min, Math.min(max, newValue));

    if (isMin) {
      onChange([Math.min(newValue, maxValue), maxValue]);
    } else {
      onChange([minValue, Math.max(newValue, minValue)]);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingMin) updateValue(e.clientX, true);
      if (isDraggingMax) updateValue(e.clientX, false);
    };

    const handleMouseUp = () => {
      setIsDraggingMin(false);
      setIsDraggingMax(false);
    };

    if (isDraggingMin || isDraggingMax) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingMin, isDraggingMax, minValue, maxValue]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <span className="text-sm font-semibold text-gray-900">
            {minValue}
            {unit} - {maxValue}
            {unit}
          </span>
        </div>
      )}

      <div ref={sliderRef} className="relative h-2 cursor-pointer rounded-full bg-gray-200">
        {/* Filled track */}
        <div
          className="absolute top-0 h-full rounded-full bg-primary"
          style={{
            left: `${minPercentage}%`,
            right: `${100 - maxPercentage}%`
          }}
        />

        {/* Min thumb */}
        <motion.div
          onMouseDown={() => setIsDraggingMin(true)}
          className={`
            absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-primary shadow-md
            transition-transform hover:scale-110
            ${isDraggingMin && 'scale-125'}
          `}
          style={{ left: `${minPercentage}%`, x: '-50%' }}
        />

        {/* Max thumb */}
        <motion.div
          onMouseDown={() => setIsDraggingMax(true)}
          className={`
            absolute top-1/2 h-5 w-5 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-primary shadow-md
            transition-transform hover:scale-110
            ${isDraggingMax && 'scale-125'}
          `}
          style={{ left: `${maxPercentage}%`, x: '-50%' }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}
