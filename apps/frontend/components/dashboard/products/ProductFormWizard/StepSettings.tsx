'use client';

import { useFormContext } from 'react-hook-form';
import { useState } from 'react';

export default function StepSettings() {
  const { register, watch, setValue } = useFormContext();
  const [tagInput, setTagInput] = useState('');
  const tags = watch('tags') || [];
  const seoTitle = watch('seoTitle') || '';
  const seoDescription = watch('seoDescription') || '';
  const productName = watch('name') || '';

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setValue('tags', [...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setValue(
      'tags',
      tags.filter((t: string) => t !== tag)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings & SEO</h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure product visibility, status, and search engine optimization.
        </p>
      </div>

      {/* Status & Visibility */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Status & Visibility</h3>

        <div className="space-y-4">
          {/* Product Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Product Status</label>
            <div className="flex gap-4">
              <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  {...register('isActive')}
                  value="true"
                  defaultChecked
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-semibold text-gray-900">Active</span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-600">Visible in your storefront</p>
                </div>
              </label>

              <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  {...register('isActive')}
                  value="false"
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                    <span className="font-semibold text-gray-900">Draft</span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-600">Hidden from storefront</p>
                </div>
              </label>
            </div>
          </div>

          {/* Featured Product */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register('isFeatured')}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Featured Product</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                    ⭐ Special
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Display this product prominently on your homepage and featured collections
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Product Tags</h3>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Add Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="e.g., summer, sale, trending"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-lg bg-primary px-5 py-2 font-semibold text-white hover:bg-primary/90"
              >
                Add
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Tags help organize products and improve searchability
            </p>
          </div>

          {/* Tag List */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full p-0.5 hover:bg-primary/20"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEO Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">Search Engine Optimization</h3>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
            Recommended
          </span>
        </div>

        <div className="space-y-4">
          {/* SEO Title */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
                SEO Title
              </label>
              <span className={`text-xs ${seoTitle.length > 60 ? 'text-red-600' : 'text-gray-500'}`}>
                {seoTitle.length}/60
              </span>
            </div>
            <input
              id="seoTitle"
              type="text"
              {...register('seoTitle')}
              placeholder={productName || 'Product title for search engines'}
              maxLength={60}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-gray-500">
              Appears in search engine results. Keep it under 60 characters for best results.
            </p>
          </div>

          {/* SEO Description */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
                SEO Description
              </label>
              <span className={`text-xs ${seoDescription.length > 160 ? 'text-red-600' : 'text-gray-500'}`}>
                {seoDescription.length}/160
              </span>
            </div>
            <textarea
              id="seoDescription"
              {...register('seoDescription')}
              rows={3}
              maxLength={160}
              placeholder="A concise description of your product for search engines..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-gray-500">
              Shown in search results below the title. Keep it under 160 characters.
            </p>
          </div>

          {/* SEO Preview */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Google Preview
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-xs text-gray-600">yourstore.com/product/...</span>
              </div>
              <h4 className="text-lg font-medium text-blue-600">
                {seoTitle || productName || 'Your Product Title'}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {seoDescription || 'Your product description will appear here in search results...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 text-sm text-green-900">
            <p className="font-semibold">SEO Best Practices:</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5 text-green-700">
              <li>Include relevant keywords in your SEO title and description</li>
              <li>Make titles compelling to encourage clicks from search results</li>
              <li>Use unique descriptions for each product (avoid duplicates)</li>
              <li>Add tags for better internal search and product discovery</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Publishing Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Ready to publish?</span> Click "Save Product" to make your product live on your storefront.
          </p>
        </div>
      </div>
    </div>
  );
}
