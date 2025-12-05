import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sun,
    Lightbulb,
    Moon,
    Sparkles,
    Zap,
    Sunrise,
    CloudSun,
    Flame,
    Stars,
    CheckCircle2,
    Palette
} from 'lucide-react';

/**
 * Professional lighting/mood presets for shoe photography
 */
const LIGHTING_MOODS = [
    {
        id: 'studio_clean',
        name: 'Studio Clean',
        description: 'Bright, even commercial lighting',
        emoji: '💡',
        gradient: 'from-slate-50 via-white to-slate-100',
        textDark: true,
        prompt: 'Professional studio lighting, bright and evenly diffused, minimal shadows, clean commercial look, pure white background, perfect for e-commerce, high-key lighting',
        popular: true,
        intensity: 'bright',
    },
    {
        id: 'soft_natural',
        name: 'Soft Daylight',
        description: 'Gentle natural window light',
        emoji: '🌤️',
        gradient: 'from-blue-50 via-sky-50 to-white',
        textDark: true,
        prompt: 'Soft natural daylight, gentle directional shadows, outdoor feel, balanced exposure, approachable aesthetic, lifestyle look with natural window light',
        intensity: 'soft',
    },
    {
        id: 'golden_sunset',
        name: 'Golden Hour',
        description: 'Warm sunset glow aesthetic',
        emoji: '🌅',
        gradient: 'from-amber-300 via-orange-300 to-yellow-200',
        textDark: true,
        prompt: 'Warm golden hour sunlight, sunset glow, long soft shadows, cinematic premium feel, rich warm tones, lifestyle photography, romantic lighting',
        intensity: 'warm',
    },
    {
        id: 'dramatic_contrast',
        name: 'High Contrast',
        description: 'Bold editorial shadows',
        emoji: '⚡',
        gradient: 'from-slate-900 via-slate-600 to-white',
        textDark: false,
        prompt: 'High contrast dramatic lighting, deep shadows and bright highlights, punchy and bold, modern editorial style, creates depth and dimension',
        intensity: 'dramatic',
    },
    {
        id: 'moody_noir',
        name: 'Moody Dark',
        description: 'Mysterious low-key ambiance',
        emoji: '🌙',
        gradient: 'from-slate-900 via-slate-800 to-slate-950',
        textDark: false,
        prompt: 'Low-key dark moody lighting, mysterious atmosphere, spotlight on shoes, dark background, luxury and sophistication, noir aesthetic',
        intensity: 'dark',
    },
    {
        id: 'neon_glow',
        name: 'Neon Vibes',
        description: 'Colorful urban night look',
        emoji: '💜',
        gradient: 'from-purple-600 via-pink-500 to-cyan-400',
        textDark: false,
        prompt: 'Vibrant neon lighting, urban night aesthetic, colorful reflections, purple and cyan tones, streetwear photography style, cyberpunk feel',
        intensity: 'creative',
    },
    {
        id: 'product_rim',
        name: 'Rim Light Pro',
        description: 'Edge-lit professional product',
        emoji: '✨',
        gradient: 'from-slate-800 via-slate-700 to-slate-600',
        textDark: false,
        prompt: 'Professional rim lighting, edge-lit product photography, dark background with glowing outline, separates subject from background, premium catalog style',
        intensity: 'dramatic',
    },
    {
        id: 'warm_studio',
        name: 'Warm Studio',
        description: 'Cozy tungsten warmth',
        emoji: '🔥',
        gradient: 'from-orange-200 via-amber-100 to-orange-50',
        textDark: true,
        prompt: 'Warm tungsten studio lighting, cozy inviting atmosphere, soft shadows, warm color temperature, premium boutique feel',
        intensity: 'warm',
    },
    {
        id: 'cool_tech',
        name: 'Cool Tech',
        description: 'Modern blue-tinted precision',
        emoji: '❄️',
        gradient: 'from-cyan-100 via-blue-100 to-slate-100',
        textDark: true,
        prompt: 'Cool tech-inspired lighting, blue-tinted modern aesthetic, clean and precise, futuristic product photography, performance footwear style',
        intensity: 'cool',
    },
    {
        id: 'outdoor_adventure',
        name: 'Adventure Light',
        description: 'Rugged outdoor natural',
        emoji: '⛰️',
        gradient: 'from-green-200 via-emerald-100 to-teal-100',
        textDark: true,
        prompt: 'Natural outdoor lighting, adventure and exploration context, dappled sunlight through trees, earthy tones, hiking/trail photography style',
        intensity: 'natural',
    },
];

/**
 * Intensity filter options
 */
const INTENSITIES = [
    { id: 'all', label: 'All Moods', icon: Palette },
    { id: 'bright', label: 'Bright', icon: Sun },
    { id: 'soft', label: 'Soft', icon: CloudSun },
    { id: 'warm', label: 'Warm', icon: Flame },
    { id: 'dramatic', label: 'Dramatic', icon: Zap },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'creative', label: 'Creative', icon: Stars },
];

/**
 * Animation variants
 */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.04 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
};

/**
 * Premium Lighting/Mood Selection Component
 */
function ShoeLightingSelection({ selectedLighting, onLightingSelect }) {
    const [activeIntensity, setActiveIntensity] = useState('all');

    const filteredMoods = activeIntensity === 'all'
        ? LIGHTING_MOODS
        : LIGHTING_MOODS.filter(m => m.intensity === activeIntensity);

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Lighting & Mood</h3>
                        <p className="text-sm text-slate-400">Set the atmosphere for your shot</p>
                    </div>
                </div>
                {selectedLighting && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1.5 bg-amber-500/20 rounded-full flex items-center gap-2"
                    >
                        <span className="text-lg">{selectedLighting.emoji}</span>
                        <span className="text-sm font-medium text-amber-400">{selectedLighting.name}</span>
                    </motion.div>
                )}
            </div>

            {/* Intensity Filter */}
            <div className="flex flex-wrap gap-2">
                {INTENSITIES.map((int) => {
                    const Icon = int.icon;
                    const isActive = activeIntensity === int.id;
                    return (
                        <motion.button
                            key={int.id}
                            onClick={() => setActiveIntensity(int.id)}
                            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isActive
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }
              `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {int.label}
                        </motion.button>
                    );
                })}
            </div>

            {/* Mood Cards Grid */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={activeIntensity}
            >
                <AnimatePresence mode="popLayout">
                    {filteredMoods.map((mood) => {
                        const isSelected = selectedLighting?.id === mood.id;

                        return (
                            <motion.button
                                key={mood.id}
                                variants={itemVariants}
                                layout
                                onClick={() => onLightingSelect(mood)}
                                className={`
                  relative group overflow-hidden rounded-2xl border-2 transition-all duration-300
                  ${isSelected
                                        ? 'border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]'
                                        : 'border-white/10 hover:border-amber-500/40'
                                    }
                `}
                                whileHover={{ scale: isSelected ? 1.02 : 1.04 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Gradient Background */}
                                <div className={`
                  absolute inset-0 bg-gradient-to-br ${mood.gradient}
                  transition-opacity duration-300
                  ${isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}
                `} />

                                {/* Popular Badge */}
                                {mood.popular && (
                                    <div className="absolute -top-1 -right-1 z-20 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                                        ⭐ Top
                                    </div>
                                )}

                                {/* Content */}
                                <div className="relative z-10 p-4 flex flex-col items-center text-center gap-2">
                                    {/* Emoji */}
                                    <div className={`
                    text-3xl transition-transform duration-300
                    ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                                        {mood.emoji}
                                    </div>

                                    {/* Name */}
                                    <h4 className={`font-bold text-sm leading-tight ${mood.textDark ? 'text-slate-900' : 'text-white'}`}>
                                        {mood.name}
                                    </h4>

                                    {/* Description */}
                                    <p className={`text-xs leading-tight line-clamp-2 ${mood.textDark ? 'text-slate-600' : 'text-white/70'}`}>
                                        {mood.description}
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

                                {/* Hover glow effect */}
                                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  bg-gradient-to-t from-black/20 to-transparent
                `} />
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export { LIGHTING_MOODS };
export default ShoeLightingSelection;
