import React from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    Layers,
    Move3d,
    User,
    CheckCircle2,
    Eye
} from 'lucide-react';

/**
 * ACCESSORY Shot Types - 4 Essential Options
 */
const ACCESSORY_SHOT_TYPES = [
    {
        id: 'macro_detail',
        name: 'Macro Detail',
        description: 'Close-up, focus on texture',
        icon: Eye,
        prompt: 'Extreme close-up macro photography, sharp focus on fine details, texture and craftsmanship clearly visible, depth of field blurring the background, professional jewelry photography',
        recommended: true,
    },
    {
        id: 'flat_lay',
        name: 'Flat Lay',
        description: 'Clean overhead composition',
        icon: Layers,
        prompt: 'Overhead flat lay composition, organized and clean arrangement, high angle view, minimal props, balanced spacing, elegant presentation',
    },
    {
        id: 'floating',
        name: 'Floating / Levitating',
        description: 'Magical, dynamic feel',
        icon: Move3d,
        prompt: 'Floating product photography, anti-gravity effect, suspended in mid-air, dynamic angle, magical and premium atmosphere, ethereal lighting',
    },
    {
        id: 'on_model',
        name: 'On Model (Close)',
        description: 'Context and scale',
        icon: User,
        prompt: 'Shot on model close-up, showing the accessory worn naturally, focus on the product with skin texture visible, lifestyle context, shallow depth of field',
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
 * Accessory Shot Type Selection Component
 */
function AccessoryShotTypeSelection({ selectedShotType, onShotTypeSelect }) {
    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">Shot Type</h3>
                        <p className="text-xs sm:text-sm text-slate-400">Choose the composition</p>
                    </div>
                </div>
                {selectedShotType && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="hidden sm:flex px-3 py-1.5 bg-emerald-500/20 rounded-full items-center gap-2"
                    >
                        <span className="text-sm font-medium text-emerald-400">{selectedShotType.name}</span>
                    </motion.div>
                )}
            </div>

            {/* Shot Type Cards */}
            <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {ACCESSORY_SHOT_TYPES.map((type) => {
                    const isSelected = selectedShotType?.id === type.id;
                    const Icon = type.icon;

                    return (
                        <motion.button
                            key={type.id}
                            variants={itemVariants}
                            onClick={() => onShotTypeSelect(type)}
                            className={`
                                relative group p-4 rounded-2xl border-2 transition-all duration-300
                                flex flex-col items-center text-center gap-3
                                ${isSelected
                                    ? 'bg-emerald-500/15 border-emerald-500 shadow-xl shadow-emerald-500/20'
                                    : 'bg-white/5 border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.07]'
                                }
                            `}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {/* Recommended Badge */}
                            {type.recommended && (
                                <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                                    ⭐
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`
                                w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300
                                ${isSelected
                                    ? 'bg-emerald-500/30 scale-110'
                                    : 'bg-white/10 group-hover:bg-emerald-500/20 group-hover:scale-105'
                                }
                            `}>
                                <Icon className={`w-7 h-7 ${isSelected ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                            </div>

                            {/* Name */}
                            <h4 className="font-bold text-white text-sm leading-tight">
                                {type.name}
                            </h4>

                            {/* Description */}
                            <p className="text-[11px] text-slate-400 leading-tight">
                                {type.description}
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
        </div>
    );
}

export { ACCESSORY_SHOT_TYPES };
export default AccessoryShotTypeSelection;
