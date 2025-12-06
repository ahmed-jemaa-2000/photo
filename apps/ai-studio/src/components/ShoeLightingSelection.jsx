import React from 'react';
import { motion } from 'framer-motion';
import {
    Sun,
    Lightbulb,
    Sunset,
    Zap,
    CheckCircle2,
} from 'lucide-react';

/**
 * SIMPLIFIED Lighting Options - Only 4 Essential Choices
 * These cover 95% of use cases for product photography
 */
const LIGHTING_OPTIONS = [
    {
        id: 'studio_clean',
        name: 'Studio Clean',
        description: 'Bright, even lighting - best for e-commerce',
        icon: Lightbulb,
        gradient: 'from-slate-100 via-white to-slate-50',
        textDark: true,
        prompt: 'Professional studio lighting, bright evenly diffused light, minimal shadows, clean commercial look, pure white or light gray background, e-commerce product photography style',
        recommended: true,
    },
    {
        id: 'natural_soft',
        name: 'Natural Light',
        description: 'Soft daylight, authentic feel',
        icon: Sun,
        gradient: 'from-sky-100 via-blue-50 to-white',
        textDark: true,
        prompt: 'Soft natural daylight, gentle directional shadows, outdoor or window light feel, balanced exposure, authentic lifestyle look',
        recommended: true,
    },
    {
        id: 'golden_hour',
        name: 'Golden Hour',
        description: 'Warm sunset glow, premium aesthetic',
        icon: Sunset,
        gradient: 'from-amber-300 via-orange-200 to-yellow-100',
        textDark: true,
        prompt: 'Warm golden hour sunlight, sunset glow, soft long shadows, cinematic premium feel, rich warm tones, lifestyle luxury photography',
    },
    {
        id: 'dramatic',
        name: 'Dramatic',
        description: 'Bold shadows, editorial style',
        icon: Zap,
        gradient: 'from-slate-900 via-slate-700 to-slate-500',
        textDark: false,
        prompt: 'High contrast dramatic lighting, bold shadows and highlights, edge-lit with rim light, editorial fashion style, moody and sophisticated atmosphere',
    },
];

/**
 * Animation variants
 */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
};

/**
 * Simplified Lighting Selection - 4 Essential Options
 */
function ShoeLightingSelection({ selectedLighting, onLightingSelect }) {
    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">Lighting</h3>
                        <p className="text-xs sm:text-sm text-slate-400">Set the mood and atmosphere</p>
                    </div>
                </div>
                {selectedLighting && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="hidden sm:flex px-3 py-1.5 bg-amber-500/20 rounded-full items-center gap-2"
                    >
                        <span className="text-sm font-medium text-amber-400">{selectedLighting.name}</span>
                    </motion.div>
                )}
            </div>

            {/* Lighting Cards - Simple 4-option grid */}
            <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {LIGHTING_OPTIONS.map((lighting) => {
                    const isSelected = selectedLighting?.id === lighting.id;
                    const Icon = lighting.icon;

                    return (
                        <motion.button
                            key={lighting.id}
                            variants={itemVariants}
                            onClick={() => onLightingSelect(lighting)}
                            className={`
                                relative group overflow-hidden rounded-2xl border-2 transition-all duration-300
                                ${isSelected
                                    ? 'border-amber-400 shadow-xl shadow-amber-500/20'
                                    : 'border-white/10 hover:border-amber-500/40'
                                }
                            `}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${lighting.gradient} transition-opacity duration-300`} />

                            {/* Recommended Badge */}
                            {lighting.recommended && (
                                <div className="absolute -top-2 -right-2 z-20 px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                                    ⭐
                                </div>
                            )}

                            {/* Content */}
                            <div className="relative z-10 p-4 flex flex-col items-center text-center gap-3">
                                {/* Icon */}
                                <div className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                                    ${lighting.textDark ? 'bg-black/10' : 'bg-white/20'}
                                    ${isSelected ? 'scale-110' : 'group-hover:scale-105'}
                                `}>
                                    <Icon className={`w-6 h-6 ${lighting.textDark ? 'text-slate-700' : 'text-white'}`} />
                                </div>

                                {/* Name */}
                                <h4 className={`font-bold text-sm leading-tight ${lighting.textDark ? 'text-slate-900' : 'text-white'}`}>
                                    {lighting.name}
                                </h4>

                                {/* Description */}
                                <p className={`text-[11px] leading-tight ${lighting.textDark ? 'text-slate-600' : 'text-white/80'}`}>
                                    {lighting.description}
                                </p>
                            </div>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 left-2 z-20 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}

export { LIGHTING_OPTIONS };
export default ShoeLightingSelection;
