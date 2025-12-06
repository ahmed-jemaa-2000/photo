'use client';

import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { Category } from '@busi/types';

interface StepBasicInfoProps {
  categories: Category[];
}

export default function StepBasicInfo({ categories }: StepBasicInfoProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const name = watch('name');
  const price = watch('price');
  const oldPrice = watch('oldPrice');

  // Auto-generate slug from name
  useEffect(() => {
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  }, [name, setValue]);

  // Calculate savings percentage
  const savingsPercent = oldPrice && price && oldPrice > price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
        <p className="mt-1 text-sm text-gray-600">
          Start with the essentials - name, description, pricing, and category.
        </p>
      </div>

      {/* Product Name */}
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`w-full rounded-lg border px-4 py-2.5 text-base transition-colors focus:outline-none focus:ring-2 ${
            errors.name
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-primary focus:ring-primary/20'
          }`}
          placeholder="e.g., Premium Cotton T-Shirt"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
        )}
      </div>

      {/* Auto-generated Slug Preview */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Product URL Slug
        </label>
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
          <p className="text-sm text-gray-600">
            <span className="text-gray-400">yourstore.com/product/</span>
            <span className="font-mono font-semibold text-gray-900">{watch('slug') || 'auto-generated'}</span>
          </p>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Automatically generated from product name. This will be the URL for your product.
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Describe your product in detail. Highlight key features, materials, and benefits..."
        />
        <p className="mt-1 text-xs text-gray-500">
          A detailed description helps customers make informed decisions.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Price */}
        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
            Price (TND) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="price"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className={`w-full rounded-lg border px-4 py-2.5 pr-12 transition-colors focus:outline-none focus:ring-2 ${
                errors.price
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:border-primary focus:ring-primary/20'
              }`}
              placeholder="0.00"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-sm text-gray-500">
              TND
            </span>
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message as string}</p>
          )}
        </div>

        {/* Compare At Price */}
        <div>
          <label htmlFor="oldPrice" className="mb-1 block text-sm font-medium text-gray-700">
            Compare At Price (TND)
          </label>
          <div className="relative">
            <input
              id="oldPrice"
              type="number"
              step="0.01"
              {...register('oldPrice', { valueAsNumber: true })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-12 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="0.00"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-sm text-gray-500">
              TND
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Original price before discount. Leave empty if not on sale.
          </p>
        </div>
      </div>

      {/* Savings Calculator */}
      {savingsPercent > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900">
                {savingsPercent}% Savings
              </p>
              <p className="text-xs text-green-700">
                Customers save {(oldPrice - price).toFixed(2)} TND
              </p>
            </div>
            <div className="rounded-full bg-green-600 px-3 py-1 text-sm font-bold text-white">
              -{savingsPercent}%
            </div>
          </div>
        </div>
      )}

      {/* Category */}
      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          {...register('category', { valueAsNumber: true })}
          className={`w-full rounded-lg border px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 ${
            errors.category
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-primary focus:ring-primary/20'
          }`}
        >
          <option value={0}>Select a category...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message as string}</p>
        )}

        {!showCategoryForm && (
          <button
            type="button"
            onClick={() => setShowCategoryForm(true)}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            + Create new category
          </button>
        )}

        {/* Quick Category Create */}
        {showCategoryForm && (
          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="mb-2 text-sm font-medium text-blue-900">Create New Category</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 rounded-lg border border-blue-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => {
                  // TODO: Implement category creation
                  console.log('Create category:', newCategoryName);
                  setShowCategoryForm(false);
                  setNewCategoryName('');
                }}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCategoryForm(false);
                  setNewCategoryName('');
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-semibold">Quick Tips:</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5 text-blue-700">
              <li>Use clear, descriptive product names that include key features</li>
              <li>Add compare at price to show discounts and increase perceived value</li>
              <li>Choose the most relevant category to help customers find your product</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
