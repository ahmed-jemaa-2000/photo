import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Image,
    Store,
    Sparkles,
    Palmtree,
    Building2,
    Diamond,
    Instagram,
    Film,
    CheckCircle2,
    Star,
    Coffee,
    Sunset
} from 'lucide-react';

/**
 * Image style presets matching server-side definitions
 */
const IMAGE_STYLES = [
    // E-commerce
    {
        id: 'ecommerce_clean',
        name: 'E-commerce Clean',
        description: 'Pure white background, perfect for listings',
        emoji: '🛒',
        icon: Store,
        gradient: 'from-slate-50 to-white',
        textDark: true,
        category: 'commercial',
        popular: true,
    },
    {
        id: 'ecommerce_soft',
        name: 'E-commerce Soft',
        description: 'Soft gradient with subtle shadows',
        emoji: '📦',
        icon: Store,
        gradient: 'from-slate-100 to-slate-50',
        textDark: true,
        category: 'commercial',
    },

    // Editorial
    {
        id: 'editorial_vogue',
        name: 'Editorial Vogue',
        description: 'High-fashion magazine editorial',
        emoji: '✨',
        icon: Sparkles,
        gradient: 'from-purple-900 to-slate-900',
        textDark: false,
        category: 'editorial',
        popular: true,
    },
    {
        id: 'editorial_minimal',
        name: 'Editorial Minimal',
        description: 'Clean minimalist look',
        emoji: '▫️',
        icon: Sparkles,
        gradient: 'from-slate-200 to-slate-100',
        textDark: true,
        category: 'editorial',
    },

    // Lifestyle
    {
        id: 'lifestyle_urban',
        name: 'Street Style',
        description: 'Urban street photography vibe',
        emoji: '🏙️',
        icon: Building2,
        gradient: 'from-orange-400 to-amber-300',
        textDark: true,
        category: 'lifestyle',
    },
    {
        id: 'lifestyle_outdoor',
        name: 'Outdoor Natural',
        description: 'Natural outdoor setting',
        emoji: '🌿',
        icon: Palmtree,
        gradient: 'from-green-400 to-emerald-300',
        textDark: true,
        category: 'lifestyle',
    },
    {
        id: 'lifestyle_cafe',
        name: 'Cafe & Indoor',
        description: 'Cozy cafe or home setting',
        emoji: '☕',
        icon: Coffee,
        gradient: 'from-amber-200 to-orange-100',
        textDark: true,
        category: 'lifestyle',
    },

    // Luxury
    {
        id: 'luxury_campaign',
        name: 'Luxury Campaign',
        description: 'High-end brand advertising',
        emoji: '💎',
        icon: Diamond,
        gradient: 'from-amber-400 to-yellow-300',
        textDark: true,
        category: 'luxury',
    },
    {
        id: 'luxury_dark',
        name: 'Dark Luxury',
        description: 'Moody premium aesthetic',
        emoji: '🖤',
        icon: Diamond,
        gradient: 'from-slate-900 to-black',
        textDark: false,
        category: 'luxury',
    },

    // Social Media
    {
        id: 'instagram_aesthetic',
        name: 'Instagram Aesthetic',
        description: 'Optimized for Instagram feed',
        emoji: '📸',
        icon: Instagram,
        gradient: 'from-pink-500 via-purple-500 to-indigo-500',
        textDark: false,
        category: 'social',
        popular: true,
    },
    {
        id: 'tiktok_dynamic',
        name: 'TikTok Dynamic',
        description: 'Bold and eye-catching',
        emoji: '🎵',
        icon: Sparkles,
        gradient: 'from-cyan-400 via-pink-500 to-red-500',
        textDark: false,
        category: 'social',
    },

    // Artistic
    {
        id: 'artistic_film',
        name: 'Film Grain Vintage',
        description: 'Nostalgic 35mm film look',
        emoji: '🎞️',
        icon: Film,
        gradient: 'from-amber-100 to-orange-200',
        textDark: true,
        category: 'artistic',
    },
];

/**
 * Style categories for filtering
 */
const STYLE_CATEGORIES = [
    { id: 'all', label: 'All Styles', icon: Image },
    { id: 'commercial', label: 'E-commerce', icon: Store },
    { id: 'editorial', label: 'Editorial', icon: Sparkles },
    { id: 'lifestyle', label: 'Lifestyle', icon: Sunset },
    { id: 'luxury', label: 'Luxury', icon: Diamond },
    { id: 'social', label: 'Social', icon: Instagram },
    { id: 'artistic', label: 'Artistic', icon: Film },
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
 * Premium Image Style Selection Component
 */
function ImageStyleSelection({ selectedStyle, onStyleSelect }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredStyles = activeCategory === 'all'
        ? IMAGE_STYLES
        : IMAGE_STYLES.filter(s => s.category === activeCategory);

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
                        <p className="text-sm text-slate-400">Choose the look and feel for your image</p>
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

            {/* Category Filters - Horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                {STYLE_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                        <motion.button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`
                flex items-center gap-2 px-3 py-2 sm:py-1.5 rounded-lg text-sm font-medium whitespace-nowrap
                transition-all duration-200 flex-shrink-0 min-h-[44px]
                ${isActive
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }
              `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{cat.label}</span>
                            <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Style Cards Grid */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={activeCategory}
            >
                <AnimatePresence mode="popLayout">
                    {filteredStyles.map((style) => {
                        const isSelected = selectedStyle === style.id;
                        const Icon = style.icon;

                        return (
                            <motion.button
                                key={style.id}
                                variants={itemVariants}
                                layout
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
                                    <div className="absolute -top-1 -right-1 z-20 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        Top
                                    </div>
                                )}

                                {/* Content */}
                                <div className="relative z-10 p-4 flex flex-col items-center text-center gap-2">
                                    {/* Icon */}
                                    <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    ${style.textDark ? 'bg-black/10' : 'bg-white/10'}
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                                        <Icon className={`w-5 h-5 ${style.textDark ? 'text-slate-800' : 'text-white'}`} />
                                    </div>

                                    {/* Name */}
                                    <h4 className={`font-bold text-sm leading-tight ${style.textDark ? 'text-slate-900' : 'text-white'}`}>
                                        {style.name}
                                    </h4>

                                    {/* Description */}
                                    <p className={`text-xs leading-tight line-clamp-2 ${style.textDark ? 'text-slate-600' : 'text-white/70'}`}>
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
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export { IMAGE_STYLES };
export default ImageStyleSelection;
