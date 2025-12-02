import React, { useState } from 'react';
import { User } from 'lucide-react';
import Carousel from './Carousel';
import { useConfig, getModelsByGender } from '../hooks/useConfig';

/**
 * ModelSelection - Visual carousel for choosing pre-defined Tunisian models
 * Displays 11 models with preview images, filtered by gender
 */
function ModelSelection({ selectedModel, onModelSelect, gender = null }) {
  const { config, loading, error } = useConfig();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return (
      <div className="glass-panel p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-slate-400">Loading models...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-red-400">Error loading models: {error}</p>
        <p className="text-slate-500 text-sm mt-2">Using fallback mode</p>
      </div>
    );
  }

  const models = getModelsByGender(config?.models, gender);

  if (!models || models.length === 0) {
    return (
      <div className="glass-panel p-8 text-center">
        <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">No models available</p>
      </div>
    );
  }

  const handleModelSelect = (model) => {
    onModelSelect(model);
  };

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-200 flex items-center justify-center gap-2">
          <User className="w-6 h-6 text-primary" />
          Choose Your Model
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          {gender ? `Showing ${gender} models` : 'All Tunisian models'}
        </p>
      </div>

      {/* Carousel */}
      <Carousel
        items={models}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        onSelect={handleModelSelect}
        aspectRatio="3/4"
        showControls={true}
        showIndicator={true}
        enableSwipe={true}
        glassEffect={true}
        renderItem={(model) => (
          <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden">
            {/* Model preview image */}
            <img
              src={`${apiUrl}${model.previewUrl}`}
              alt={model.name.en}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.src = 'https://placehold.co/400x600.png?text=' + encodeURIComponent(model.name.en);
              }}
            />

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Model info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
              <h4 className="text-2xl font-bold text-white">
                {model.name.en}
              </h4>

              <p className="text-sm text-slate-300 font-medium">
                {model.style.en}
              </p>

              <p className="text-xs text-slate-400 line-clamp-2">
                {model.description}
              </p>

              {/* Model attributes */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  {model.ethnicity}
                </span>
                <span className="px-2 py-1 rounded-full bg-slate-700/50 text-slate-300 text-xs">
                  {model.gender}
                </span>
              </div>
            </div>

            {/* Selected indicator */}
            {selectedModel?.id === model.id && (
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Selected
                </div>
              </div>
            )}
          </div>
        )}
      />

      {/* Selected model summary */}
      {selectedModel && (
        <div className="glass-panel p-4 border-2 border-primary/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={`${apiUrl}${selectedModel.previewUrl}`}
                alt={selectedModel.name.en}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x600.png?text=' + encodeURIComponent(selectedModel.name.en);
                }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-400">Selected Model:</p>
              <p className="font-semibold text-slate-200">
                {selectedModel.name.en}
              </p>
              <p className="text-xs text-slate-500">
                {selectedModel.style.en}
              </p>
            </div>
            <button
              onClick={() => onModelSelect(null)}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelSelection;
