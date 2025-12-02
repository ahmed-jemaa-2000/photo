import React from 'react';
import { MapPin, Check } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';

/**
 * BackgroundSelection - Grid layout for choosing Tunisian locations
 */
function BackgroundSelection({ selectedBackground, onBackgroundSelect }) {
  const { config, loading, error } = useConfig();

  if (loading) {
    return (
      <div className="glass-panel p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-slate-400">Loading backgrounds...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-red-400">Error loading backgrounds: {error}</p>
      </div>
    );
  }

  const backgrounds = config?.backgrounds || [];
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  if (backgrounds.length === 0) {
    return (
      <div className="glass-panel p-8 text-center">
        <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">No backgrounds available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-200">
          Choose Background
        </h3>
        <span className="text-sm text-slate-400">
          {backgrounds.length} locations available
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {backgrounds.map((background) => (
          <div key={background.id} className="group relative">
            <button
              onClick={() => onBackgroundSelect(background)}
              className={`relative w-full aspect-video rounded-2xl overflow-hidden transition-all duration-300 ${selectedBackground?.id === background.id
                  ? 'ring-4 ring-slate-900 ring-offset-2 ring-offset-white scale-[1.02]'
                  : 'hover:scale-[1.02] hover:shadow-xl'
                }`}
            >
              <img
                src={`${apiUrl}${background.previewUrl}`}
                alt={background.name.en}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/1600x900.png?text=' + encodeURIComponent(background.name.en);
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Selected Indicator */}
              {selectedBackground?.id === background.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-slate-900" />
                </div>
              )}

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-white font-bold text-lg drop-shadow-md text-left">
                  {background.name.en}
                </h4>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BackgroundSelection;
