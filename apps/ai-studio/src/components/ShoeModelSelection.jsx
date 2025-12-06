import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useConfig, getShoeModelsByGender } from '../hooks/useConfig';

/**
 * ShoeModelSelection - Grid layout for choosing leg/outfit reference for shoe photography
 */
function ShoeModelSelection({ selectedShoeModel, onShoeModelSelect, gender = null }) {
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
      <div className="glass-panel p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-slate-400">Loading shoe models...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-red-400">Error loading shoe models: {error}</p>
      </div>
    );
  }

  const currentGender = activeTab === 'Men' ? 'male' : 'female';
  const shoeModels = getShoeModelsByGender(config, currentGender);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('Women')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'Women'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Women
          </button>
          <button
            onClick={() => setActiveTab('Men')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'Men'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Men
          </button>
        </div>

        <div className="text-sm text-slate-500">
          Select outfit style for shoes
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shoeModels.map((shoeModel) => (
          <div key={shoeModel.id} className="group relative">
            <button
              onClick={() => onShoeModelSelect(shoeModel)}
              className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300 ${
                selectedShoeModel?.id === shoeModel.id
                  ? 'ring-4 ring-slate-900 ring-offset-2 ring-offset-white scale-[1.02]'
                  : 'hover:scale-[1.02] hover:shadow-xl'
              }`}
            >
              <img
                src={`${apiUrl}${shoeModel.previewUrl}`}
                alt={shoeModel.name.en}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x600.png?text=' + encodeURIComponent(shoeModel.name.en);
                }}
              />

              {/* Selected Indicator */}
              {selectedShoeModel?.id === shoeModel.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-slate-900" />
                </div>
              )}
            </button>

            {/* Info */}
            <div className="mt-3 px-1">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-900 text-sm">{shoeModel.name.en}</h4>
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded-md capitalize">
                  {shoeModel.outfitStyle}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {shoeModels.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No shoe models available for {currentGender === 'male' ? 'men' : 'women'}.</p>
          <p className="text-sm mt-2">Please add leg reference images to the server assets.</p>
        </div>
      )}
    </div>
  );
}

export default ShoeModelSelection;
