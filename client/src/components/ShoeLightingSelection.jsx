import React from 'react';
import { Sun, Lightbulb, Sparkles, Circle, Zap, Moon, Sunrise } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';

function ShoeLightingSelection({ selectedLighting, onLightingSelect }) {
    const { config, loading, error } = useConfig();

    if (loading) {
        return (
            <div className="text-center py-8 text-slate-400">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                <p className="mt-2">Loading lighting styles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                Error loading lighting styles: {error}
            </div>
        );
    }

    const lightingStyles = config?.shoeLightingStyles || [];

    // Visual representation for each lighting style
    const getVisualStyle = (lightingId) => {
        const styleMap = {
            'studio_bright': {
                gradient: 'from-white via-slate-50 to-slate-100',
                icon: <Lightbulb className="w-8 h-8" />,
                glow: 'shadow-slate-200'
            },
            'natural_soft': {
                gradient: 'from-green-50 via-emerald-50 to-teal-50',
                icon: <Sun className="w-8 h-8" />,
                glow: 'shadow-green-200'
            },
            'dramatic_side': {
                gradient: 'from-purple-100 via-violet-100 to-slate-800',
                icon: <Zap className="w-8 h-8" />,
                glow: 'shadow-purple-300'
            },
            'golden_hour': {
                gradient: 'from-amber-200 via-orange-200 to-yellow-100',
                icon: <Sunrise className="w-8 h-8" />,
                glow: 'shadow-amber-300'
            },
            'moody_dark': {
                gradient: 'from-slate-800 via-slate-700 to-slate-900',
                icon: <Moon className="w-8 h-8 text-white" />,
                glow: 'shadow-slate-500'
            },
            'high_contrast': {
                gradient: 'from-black via-slate-400 to-white',
                icon: <Sparkles className="w-8 h-8" />,
                glow: 'shadow-slate-400'
            }
        };
        return styleMap[lightingId] || styleMap['studio_bright'];
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-semibold text-slate-900">Lighting Style</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {lightingStyles.map((lighting) => {
                    const isSelected = selectedLighting?.id === lighting.id;
                    const visual = getVisualStyle(lighting.id);

                    return (
                        <button
                            key={lighting.id}
                            onClick={() => onLightingSelect(lighting)}
                            className={`
                                relative overflow-hidden rounded-2xl border-2 transition-all group
                                ${isSelected
                                    ? 'border-slate-900 shadow-2xl scale-105'
                                    : 'border-slate-200 hover:border-slate-400 hover:shadow-xl hover:scale-102'
                                }
                            `}
                        >
                            {/* Gradient Background */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-br ${visual.gradient}
                                transition-opacity
                                ${isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}
                            `}></div>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 bg-slate-900 text-white rounded-full p-1 z-10">
                                    <Circle className="w-3 h-3 fill-current" />
                                </div>
                            )}

                            {/* Content */}
                            <div className="relative p-6 flex flex-col items-center gap-3">
                                <div className={`
                                    transition-all ${visual.glow}
                                    ${isSelected ? 'scale-110 shadow-lg' : 'group-hover:scale-105'}
                                `}>
                                    {visual.icon}
                                </div>
                                <p className={`
                                    font-semibold text-sm text-center
                                    ${lighting.id === 'moody_dark' ? 'text-white' : 'text-slate-900'}
                                `}>
                                    {lighting.name.en}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default ShoeLightingSelection;
