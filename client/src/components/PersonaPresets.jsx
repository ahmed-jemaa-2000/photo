import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Quick-select persona presets for common model types
 */
function PersonaPresets({ onSelectPreset }) {
  const presets = [
    {
      name: 'Classic Editorial',
      description: 'Traditional fashion magazine look',
      persona: {
        gender: 'female',
        ageRange: 'young-adult',
        ethnicity: 'any',
        skinTone: 'medium',
        hairStyle: 'long',
        hairColor: 'brown',
        bodyType: 'slim',
      },
    },
    {
      name: 'Streetwear Vibe',
      description: 'Urban, contemporary style',
      persona: {
        gender: 'male',
        ageRange: 'young-adult',
        ethnicity: 'any',
        skinTone: 'medium',
        hairStyle: 'short',
        hairColor: 'black',
        bodyType: 'athletic',
      },
    },
    {
      name: 'Mature Elegance',
      description: 'Sophisticated, timeless appeal',
      persona: {
        gender: 'female',
        ageRange: 'mature',
        ethnicity: 'any',
        skinTone: 'light',
        hairStyle: 'medium',
        hairColor: 'gray',
        bodyType: 'average',
      },
    },
    {
      name: 'Inclusive Campaign',
      description: 'Diverse representation',
      persona: {
        gender: 'non-binary',
        ageRange: 'adult',
        ethnicity: 'mixed',
        skinTone: 'tan',
        hairStyle: 'curly',
        hairColor: 'black',
        bodyType: 'curvy',
      },
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <p className="text-sm font-semibold text-slate-200">Quick Presets</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {presets.map((preset, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectPreset(preset.persona)}
            className="group text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition"
          >
            <div className="font-semibold text-slate-200 group-hover:text-primary transition mb-1">
              {preset.name}
            </div>
            <div className="text-xs text-slate-400">{preset.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PersonaPresets;
