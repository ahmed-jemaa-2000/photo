'use client';

import { Select } from '@/components/ui/Select';
import type { Category } from '@busi/types';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  selectedStatus: string;
  selectedStock: string;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onStockChange: (stock: string) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  selectedStatus,
  selectedStock,
  onCategoryChange,
  onStatusChange,
  onStockChange,
  onClearFilters
}: ProductFiltersProps) {
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({
      value: cat.id.toString(),
      label: cat.name
    }))
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'featured', label: 'Featured' }
  ];

  const stockOptions = [
    { value: '', label: 'All Stock Levels' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock (≤5)' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  const hasActiveFilters = selectedCategory || selectedStatus || selectedStock;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category Filter */}
      <Select
        options={categoryOptions}
        value={selectedCategory}
        onChange={onCategoryChange}
        placeholder="Filter by category"
        className="w-full sm:w-48"
      />

      {/* Status Filter */}
      <Select
        options={statusOptions}
        value={selectedStatus}
        onChange={onStatusChange}
        placeholder="Filter by status"
        className="w-full sm:w-48"
      />

      {/* Stock Filter */}
      <Select
        options={stockOptions}
        value={selectedStock}
        onChange={onStockChange}
        placeholder="Filter by stock"
        className="w-full sm:w-48"
      />

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear Filters
        </button>
      )}

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {[selectedCategory, selectedStatus, selectedStock].filter(Boolean).length} active
        </span>
      )}
    </div>
  );
}
