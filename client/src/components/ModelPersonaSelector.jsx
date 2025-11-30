import React, { useState } from 'react';
import { User, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Comprehensive model diversity and appearance controls
 */
function ModelPersonaSelector({ modelPersona, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updatePersona = (field, value) => {
    onChange({ ...modelPersona, [field]: value });
  };

  const genderOptions = [
    { value: 'female', label: 'Woman' },
    { value: 'male', label: 'Man' },
    { value: 'non-binary', label: 'Non-binary' },
  ];

  const ageOptions = [
    { value: 'young-adult', label: '20s', description: 'Young adult' },
    { value: 'adult', label: '30s', description: 'Adult' },
    { value: 'mature', label: '40s-50s', description: 'Mature' },
    { value: 'senior', label: '60s+', description: 'Senior' },
  ];

  const ethnicityOptions = [
    { value: 'any', label: 'Any' },
    { value: 'asian', label: 'East Asian' },
    { value: 'south-asian', label: 'South Asian' },
    { value: 'black', label: 'Black' },
    { value: 'caucasian', label: 'Caucasian' },
    { value: 'hispanic', label: 'Hispanic/Latino' },
    { value: 'middle-eastern', label: 'Middle Eastern' },
    { value: 'tunisian', label: 'Tunisian' },
    { value: 'mixed', label: 'Mixed' },

  ];

  const skinToneOptions = [
    { value: 'fair', label: 'Fair', color: '#FFE0D1' },
    { value: 'light', label: 'Light', color: '#F5D5C0' },
    { value: 'medium', label: 'Medium', color: '#D9A577' },
    { value: 'tan', label: 'Tan', color: '#C68A5C' },
    { value: 'deep', label: 'Deep', color: '#8D5524' },
    { value: 'rich', label: 'Rich', color: '#5C3317' },
  ];

  const hairStyleOptions = [
    { value: 'short', label: 'Short' },
    { value: 'medium', label: 'Medium' },
    { value: 'long', label: 'Long' },
    { value: 'curly', label: 'Curly' },
    { value: 'straight', label: 'Straight' },
    { value: 'wavy', label: 'Wavy' },
    { value: 'braided', label: 'Braided' },
    { value: 'updo', label: 'Updo' },
  ];

  const hairColorOptions = [
    { value: 'black', label: 'Black', color: '#1A1A1A' },
    { value: 'brown', label: 'Brown', color: '#4A2511' },
    { value: 'blonde', label: 'Blonde', color: '#F0E68C' },
    { value: 'red', label: 'Red', color: '#A0522D' },
    { value: 'gray', label: 'Gray', color: '#B0B0B0' },
    { value: 'colorful', label: 'Colorful', color: 'linear-gradient(90deg, #ff0080, #7928ca, #00d4ff)' },
  ];

  const bodyTypeOptions = [
    { value: 'slim', label: 'Slim' },
    { value: 'athletic', label: 'Athletic' },
    { value: 'average', label: 'Average' },
    { value: 'curvy', label: 'Curvy' },
    { value: 'plus-size', label: 'Plus-size' },
  ];

  return (
    <div className="glass-panel p-5 space-y-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary border border-primary/30">
            <User className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-xs uppercase tracking-wide text-slate-400">Model Appearance</p>
            <p className="text-lg font-semibold">Customize Model Diversity</p>
          </div>
        </div>
        <div className="text-primary">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-white/10">
          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Gender</label>
            <div className="flex flex-wrap gap-2">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updatePersona('gender', option.value)}
                  className={`px-4 py-2 rounded-full text-sm border transition ${modelPersona.gender === option.value
                      ? 'bg-primary/20 border-primary/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-primary/40'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Age Range</label>
            <div className="grid grid-cols-4 gap-2">
              {ageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updatePersona('ageRange', option.value)}
                  className={`px-3 py-3 rounded-xl text-sm border transition ${modelPersona.ageRange === option.value
                      ? 'bg-primary/15 border-primary/50 text-white shadow-primary/30 shadow'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-primary/40'
                    }`}
                >
                  <div className="font-bold">{option.label}</div>
                  <div className="text-xs text-slate-400">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Ethnicity */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Ethnicity/Representation</label>
            <select
              value={modelPersona.ethnicity}
              onChange={(e) => updatePersona('ethnicity', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition"
            >
              {ethnicityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Skin Tone */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Skin Tone</label>
            <div className="grid grid-cols-6 gap-2">
              {skinToneOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updatePersona('skinTone', option.value)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition ${modelPersona.skinTone === option.value
                      ? 'bg-primary/15 border-primary/50 shadow-primary/30 shadow'
                      : 'bg-white/5 border-white/10 hover:border-primary/40'
                    }`}
                  title={option.label}
                >
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-xs text-slate-300">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Hair Style</label>
            <div className="grid grid-cols-4 gap-2">
              {hairStyleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updatePersona('hairStyle', option.value)}
                  className={`px-3 py-2 rounded-xl text-sm border transition ${modelPersona.hairStyle === option.value
                      ? 'bg-primary/15 border-primary/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-primary/40'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Color */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Hair Color</label>
            <div className="grid grid-cols-6 gap-2">
              {hairColorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updatePersona('hairColor', option.value)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition ${modelPersona.hairColor === option.value
                      ? 'bg-primary/15 border-primary/50 shadow-primary/30 shadow'
                      : 'bg-white/5 border-white/10 hover:border-primary/40'
                    }`}
                  title={option.label}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ background: option.color }}
                  />
                  <span className="text-xs text-slate-300">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Body Type */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Body Type</label>
            <div className="grid grid-cols-5 gap-2">
              {bodyTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updatePersona('bodyType', option.value)}
                  className={`px-3 py-2 rounded-xl text-sm border transition ${modelPersona.bodyType === option.value
                      ? 'bg-primary/15 border-primary/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:border-primary/40'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-slate-400">
              These attributes will guide the AI to generate diverse, representative model imagery while preserving exact garment details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelPersonaSelector;
