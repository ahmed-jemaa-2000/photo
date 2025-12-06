'use client';

import { useState } from 'react';
import type { ThemePreset } from '@/lib/constants/presets';

interface PresetFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  category: ThemePreset['category'] | 'all';
  style: ThemePreset['style'] | 'all';
  colorScheme: ThemePreset['colorScheme'] | 'all';
  search: string;
}

export default function PresetFilter({ onFilterChange }: PresetFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    style: 'all',
    colorScheme: 'all',
    search: '',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: FilterState = {
      category: 'all',
      style: 'all',
      colorScheme: 'all',
      search: '',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.style !== 'all' ||
    filters.colorScheme !== 'all' ||
    filters.search !== '';

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Search */}
      <div>
        <label htmlFor="search" className="mb-2 block text-sm font-medium text-gray-700">
          Search Themes
        </label>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            id="search"
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search by name, style, or use case..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid gap-3 md:grid-cols-3">
        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
            Industry
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Industries</option>
            <option value="fashion">👗 Fashion & Apparel</option>
            <option value="electronics">📱 Electronics & Tech</option>
            <option value="food">🍔 Food & Beverage</option>
            <option value="handmade">✋ Handmade & Crafts</option>
            <option value="beauty">💄 Beauty & Cosmetics</option>
            <option value="general">🏪 General</option>
          </select>
        </div>

        {/* Style Filter */}
        <div>
          <label htmlFor="style" className="mb-1 block text-sm font-medium text-gray-700">
            Style
          </label>
          <select
            id="style"
            value={filters.style}
            onChange={(e) => handleFilterChange('style', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Styles</option>
            <option value="minimal">Minimal</option>
            <option value="bold">Bold</option>
            <option value="elegant">Elegant</option>
            <option value="playful">Playful</option>
          </select>
        </div>

        {/* Color Scheme Filter */}
        <div>
          <label htmlFor="colorScheme" className="mb-1 block text-sm font-medium text-gray-700">
            Color Scheme
          </label>
          <select
            id="colorScheme"
            value={filters.colorScheme}
            onChange={(e) => handleFilterChange('colorScheme', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Colors</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="colorful">Colorful</option>
            <option value="monochrome">Monochrome</option>
          </select>
        </div>
      </div>

      {/* Active Filters & Clear */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <div className="flex flex-wrap gap-2">
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Industry: {filters.category}
                <button
                  onClick={() => handleFilterChange('category', 'all')}
                  className="rounded-full hover:bg-primary/20"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filters.style !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                Style: {filters.style}
                <button
                  onClick={() => handleFilterChange('style', 'all')}
                  className="rounded-full hover:bg-primary/20"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filters.colorScheme !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                Color: {filters.colorScheme}
                <button
                  onClick={() => handleFilterChange('colorScheme', 'all')}
                  className="rounded-full hover:bg-primary/20"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
          <button
            onClick={handleClearFilters}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
