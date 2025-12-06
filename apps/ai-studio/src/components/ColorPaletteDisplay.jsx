import React from 'react';
import { Palette } from 'lucide-react';
import { getColorEmoji, assessColorConfidence, getConfidenceMessage } from '../utils/colorEmoji';

/**
 * Display extracted color palette from garment image with emojis and confidence
 */
function ColorPaletteDisplay({ palette }) {
  if (!palette || palette.length === 0) {
    return null;
  }

  const confidence = assessColorConfidence(palette);
  const confidenceMsg = getConfidenceMessage(confidence, palette, 'en');

  return (
    <div className="glass-panel p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <p className="text-sm font-semibold text-slate-200">Extracted Color Palette</p>
        </div>
        {/* Confidence badge */}
        <div className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${confidence === 'high' ? 'bg-green-500/20 text-green-400' : ''}
          ${confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
          ${confidence === 'low' ? 'bg-orange-500/20 text-orange-400' : ''}
        `}>
          {confidence.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {palette.map((color, index) => {
          const emoji = getColorEmoji(color.hex);
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="relative">
                <div
                  className="w-full aspect-square rounded-xl border-2 border-white/20 shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name || color.hex} - ${color.percentage}%`}
                />
                {/* Emoji overlay */}
                <div className="absolute -top-1 -right-1 text-xl bg-slate-900/80 rounded-full w-7 h-7 flex items-center justify-center border border-white/20">
                  {emoji}
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-slate-300 truncate w-full">
                  {color.simpleName || color.name || 'Color'}
                </p>
                <p className="text-xs text-slate-500">{color.percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confidence message */}
      <div className="pt-2 border-t border-white/10">
        <p className="text-xs text-slate-300 font-medium mb-1">
          {confidenceMsg}
        </p>
        <p className="text-xs text-slate-400">
          These colors will be used to generate harmonious backdrop suggestions
        </p>
      </div>
    </div>
  );
}

export default ColorPaletteDisplay;
