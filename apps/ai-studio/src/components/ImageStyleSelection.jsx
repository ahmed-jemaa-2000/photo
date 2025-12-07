import React from 'react';
import { motion } from 'framer-motion';
import {
    Image,
    Store,
    Sparkles,
    Building2,
    Diamond,
    Instagram,
    CheckCircle2,
    Star
} from 'lucide-react';

/**
 * SIMPLIFIED Image style presets - 5 Essential Options
 * Covers most e-commerce and social media use cases
 */
const IMAGE_STYLES = [
    {
        id: 'ecommerce_clean',
        name: 'E-commerce',
        description: 'Clean white background, perfect for listings',
        emoji: '🛒',
        icon: Store,
        gradient: 'from-slate-50 to-white',
        textDark: true,
        popular: true,
    },
    {
        id: 'editorial_vogue',
        name: 'Editorial',
        description: 'High-fashion magazine style',
        emoji: '✨',
        icon: Sparkles,
        gradient: 'from-purple-900 to-slate-900',
        textDark: false,
        popular: true,
    },
    {
        id: 'lifestyle_urban',
        name: 'Street Style',
        description: 'Urban photography vibe',
        emoji: '🏙️',
        icon: Building2,
        gradient: 'from-orange-400 to-amber-300',
        textDark: true,
    },
    {
        id: 'luxury_campaign',
        name: 'Luxury',
        description: 'High-end premium aesthetic',
        emoji: '💎',
        icon: Diamond,
        gradient: 'from-amber-400 to-yellow-300',
        textDark: true,
    },
    {
        id: 'instagram_aesthetic',
        name: 'Instagram',
        description: 'Optimized for social media',
        emoji: '📸',
        icon: Instagram,
        gradient: 'from-pink-500 via-purple-500 to-indigo-500',
        textDark: false,
        popular: true,
    },
];

/**
 * Animation variants
 */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
};

/**
 * SIMPLIFIED Image Style Selection - 5 Essential Options
 * No category tabs, direct selection grid
 */
function ImageStyleSelection({ selectedStyle, onStyleSelect }) {
    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Image className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Photography Style</h3>
                        <p className="text-sm text-slate-400">Choose the look for your image</p>
                    </div>
                </div>
                {selectedStyle && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1.5 bg-purple-500/20 rounded-full flex items-center gap-2"
                    >
                        <span className="text-lg">{IMAGE_STYLES.find(s => s.id === selectedStyle)?.emoji}</span>
                        <span className="text-sm font-medium text-purple-400">
                            {IMAGE_STYLES.find(s => s.id === selectedStyle)?.name}
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Style Cards Grid - Simple 5-option layout */}
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {IMAGE_STYLES.map((style) => {
                    const isSelected = selectedStyle === style.id;
                    const Icon = style.icon;

                    return (
                        <motion.button
                            key={style.id}
                            variants={itemVariants}
                            onClick={() => onStyleSelect(style.id)}
                            className={`
                                relative group overflow-hidden rounded-2xl border-2 transition-all duration-300
                                ${isSelected
                                    ? 'border-purple-400 shadow-xl shadow-purple-500/20 scale-[1.02]'
                                    : 'border-white/10 hover:border-purple-500/40'
                                }
                            `}
                            whileHover={{ scale: isSelected ? 1.02 : 1.04 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Gradient Background */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-br ${style.gradient}
                                transition-opacity duration-300
                                ${isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}
                            `} />

                            {/* Popular Badge */}
                            {style.popular && (
                                <div className="absolute -top-1 -right-1 z-20 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-0.5">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    Top
                                </div>
                            )}

                            {/* Content */}
                            <div className="relative z-10 p-4 flex flex-col items-center text-center gap-2">
                                {/* Icon */}
                                <div className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center
                                    ${style.textDark ? 'bg-black/10' : 'bg-white/10'}
                                    group-hover:scale-110 transition-transform duration-300
                                `}>
                                    <Icon className={`w-6 h-6 ${style.textDark ? 'text-slate-800' : 'text-white'}`} />
                                </div>

                                {/* Name */}
                                <h4 className={`font-bold text-sm leading-tight ${style.textDark ? 'text-slate-900' : 'text-white'}`}>
                                    {style.name}
                                </h4>

                                {/* Description */}
                                <p className={`text-[11px] leading-tight line-clamp-2 ${style.textDark ? 'text-slate-600' : 'text-white/70'}`}>
                                    {style.description}
                                </p>
                            </div>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 left-2 z-20 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
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

export { IMAGE_STYLES };
export default ImageStyleSelection;
