import React from 'react';
import { motion } from 'framer-motion';
import {
    Sun,
    Lightbulb,
    Sparkles,
    Zap,
    CheckCircle2,
} from 'lucide-react';

/**
 * ACCESSORY Lighting Options - 4 Essential Choices
 */
const ACCESSORY_LIGHTING_OPTIONS = [
    {
        id: 'jewelers_sparkle',
        name: 'Jeweler\'s Sparkle',
        description: 'Hard light for brilliance',
        icon: Sparkles,
        gradient: 'from-blue-100 via-white to-purple-100',
        textDark: true,
        prompt: 'Professional jewelry lighting, hard light sources to create dispersion and sparkle in gems/metal, starburst highlights, high contrast reflection, luxury advertisement style, pristine clean background',
        recommended: true,
    },
    {
        id: 'soft_diffusion',
        name: 'Soft Diffusion',
        description: 'Even light for texture',
        icon: Lightbulb,
        gradient: 'from-zinc-100 via-white to-zinc-50',
        textDark: true,
        prompt: 'Soft diffused lighting, even illumination for texture details, minimal shadows, clean catalog style, true-to-life colors, professional product photography',
        recommended: true,
    },
    {
        id: 'dramatic_rim',
        name: 'Dramatic Rim',
        description: 'Silhouette and edge light',
        icon: Zap,
        gradient: 'from-indigo-900 via-purple-900 to-slate-900',
        textDark: false,
        prompt: 'Dramatic rim lighting, dark background, edge lighting defining the shape, silhouette effect, moody and mysterious, high-end editorial style',
    },
    {
        id: 'natural_sun',
        name: 'Natural Sun',
        description: 'Warm outdoor feeling',
        icon: Sun,
        gradient: 'from-amber-100 via-orange-50 to-white',
        textDark: true,
        prompt: 'Natural sunlight, dappled light effect, warm golden tones, lifestyle atmosphere, organic shadows, outdoor setting feel',
    },
];

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
 * Accessory Lighting Selection Component
 */
function AccessoryLightingSelection({ selectedLighting, onLightingSelect }) {
    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">Lighting</h3>
                        <p className="text-xs sm:text-sm text-slate-400">Enhance the materials</p>
                    </div>
                </div>
                {selectedLighting && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="hidden sm:flex px-3 py-1.5 bg-violet-500/20 rounded-full items-center gap-2"
                    >
                        <span className="text-sm font-medium text-violet-400">{selectedLighting.name}</span>
                    </motion.div>
                )}
            </div>

            {/* Lighting Cards */}
            <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {ACCESSORY_LIGHTING_OPTIONS.map((lighting) => {
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
                                    ? 'border-violet-400 shadow-xl shadow-violet-500/20'
                                    : 'border-white/10 hover:border-violet-500/40'
                                }
                            `}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${lighting.gradient} transition-opacity duration-300`} />

                            {/* Recommended Badge */}
                            {lighting.recommended && (
                                <div className="absolute -top-2 -right-2 z-20 px-1.5 py-0.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-[10px] font-bold rounded-full shadow-lg">
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
                                    className="absolute top-2 left-2 z-20 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center shadow-lg"
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

export { ACCESSORY_LIGHTING_OPTIONS };
export default AccessoryLightingSelection;
