import React from 'react';
import { Shirt, Footprints } from 'lucide-react';

/**
 * CategorySelector - Choose between Clothes or Shoes
 * Different categories have different pose options
 */
function CategorySelector({ category, onCategoryChange }) {
  const categories = [
    {
      id: 'clothes',
      label: 'Clothes',
      icon: Shirt,
      description: 'T-shirts, dresses, jackets, etc.',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'shoes',
      label: 'Shoes',
      icon: Footprints,
      description: 'Sneakers, boots, sandals, etc.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="glass-panel p-5 space-y-3">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-200">
          What are you modeling?
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Choose the category to get appropriate pose options
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = category === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-300
                ${
                  isSelected
                    ? 'border-primary bg-primary/10 scale-105'
                    : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                }
              `}
            >
              {/* Gradient background for selected */}
              {isSelected && (
                <div
                  className={`
                    absolute inset-0 rounded-xl opacity-10
                    bg-gradient-to-br ${cat.color}
                  `}
                />
              )}

              {/* Content */}
              <div className="relative space-y-3">
                <div className="flex justify-center">
                  <Icon
                    className={`
                      w-12 h-12 transition-colors
                      ${isSelected ? 'text-primary' : 'text-slate-400'}
                    `}
                  />
                </div>

                <div className="text-center">
                  <h4
                    className={`
                      text-lg font-semibold
                      ${isSelected ? 'text-primary' : 'text-slate-200'}
                    `}
                  >
                    {cat.label}
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">
                    {cat.description}
                  </p>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="flex justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategorySelector;
