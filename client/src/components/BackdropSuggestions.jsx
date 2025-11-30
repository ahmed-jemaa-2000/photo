import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Display harmonious backdrop color suggestions based on extracted palette
 */
function BackdropSuggestions({
  suggestions,
  selectedBackdrop,
  onSelect,
  autoBackdrop,
  onToggleAuto
}) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-slate-200">Harmonious Backdrops</p>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={autoBackdrop}
            onChange={(e) => onToggleAuto(e.target.checked)}
            className="accent-primary"
          />
          Auto-match
        </label>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {suggestions.map((suggestion, index) => {
          const isSelected = selectedBackdrop?.hex === suggestion.hex;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(suggestion)}
              className={`group relative flex flex-col items-center gap-2 p-2 rounded-xl border transition ${
                isSelected
                  ? 'bg-primary/15 border-primary/50 shadow-primary/30 shadow'
                  : 'bg-white/5 border-white/10 hover:border-primary/40 hover:bg-white/10'
              }`}
              title={suggestion.description}
            >
              <div
                className="w-full aspect-square rounded-lg border border-white/20 shadow-inner transition-transform group-hover:scale-105"
                style={{ backgroundColor: suggestion.hex }}
              />

              {isSelected && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
              )}

              <div className="text-center w-full">
                <p className="text-xs font-medium text-slate-300 truncate">
                  {suggestion.name}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {suggestion.type}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedBackdrop && (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
          <div
            className="w-10 h-10 rounded-lg border-2 border-white/20 shadow-inner flex-shrink-0"
            style={{ backgroundColor: selectedBackdrop.hex }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200">{selectedBackdrop.name}</p>
            <p className="text-xs text-slate-400">{selectedBackdrop.description}</p>
          </div>
          <div className="text-xs text-slate-500 font-mono">{selectedBackdrop.hex}</div>
        </div>
      )}

      <p className="text-xs text-slate-500 pt-2">
        Suggestions based on color harmony theory (complementary, analogous, triadic, neutral)
      </p>
    </div>
  );
}

export default BackdropSuggestions;
