import React from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    ArrowRight,
    ArrowDown,
    ArrowUp,
    CheckCircle2,
    Eye
} from 'lucide-react';

/**
 * BAG Camera Angles - 4 Essential Options
 */
const BAG_CAMERA_ANGLES = [
    {
        id: 'straight_on',
        name: 'Straight On',
        description: 'Classic hero shot, shows front design',
        icon: Camera,
        prompt: 'Straight front-facing camera angle, eye-level, showing full bag design clearly, symmetrical composition, professional e-commerce style, sharp focus on hardware and material',
        recommended: true,
    },
    {
        id: 'three_quarter',
        name: '3/4 Angle',
        description: 'Shows depth and side details',
        icon: ArrowRight,
        prompt: '3/4 side angle view at 45 degrees, showing both front and side of the bag, emphasizing dimensionality and structure, classic product photography angle',
        recommended: true,
    },
    {
        id: 'top_down',
        name: 'Top-Down',
        description: 'Flat lay or open view',
        icon: ArrowDown,
        prompt: 'Overhead top-down view (flat lay), simple background, showing bag shape and handles clearly, minimalist composition, soft lighting',
    },
    {
        id: 'detail_zoom',
        name: 'Low Dramtic',
        description: 'Low angle for powerful look',
        icon: ArrowUp,
        prompt: 'Low angle shot looking upward at the bag, dramatic perspective making the bag look premium and substantial, luxury advertising style',
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
 * Bag Camera Angle Selection Component
 */
function BagCameraAngleSelection({ selectedAngle, onAngleSelect }) {
    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">Camera Angle</h3>
                        <p className="text-xs sm:text-sm text-slate-400">Best angle for your bag</p>
                    </div>
                </div>
                {selectedAngle && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="hidden sm:flex px-3 py-1.5 bg-pink-500/20 rounded-full items-center gap-2"
                    >
                        <span className="text-sm font-medium text-pink-400">{selectedAngle.name}</span>
                    </motion.div>
                )}
            </div>

            {/* Angle Cards */}
            <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {BAG_CAMERA_ANGLES.map((angle) => {
                    const isSelected = selectedAngle?.id === angle.id;
                    const Icon = angle.icon;

                    return (
                        <motion.button
                            key={angle.id}
                            variants={itemVariants}
                            onClick={() => onAngleSelect(angle)}
                            className={`
                                relative group p-4 rounded-2xl border-2 transition-all duration-300
                                flex flex-col items-center text-center gap-3
                                ${isSelected
                                    ? 'bg-pink-500/15 border-pink-500 shadow-xl shadow-pink-500/20'
                                    : 'bg-white/5 border-white/10 hover:border-pink-500/40 hover:bg-white/[0.07]'
                                }
                            `}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {/* Recommended Badge */}
                            {angle.recommended && (
                                <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                                    ⭐
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`
                                w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300
                                ${isSelected
                                    ? 'bg-pink-500/30 scale-110'
                                    : 'bg-white/10 group-hover:bg-pink-500/20 group-hover:scale-105'
                                }
                            `}>
                                <Icon className={`w-7 h-7 ${isSelected ? 'text-pink-400' : 'text-slate-400 group-hover:text-pink-400'}`} />
                            </div>

                            {/* Name */}
                            <h4 className="font-bold text-white text-sm leading-tight">
                                {angle.name}
                            </h4>

                            {/* Description */}
                            <p className="text-[11px] text-slate-400 leading-tight">
                                {angle.description}
                            </p>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 left-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center shadow-lg"
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

export { BAG_CAMERA_ANGLES };
export default BagCameraAngleSelection;
