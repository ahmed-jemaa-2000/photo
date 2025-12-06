import React from 'react';
import { motion } from 'framer-motion';
import {
    Hand,
    User2,
    Camera,
    Layers,
    CheckCircle2,
    Sparkles
} from 'lucide-react';

/**
 * Bag display modes configuration
 */
const BAG_DISPLAY_MODES = [
    {
        id: 'held_hip',
        name: 'Held at Hip',
        description: 'Model elegantly holding bag at hip level',
        icon: Hand,
        prompt: 'Female model elegantly holding the bag at hip level with relaxed arm position, professional fashion photography, focus on bag design and model pose',
        recommended: true,
    },
    {
        id: 'shoulder',
        name: 'On Shoulder',
        description: 'Bag worn casually on shoulder',
        icon: User2,
        prompt: 'Model wearing bag on shoulder with natural walking pose, lifestyle fashion shot, bag details clearly visible',
    },
    {
        id: 'crossbody',
        name: 'Crossbody Style',
        description: 'Worn across body diagonally',
        icon: User2,
        prompt: 'Model wearing bag across body in crossbody style, casual urban setting, full body or 3/4 shot showing strap and bag position',
    },
    {
        id: 'in_hand',
        name: 'In Hand',
        description: 'Held by handles or top',
        icon: Hand,
        prompt: 'Model holding bag by handles with arm naturally extended, professional product photography emphasizing bag structure',
    },
    {
        id: 'flat_lay',
        name: 'Flat Lay',
        description: 'Bird\'s eye product shot',
        icon: Camera,
        prompt: 'Professional flat lay product photography, bag placed on clean surface with styled accessories, top-down angle, studio lighting',
        productOnly: true,
    },
    {
        id: 'lifestyle',
        name: 'Lifestyle Scene',
        description: 'Natural setting with context',
        icon: Sparkles,
        prompt: 'Lifestyle fashion photography, model with bag in natural setting (cafe, street, park), candid yet polished aesthetic',
    },
];

/**
 * Animation variants
 */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
};

/**
 * Display Mode Card
 */
const DisplayModeCard = ({ mode, isSelected, onSelect }) => {
    const Icon = mode.icon;

    return (
        <motion.button
            variants={itemVariants}
            onClick={() => onSelect(mode)}
            className={`
        group relative w-full p-4 rounded-xl border-2 
        flex items-center gap-4 text-left
        transition-all duration-300 overflow-hidden
        ${isSelected
                    ? 'bg-bags/15 border-bags shadow-lg shadow-bags/20'
                    : 'bg-white/5 border-white/10 hover:border-bags/40 hover:bg-white/[0.07]'
                }
      `}
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
        >
            {/* Icon */}
            <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
        transition-all duration-300
        ${isSelected
                    ? 'bg-bags text-white'
                    : 'bg-white/10 text-slate-400 group-hover:text-bags'
                }
      `}>
                <Icon className="w-6 h-6" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-semibold text-white truncate">
                        {mode.name}
                    </h4>
                    {mode.recommended && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-bags/20 text-pink-300 rounded-full">
                            Recommended
                        </span>
                    )}
                    {mode.productOnly && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full">
                            Product Only
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 truncate">
                    {mode.description}
                </p>
            </div>

            {/* Selection indicator */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-bags flex items-center justify-center flex-shrink-0"
                >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                </motion.div>
            )}
        </motion.button>
    );
};

/**
 * Main BagDisplayModeSelection Component
 */
const BagDisplayModeSelection = ({
    selectedMode,
    onModeSelect,
    className = ''
}) => {
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                    Display Style
                </h3>
                <p className="text-slate-400">
                    Choose how your bag will be showcased
                </p>
            </div>

            {/* Mode List */}
            <motion.div
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {BAG_DISPLAY_MODES.map((mode) => (
                    <DisplayModeCard
                        key={mode.id}
                        mode={mode}
                        isSelected={selectedMode?.id === mode.id}
                        onSelect={onModeSelect}
                    />
                ))}
            </motion.div>
        </div>
    );
};

export { BAG_DISPLAY_MODES };
export default BagDisplayModeSelection;
