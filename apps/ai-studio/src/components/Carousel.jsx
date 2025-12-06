import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable Carousel component with mobile swipe support
 * Features: prev/next navigation, index indicator, glass-morphism styling
 */
function Carousel({
  items = [],
  currentIndex = 0,
  onIndexChange,
  onSelect,
  renderItem,
  aspectRatio = '3/4',
  showControls = true,
  showIndicator = true,
  enableSwipe = true,
  glassEffect = true,
  animationDuration = 300,
  className = ''
}) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  if (!items || items.length === 0) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-slate-400">No items available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    onIndexChange?.(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    onIndexChange?.(newIndex);
  };

  const handleTouchStart = (e) => {
    if (!enableSwipe) return;
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!enableSwipe) return;
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!enableSwipe) return;

    const swipeThreshold = 75; // Minimum swipe distance in pixels

    if (touchStart - touchEnd > swipeThreshold) {
      // Swipe left → next
      goToNext();
    } else if (touchStart - touchEnd < -swipeThreshold) {
      // Swipe right → previous
      goToPrevious();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleSelect = () => {
    onSelect?.(items[currentIndex]);
  };

  const currentItem = items[currentIndex];

  return (
    <div className={`${glassEffect ? 'glass-panel' : ''} ${className}`}>
      <div className="relative">
        {/* Main carousel content */}
        <div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ aspectRatio }}
        >
          {/* Item display */}
          <div
            className="transition-all ease-in-out"
            style={{ transitionDuration: `${animationDuration}ms` }}
          >
            {renderItem ? renderItem(currentItem) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800">
                <p className="text-slate-400">No render function provided</p>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          {showControls && items.length > 1 && (
            <>
              {/* Previous button */}
              <button
                onClick={goToPrevious}
                className="
                  absolute left-2 top-1/2 -translate-y-1/2
                  p-2 rounded-full
                  bg-black/50 hover:bg-black/70
                  text-white
                  transition-all duration-200
                  backdrop-blur-sm
                  focus:outline-none focus:ring-2 focus:ring-primary
                  z-10
                "
                aria-label="Previous item"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next button */}
              <button
                onClick={goToNext}
                className="
                  absolute right-2 top-1/2 -translate-y-1/2
                  p-2 rounded-full
                  bg-black/50 hover:bg-black/70
                  text-white
                  transition-all duration-200
                  backdrop-blur-sm
                  focus:outline-none focus:ring-2 focus:ring-primary
                  z-10
                "
                aria-label="Next item"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Index indicator */}
          {showIndicator && items.length > 1 && (
            <div
              className="
                absolute top-4 right-4
                px-3 py-1 rounded-full
                bg-black/50 backdrop-blur-sm
                text-white text-sm font-medium
                z-10
              "
            >
              {currentIndex + 1} / {items.length}
            </div>
          )}
        </div>

        {/* Progress dots */}
        {items.length > 1 && items.length <= 10 && (
          <div className="flex justify-center gap-2 mt-4">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => onIndexChange?.(index)}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-slate-600 hover:bg-slate-500'
                  }
                `}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Select button (if onSelect provided) */}
        {onSelect && (
          <div className="mt-4">
            <button
              onClick={handleSelect}
              className="
                w-full py-3 rounded-xl
                bg-primary hover:bg-primary-dark
                text-white font-semibold
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              "
            >
              Select This
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carousel;
