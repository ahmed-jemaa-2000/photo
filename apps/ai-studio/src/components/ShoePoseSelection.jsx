import React from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    User,
    Footprints,
    Armchair,
    Star,
    CheckCircle2,
} from 'lucide-react';

/**
 * SIMPLIFIED Core Shoe Poses - Only 5 Essential Options
 * Fewer options = clearer AI prompts = better results
 */
const SHOE_POSES = [
    {
        id: 'standing',
        name: 'Standing',
        description: 'Classic product shot, feet visible',
        emoji: '🧍',
        icon: User,
        prompt: 'Professional standing pose, weight evenly balanced, feet hip-width apart, natural relaxed stance, both shoes fully visible, clean product catalogue photography, sharp focus on footwear',
        recommended: true,
    },
    {
        id: 'walking',
        name: 'Walking',
        description: 'Dynamic mid-stride motion',
        emoji: '🚶',
        icon: Footprints,
        prompt: 'Dynamic walking pose captured mid-stride, one foot forward lifting off ground, natural motion, lifestyle photography, shoes in action, urban context',
        recommended: true,
    },
    {
        id: 'sitting',
        name: 'Sitting',
        description: 'Casual lifestyle vibe',
        emoji: '🪑',
        icon: Armchair,
        prompt: 'Seated pose with legs extended or crossed, casual relaxed lifestyle context, shoes as focal point, coffee shop or home setting, natural and comfortable',
    },
    {
        id: 'product_hero',
        name: 'Product Hero',
        description: 'Floating shoe, no legs',
        emoji: '✨',
        icon: Star,
        prompt: 'Clean product-only shot, floating shoe on solid background, no legs or model, angled to show design details, professional e-commerce photography, studio lighting, hero product shot',
        recommended: true,
    },
    {
        id: 'close_up',
        name: 'On-Foot Close-up',
        description: 'Tight focus on the shoe',
        emoji: '🔍',
        icon: Camera,
        prompt: 'Close-up shot focused tightly on the shoe, showing texture and details, shallow depth of field, artistic product photography, emphasizing material quality and craftsmanship',
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
 * Simplified Shoe Pose Selection - 5 Essential Options
 */
function ShoePoseSelection({ selectedPose, onPoseSelect }) {
    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <Footprints className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">Shot Type</h3>
                        <p className="text-xs sm:text-sm text-slate-400">Choose how to photograph your shoes</p>
                    </div>
                </div>
                {selectedPose && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="hidden sm:flex px-3 py-1.5 bg-emerald-500/20 rounded-full items-center gap-2"
                    >
                        <span className="text-lg">{selectedPose.emoji}</span>
                        <span className="text-sm font-medium text-emerald-400">{selectedPose.name}</span>
                    </motion.div>
                )}
            </div>

            {/* Pose Cards - Simple 5-option grid */}
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {SHOE_POSES.map((pose) => {
                    const isSelected = selectedPose?.id === pose.id;
                    const Icon = pose.icon;

                    return (
                        <motion.button
                            key={pose.id}
                            variants={itemVariants}
                            onClick={() => onPoseSelect(pose)}
                            className={`
                                relative group p-4 rounded-2xl border-2 transition-all duration-300
                                flex flex-col items-center text-center gap-2
                                ${isSelected
                                    ? 'bg-emerald-500/15 border-emerald-500 shadow-xl shadow-emerald-500/20'
                                    : 'bg-white/5 border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.07]'
                                }
                            `}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {/* Recommended Badge */}
                            {pose.recommended && (
                                <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                                    ⭐
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`
                                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                                ${isSelected
                                    ? 'bg-emerald-500/30 scale-110'
                                    : 'bg-white/10 group-hover:bg-emerald-500/20 group-hover:scale-105'
                                }
                            `}>
                                <Icon className={`w-6 h-6 ${isSelected ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                            </div>

                            {/* Name */}
                            <h4 className="font-bold text-white text-sm leading-tight">
                                {pose.name}
                            </h4>

                            {/* Description */}
                            <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                                {pose.description}
                            </p>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 left-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Quick tip */}
            <p className="text-xs text-slate-500 text-center mt-2">
                💡 Tip: <span className="text-slate-400">Product Hero</span> works best for e-commerce listings
            </p>
        </div>
    );
}

export { SHOE_POSES };
export default ShoePoseSelection;
