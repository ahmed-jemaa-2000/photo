import React from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    ArrowRight,
    ArrowDown,
    ArrowUp,
    CheckCircle2,
} from 'lucide-react';

/**
 * SIMPLIFIED Camera Angles - Only 4 Essential Options
 * These cover 95% of use cases for shoe photography
 */
const CAMERA_ANGLES = [
    {
        id: 'three_quarter',
        name: '3/4 Hero',
        description: 'Best for e-commerce, shows depth + design',
        icon: Camera,
        prompt: '3/4 front angle (classic hero product shot), slightly elevated view at 30 degrees, showing both front and side features, professional e-commerce style, sharp focus on details',
        recommended: true,
    },
    {
        id: 'side_profile',
        name: 'Side Profile',
        description: 'Full silhouette, design lines visible',
        icon: ArrowRight,
        prompt: 'Side profile view at 90 degrees, full shoe silhouette visible, clean horizontal composition, focus on design lines, sole and heel clearly shown',
        recommended: true,
    },
    {
        id: 'top_down',
        name: 'Top-Down',
        description: 'Overhead view, shows lacing + texture',
        icon: ArrowDown,
        prompt: 'Overhead top-down view (birds eye), looking directly down at shoes, clean surface background, lacing pattern and top details clearly visible, flat lay style',
    },
    {
        id: 'low_angle',
        name: 'Low Angle',
        description: 'Dramatic, powerful perspective',
        icon: ArrowUp,
        prompt: 'Low angle ground-level shot looking upward, dramatic and powerful perspective, emphasizes presence and height, cinematic urban context',
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
 * Simplified Camera Angle Selection - 4 Essential Options
 */
function ShoeCameraAngleSelection({ selectedAngle, onAngleSelect }) {
    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">Camera Angle</h3>
                        <p className="text-xs sm:text-sm text-slate-400">How should we frame the shot?</p>
                    </div>
                </div>
                {selectedAngle && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="hidden sm:flex px-3 py-1.5 bg-orange-500/20 rounded-full items-center gap-2"
                    >
                        <span className="text-sm font-medium text-orange-400">{selectedAngle.name}</span>
                    </motion.div>
                )}
            </div>

            {/* Angle Cards - Simple 4-option grid */}
            <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {CAMERA_ANGLES.map((angle) => {
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
                                    ? 'bg-orange-500/15 border-orange-500 shadow-xl shadow-orange-500/20'
                                    : 'bg-white/5 border-white/10 hover:border-orange-500/40 hover:bg-white/[0.07]'
                                }
                            `}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {/* Recommended Badge */}
                            {angle.recommended && (
                                <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-lg">
                                    ⭐
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`
                                w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300
                                ${isSelected
                                    ? 'bg-orange-500/30 scale-110'
                                    : 'bg-white/10 group-hover:bg-orange-500/20 group-hover:scale-105'
                                }
                            `}>
                                <Icon className={`w-7 h-7 ${isSelected ? 'text-orange-400' : 'text-slate-400 group-hover:text-orange-400'}`} />
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
                                    className="absolute top-2 left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
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

export { CAMERA_ANGLES };
export default ShoeCameraAngleSelection;
