import React, { useState } from 'react';
import { User, Filter, Check } from 'lucide-react';
import { useConfig, getModelsByGender } from '../hooks/useConfig';
import { ModelGridSkeleton, TabBarSkeleton } from './Skeleton';

/**
 * ModelSelection - Grid layout for choosing pre-defined Tunisian models
 */
function ModelSelection({ selectedModel, onModelSelect, gender = null }) {
  const { config, loading, error } = useConfig();
  const [activeTab, setActiveTab] = useState(gender === 'male' ? 'Men' : 'Women');

  // Sync active tab with gender prop if it changes
  React.useEffect(() => {
    if (gender) {
      setActiveTab(gender === 'male' ? 'Men' : 'Women');
    }
  }, [gender]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Tab skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabBarSkeleton count={2} />
          <div className="animate-pulse bg-white/10 rounded-lg w-24 h-10" />
        </div>
        {/* Grid skeleton */}
        <ModelGridSkeleton count={6} cols={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-red-400">Error loading models: {error}</p>
      </div>
    );
  }

  const currentGender = activeTab === 'Men' ? 'male' : 'female';
  const models = getModelsByGender(config?.models, currentGender);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('Women')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'Women'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Women
          </button>
          <button
            onClick={() => setActiveTab('Men')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'Men'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Men
          </button>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {models.map((model) => (
          <div key={model.id} className="group relative">
            <button
              onClick={() => onModelSelect(model)}
              className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300 ${selectedModel?.id === model.id
                ? 'ring-4 ring-slate-900 ring-offset-2 ring-offset-white scale-[1.02]'
                : 'hover:scale-[1.02] hover:shadow-xl'
                }`}
            >
              <img
                src={`${apiUrl}${model.previewUrl}`}
                alt={model.name.en}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x600.png?text=' + encodeURIComponent(model.name.en);
                }}
              />

              {/* Selected Indicator */}
              {selectedModel?.id === model.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-slate-900" />
                </div>
              )}
            </button>

            {/* Info */}
            <div className="mt-3 px-1">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-900">{model.name.en}</h4>
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                  {model.ageRange || '20-25'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelSelection;
