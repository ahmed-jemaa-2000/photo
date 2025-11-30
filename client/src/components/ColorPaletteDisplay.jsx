import React from 'react';
import { Palette } from 'lucide-react';

/**
 * Display extracted color palette from garment image
 */
function ColorPaletteDisplay({ palette }) {
  if (!palette || palette.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-primary" />
        <p className="text-sm font-semibold text-slate-200">Extracted Color Palette</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {palette.map((color, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div
              className="w-full aspect-square rounded-xl border-2 border-white/20 shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: color.hex }}
              title={`${color.name || color.hex} - ${color.percentage}%`}
            />
            <div className="text-center">
              <p className="text-xs font-medium text-slate-300 truncate w-full">
                {color.simpleName || color.name || 'Color'}
              </p>
              <p className="text-xs text-slate-500">{color.percentage}%</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-white/10">
        <p className="text-xs text-slate-400">
          These colors will be used to generate harmonious backdrop suggestions
        </p>
      </div>
    </div>
  );
}

export default ColorPaletteDisplay;
