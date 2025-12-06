'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dropdownMenu } from '@/lib/animations';
import { useEscapeKey } from '@/lib/hooks/useKeyboard';
import { useDebounce } from '@/lib/hooks/useDebounce';

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multi?: boolean;
  creatable?: boolean;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchable = false,
  multi = false,
  creatable = false,
  label,
  error,
  disabled = false,
  className = ''
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEscapeKey(() => setIsOpen(false));

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search
  const filteredOptions = debouncedSearch
    ? options.filter((option) =>
        option.label.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : options;

  // Handle option selection
  const handleSelect = (selectedValue: string) => {
    if (multi) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter((v) => v !== selectedValue)
        : [...currentValues, selectedValue];
      onChange(newValues);
    } else {
      onChange(selectedValue);
      setIsOpen(false);
    }
  };

  // Handle create new option
  const handleCreate = () => {
    if (creatable && searchQuery && !options.find((o) => o.value === searchQuery)) {
      if (multi) {
        const currentValues = Array.isArray(value) ? value : [];
        onChange([...currentValues, searchQuery]);
      } else {
        onChange(searchQuery);
        setIsOpen(false);
      }
      setSearchQuery('');
    }
  };

  // Get selected option(s) label
  const getSelectedLabel = () => {
    if (multi && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        return options.find((o) => o.value === value[0])?.label || value[0];
      }
      return `${value.length} selected`;
    }
    return options.find((o) => o.value === value)?.label || placeholder;
  };

  // Check if option is selected
  const isSelected = (optionValue: string) => {
    if (multi && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Select Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex w-full items-center justify-between rounded-lg border px-4 py-2 text-left transition-colors
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${isOpen ? 'border-primary ring-2 ring-primary/20' : ''}
          ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500' : 'bg-white hover:border-gray-400'}
        `}
      >
        <span className={`truncate ${!value || (Array.isArray(value) && value.length === 0) ? 'text-gray-500' : 'text-gray-900'}`}>
          {getSelectedLabel()}
        </span>
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownMenu}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
          >
            {/* Search Input */}
            {searchable && (
              <div className="border-b border-gray-200 p-2">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && creatable) {
                      handleCreate();
                    }
                  }}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-center text-sm text-gray-500">
                  {creatable && searchQuery ? (
                    <button
                      onClick={handleCreate}
                      className="w-full text-left text-primary hover:bg-primary/5"
                    >
                      Create "{searchQuery}"
                    </button>
                  ) : (
                    'No options found'
                  )}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    className={`
                      flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors
                      ${isSelected(option.value) ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}
                      ${option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    {multi && (
                      <div className={`h-4 w-4 flex-shrink-0 rounded border ${
                        isSelected(option.value) ? 'border-primary bg-primary' : 'border-gray-300'
                      }`}>
                        {isSelected(option.value) && (
                          <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    )}
                    {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                    <span className="flex-1">{option.label}</span>
                    {!multi && isSelected(option.value) && (
                      <svg className="h-5 w-5 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Create Option */}
            {creatable && searchQuery && !filteredOptions.find((o) => o.value === searchQuery) && filteredOptions.length > 0 && (
              <div className="border-t border-gray-200">
                <button
                  onClick={handleCreate}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-primary transition-colors hover:bg-primary/5"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create "{searchQuery}"
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
