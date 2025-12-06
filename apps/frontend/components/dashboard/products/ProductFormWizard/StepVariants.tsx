'use client';

import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerItem } from '@/lib/animations';

interface Variant {
  id: string;
  name: string;
  options: string[];
}

interface VariantCombination {
  id: string;
  attributes: Record<string, string>;
  sku: string;
  stock: number;
  price?: number;
}

export default function StepVariants() {
  const { watch, setValue } = useFormContext();
  const [variants, setVariants] = useState<Variant[]>([
    { id: '1', name: 'Size', options: [] },
  ]);
  const [combinations, setCombinations] = useState<VariantCombination[]>([]);
  const [newOption, setNewOption] = useState<Record<string, string>>({});
  const [trackInventory, setTrackInventory] = useState(true);

  const basePrice = watch('price') || 0;
  const baseSku = watch('sku') || '';

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now().toString(),
        name: '',
        options: [],
      },
    ]);
  };

  const updateVariantName = (id: string, name: string) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, name } : v)));
  };

  const addOption = (variantId: string) => {
    const option = newOption[variantId];
    if (!option || !option.trim()) return;

    setVariants(
      variants.map((v) =>
        v.id === variantId ? { ...v, options: [...v.options, option.trim()] } : v
      )
    );
    setNewOption({ ...newOption, [variantId]: '' });

    // Regenerate combinations
    generateCombinations();
  };

  const removeOption = (variantId: string, option: string) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId ? { ...v, options: v.options.filter((o) => o !== option) } : v
      )
    );
    generateCombinations();
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
    generateCombinations();
  };

  const generateCombinations = () => {
    const validVariants = variants.filter((v) => v.name && v.options.length > 0);
    if (validVariants.length === 0) {
      setCombinations([]);
      return;
    }

    const generate = (index: number, current: Record<string, string>): VariantCombination[] => {
      if (index === validVariants.length) {
        const attrs = Object.entries(current)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        return [
          {
            id: Date.now().toString() + Math.random(),
            attributes: current,
            sku: `${baseSku}-${Object.values(current).join('-')}`.toUpperCase(),
            stock: 0,
            price: basePrice,
          },
        ];
      }

      const variant = validVariants[index];
      return variant.options.flatMap((option) =>
        generate(index + 1, { ...current, [variant.name]: option })
      );
    };

    setCombinations(generate(0, {}));
  };

  const updateCombination = (id: string, field: string, value: any) => {
    setCombinations(
      combinations.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const bulkUpdateStock = (value: number) => {
    setCombinations(combinations.map((c) => ({ ...c, stock: value })));
  };

  const bulkUpdatePrice = (value: number) => {
    setCombinations(combinations.map((c) => ({ ...c, price: value })));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Variants & Inventory</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add product variants like sizes and colors, then manage inventory for each option.
        </p>
      </div>

      {/* Simple Inventory (No Variants) */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Track inventory</p>
            <p className="text-xs text-gray-500">Enable if you want to track stock levels</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={trackInventory}
              onChange={(e) => setTrackInventory(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
          </label>
        </div>

        {trackInventory && variants.length === 1 && variants[0].options.length === 0 && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                value={watch('sku') || ''}
                onChange={(e) => setValue('sku', e.target.value)}
                placeholder="e.g., TSH-BLU-M"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <input
                type="number"
                value={watch('stock') || 0}
                onChange={(e) => setValue('stock', parseInt(e.target.value) || 0)}
                min="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* Variants Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product Options</h3>
            <p className="text-xs text-gray-500">Add variants like Size, Color, Material</p>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Option
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((variant, variantIndex) => (
            <motion.div
              key={variant.id}
              variants={staggerItem}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-start gap-3">
                <input
                  type="text"
                  value={variant.name}
                  onChange={(e) => updateVariantName(variant.id, e.target.value)}
                  placeholder="Option name (e.g., Size, Color)"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Option Values */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <span
                      key={option}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200"
                    >
                      {option}
                      <button
                        type="button"
                        onClick={() => removeOption(variant.id, option)}
                        className="rounded-full p-0.5 hover:bg-gray-100"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Option Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOption[variant.id] || ''}
                    onChange={(e) => setNewOption({ ...newOption, [variant.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addOption(variant.id);
                      }
                    }}
                    placeholder={`Add ${variant.name || 'option'} (e.g., Small, Medium, Large)`}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => addOption(variant.id)}
                    className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {variants.length === 1 && variants[0].options.length === 0 && (
          <p className="mt-3 text-center text-sm text-gray-500">
            Add options to create product variants
          </p>
        )}
      </div>

      {/* Variant Combinations Table */}
      {combinations.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Variant Inventory ({combinations.length} variants)
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const value = prompt('Set stock for all variants:');
                  if (value) bulkUpdateStock(parseInt(value));
                }}
                className="text-xs text-primary hover:underline"
              >
                Bulk Update Stock
              </button>
              <button
                type="button"
                onClick={() => {
                  const value = prompt('Set price for all variants:');
                  if (value) bulkUpdatePrice(parseFloat(value));
                }}
                className="text-xs text-primary hover:underline"
              >
                Bulk Update Price
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Variant</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">SKU</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Price</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {combinations.map((combo) => (
                  <tr key={combo.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <span className="font-medium text-gray-900">
                        {Object.entries(combo.attributes)
                          .map(([k, v]) => `${v}`)
                          .join(' / ')}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={combo.sku}
                        onChange={(e) => updateCombination(combo.id, 'sku', e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        value={combo.price || basePrice}
                        onChange={(e) => updateCombination(combo.id, 'price', parseFloat(e.target.value))}
                        step="0.01"
                        className="w-20 rounded border border-gray-300 px-2 py-1 text-xs"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        value={combo.stock}
                        onChange={(e) => updateCombination(combo.id, 'stock', parseInt(e.target.value))}
                        min="0"
                        className="w-20 rounded border border-gray-300 px-2 py-1 text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-semibold">Inventory Tips:</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5 text-blue-700">
              <li>SKUs help you track products in your inventory system</li>
              <li>Set stock to 0 for made-to-order products</li>
              <li>Use bulk update for consistent pricing across variants</li>
              <li>Different variants can have different prices (e.g., larger sizes cost more)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
