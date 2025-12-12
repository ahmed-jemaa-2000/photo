import React from 'react';
import { motion } from 'framer-motion';
import {
    Shirt,
    Footprints,
    ShoppingBag,
    Watch,
    CheckCircle2,
    Sparkles,
    ArrowRight
} from 'lucide-react';

/**
 * Categories configuration with icons, colors, and metadata
 */
const CATEGORIES = [
    {
        id: 'clothes',
        name: 'Clothes',
        description: 'T-shirts, Dresses, Jackets & more',
        icon: Shirt,
        color: 'clothes',
        gradient: 'from-purple-500 to-indigo-600',
        bgGradient: 'from-purple-500/20 to-indigo-600/20',
        features: ['Full body models', 'Multiple poses', 'Lifestyle shots'],
        popular: true,
    },
    {
        id: 'shoes',
        name: 'Shoes',
        description: 'Sneakers, Boots, Heels & Sandals',
        icon: Footprints,
        color: 'shoes',
        gradient: 'from-orange-500 to-amber-600',
        bgGradient: 'from-orange-500/20 to-amber-600/20',
        features: ['On-feet shots', 'Product angles', 'Styled scenes'],
        popular: true,
    },
    {
        id: 'bags',
        name: 'Bags',
        description: 'Handbags, Backpacks, Totes & more',
        icon: ShoppingBag,
        color: 'bags',
        gradient: 'from-pink-500 to-rose-600',
        bgGradient: 'from-pink-500/20 to-rose-600/20',
        features: ['Carried shots', 'Flat lay', 'Detail views'],
        isNew: true,
    },
    {
        id: 'accessories',
        name: 'Accessories',
        description: 'Jewelry, Watches, Eyewear & Scarves',
        icon: Watch,
        color: 'accessories',
        gradient: 'from-teal-500 to-cyan-600',
        bgGradient: 'from-teal-500/20 to-cyan-600/20',
        features: ['Virtual try-on', 'Close-up details', 'Styled shots'],
        isNew: true,
    },
    {
        id: 'adCreative',
        name: 'Ad Creative',
        description: 'Marketing visuals for any product',
        icon: Sparkles, // Using Sparkles as the icon
        color: 'primary',
        gradient: 'from-violet-500 to-fuchsia-600',
        bgGradient: 'from-violet-500/20 to-fuchsia-600/20',
        features: ['Any product', 'Multiple formats', 'Brand styling'],
        isNew: true,
        popular: true,
    },
];

/**
 * Animation variants for staggered children
 */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    },
};

/**
 * Individual Category Card Component
 */
const CategoryCard = ({ category, isSelected, onSelect }) => {
    const Icon = category.icon;

    return (
        <motion.button
            variants={itemVariants}
            onClick={() => onSelect(category.id)}
            className={`
        group relative p-6 md:p-8 rounded-3xl border-2 
        flex flex-col items-center text-center gap-4
        transition-all duration-300 overflow-hidden
        ${isSelected
                    ? `bg-gradient-to-br ${category.bgGradient} border-${category.color} shadow-2xl shadow-${category.color}/25 scale-[1.02]`
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                }
      `}
            whileHover={{ scale: isSelected ? 1.02 : 1.03 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Background gradient effect */}
            <div
                className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
          bg-gradient-to-br ${category.bgGradient}
        `}
            />

            {/* Badges */}
            <div className="absolute top-4 right-4 flex gap-2">
                {category.popular && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary-light rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Popular
                    </span>
                )}
                {category.isNew && (
                    <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full">
                        New
                    </span>
                )}
            </div>

            {/* Icon */}
            <motion.div
                className={`
          relative w-20 h-20 md:w-24 md:h-24 rounded-2xl
          flex items-center justify-center
          transition-all duration-300
          ${isSelected
                        ? `bg-gradient-to-br ${category.gradient} text-white shadow-lg`
                        : 'bg-white/10 text-slate-400 group-hover:text-white group-hover:bg-white/15'
                    }
        `}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
            >
                <Icon className="w-10 h-10 md:w-12 md:h-12" />
            </motion.div>

            {/* Text */}
            <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {category.name}
                </h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    {category.description}
                </p>
            </div>

            {/* Features (visible on hover or when selected) */}
            <motion.div
                className={`
          relative z-10 flex flex-wrap justify-center gap-2 mt-2
          transition-all duration-300
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}
            >
                {category.features.map((feature, idx) => (
                    <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-white/10 text-slate-300 rounded-full"
                    >
                        {feature}
                    </span>
                ))}
            </motion.div>

            {/* Selection indicator */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
            absolute top-4 left-4 w-8 h-8 rounded-full
            bg-gradient-to-br ${category.gradient}
            flex items-center justify-center
            shadow-lg
          `}
                >
                    <CheckCircle2 className="w-5 h-5 text-white" />
                </motion.div>
            )}

            {/* Hover arrow */}
            <div className={`
        absolute bottom-4 right-4
        opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
        transition-all duration-300
        ${isSelected ? 'hidden' : ''}
      `}>
                <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>
        </motion.button>
    );
};

/**
 * Main CategoryHub Component - Premium category selection interface
 */
const CategoryHub = ({
    selectedCategory,
    onCategorySelect,
    className = ''
}) => {
    return (
        <div className={`space-y-8 ${className}`}>
            {/* Header */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    What are you <span className="text-gradient">shooting today</span>?
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Select your product category to get started with AI-powered professional photography
                </p>
            </motion.div>

            {/* Category Grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {CATEGORIES.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        isSelected={selectedCategory === category.id}
                        onSelect={onCategorySelect}
                    />
                ))}
            </motion.div>

            {/* Selected Category Summary */}
            {selectedCategory && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <p className="text-slate-400">
                        Selected: <span className="text-white font-semibold">
                            {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                        </span>
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export { CATEGORIES };
export default CategoryHub;
