import React from 'react';
import { motion } from 'framer-motion';
import { Square, RectangleVertical, Smartphone, CheckCircle2 } from 'lucide-react';

/**
 * Aspect Ratio Options - Optimized for different platforms
 */
const ASPECT_RATIOS = [
    {
        id: '1:1',
        name: 'Square',
        description: 'Instagram Feed',
        icon: Square,
        ratio: '1:1',
        width: 1024,
        height: 1024,
        recommended: true,
    },

    {
        id: '9:16',
        name: 'Story',
        description: 'Reels / TikTok',
        icon: Smartphone,
        ratio: '9:16',
        width: 1024,
        height: 1820,
    },
    id: '3:4',
    name: 'Portrait',
    description: 'Website / Print',
    icon: RectangleVertical,
    ratio: '3:4',
    width: 1024,
    height: 1365,
    recommended: true,
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 }
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
 * Aspect Ratio Selector Component
 */
function AspectRatioSelector({ selectedRatio, onRatioSelect }) {
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">Output Format</h3>
                    <p className="text-xs text-slate-400">Choose size for your platform</p>
                </div>
                {selectedRatio && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1.5 bg-primary/20 rounded-full"
                    >
                        <span className="text-sm font-medium text-primary-light">{selectedRatio.name}</span>
                    </motion.div>
                )}
            </div>

            {/* Ratio Grid */}
            <motion.div
                className="grid grid-cols-4 gap-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {ASPECT_RATIOS.map((ratio) => {
                    const isSelected = selectedRatio?.id === ratio.id;
                    const Icon = ratio.icon;

                    // Calculate preview dimensions
                    const previewWidth = 40;
                    const previewHeight = ratio.id === '1:1' ? 40 :

                        ratio.id === '9:16' ? 60 : 53;

                    return (
                        <motion.button
                            key={ratio.id}
                            variants={itemVariants}
                            onClick={() => onRatioSelect(ratio)}
                            className={`
                                relative group p-3 rounded-xl border-2 transition-all duration-300
                                flex flex-col items-center text-center gap-2
                                ${isSelected
                                    ? 'bg-primary/15 border-primary shadow-lg shadow-primary/20'
                                    : 'bg-white/5 border-white/10 hover:border-primary/40 hover:bg-white/[0.07]'
                                }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Recommended Badge */}
                            {ratio.recommended && (
                                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[8px]">
                                    ⭐
                                </div>
                            )}

                            {/* Ratio Preview Box */}
                            <div
                                className={`
                                    rounded border-2 transition-all duration-300
                                    ${isSelected ? 'border-primary bg-primary/20' : 'border-slate-600 bg-slate-800'}
                                `}
                                style={{ width: previewWidth, height: previewHeight }}
                            />

                            {/* Ratio Text */}
                            <div>
                                <p className="font-bold text-white text-xs">{ratio.ratio}</p>
                                <p className="text-[10px] text-slate-400">{ratio.description}</p>
                            </div>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-1 left-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                                >
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}

export { ASPECT_RATIOS };
export default AspectRatioSelector;
