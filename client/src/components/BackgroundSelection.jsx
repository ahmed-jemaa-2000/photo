import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import Carousel from './Carousel';
import { useConfig } from '../hooks/useConfig';

/**
 * BackgroundSelection - Visual carousel for choosing Tunisian locations
 * Displays 6 background options with preview images
 */
function BackgroundSelection({ selectedBackground, onBackgroundSelect }) {
  const { config, loading, error } = useConfig();
  const [currentIndex, setCurrentIndex] = useState(0);

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
        <p className="text-slate-500 text-sm mt-2">Using fallback mode</p>
      </div>
    );
  }

  const backgrounds = config?.backgrounds || [];

  if (backgrounds.length === 0) {
    return (
      <div className="glass-panel p-8 text-center">
        <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">No backgrounds available</p>
      </div>
    );
  }

  const handleBackgroundSelect = (background) => {
    onBackgroundSelect(background);
  };

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-200 flex items-center justify-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          Choose Your Location
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Iconic Tunisian backdrops for your photoshoot
        </p>
      </div>

      {/* Carousel */}
      <Carousel
        items={backgrounds}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        onSelect={handleBackgroundSelect}
        aspectRatio="16/9"
        showControls={true}
        showIndicator={true}
        enableSwipe={true}
        glassEffect={true}
        renderItem={(background) => (
          <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden">
            {/* Background preview image */}
            <img
              src={`${apiUrl}${background.previewUrl}`}
              alt={background.name.en}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.src = 'https://placehold.co/1600x900.png?text=' + encodeURIComponent(background.name.en);
              }}
            />

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Background info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h4 className="text-2xl font-bold text-white">
                  {background.name.en}
                </h4>
              </div>

              <p className="text-sm text-slate-300 line-clamp-2">
                {background.description?.en || background.prompt.split('.')[0]}
              </p>

              {/* Location tag */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  Tunisia
                </span>
              </div>
            </div>

            {/* Selected indicator */}
            {selectedBackground?.id === background.id && (
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

      {/* Selected background summary */}
      {selectedBackground && (
        <div className="glass-panel p-4 border-2 border-primary/30">
          <div className="flex items-center gap-3">
            <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={`${apiUrl}${selectedBackground.previewUrl}`}
                alt={selectedBackground.name.en}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/1600x900.png?text=' + encodeURIComponent(selectedBackground.name.en);
                }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-400">Selected Location:</p>
              <p className="font-semibold text-slate-200">
                {selectedBackground.name.en}
              </p>
            </div>
            <button
              onClick={() => onBackgroundSelect(null)}
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

export default BackgroundSelection;
