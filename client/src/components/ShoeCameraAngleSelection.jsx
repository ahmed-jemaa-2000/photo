import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera,
    Target,
    Compass,
    Focus,
    Maximize2,
    Eye,
    RotateCcw,
    ArrowUpRight,
    ArrowDownRight,
    Crosshair,
    CheckCircle2,
    Sparkles
} from 'lucide-react';

/**
 * Professional shoe camera angles - comprehensive options for e-commerce and editorial
 */
const CAMERA_ANGLES = [
    {
        id: 'hero_three_quarter',
        name: '3/4 Hero Shot',
        description: 'Classic e-commerce angle showing depth and design',
        emoji: '📸',
        prompt: '3/4 front angle (classic hero product shot), slightly elevated view at 30 degrees, showing both front and side features, professional e-commerce style, sharp focus on details, clean composition',
        popular: true,
        category: 'essential',
    },
    {
        id: 'side_profile',
        name: 'Side Profile',
        description: 'Full silhouette showcasing design lines',
        emoji: '👟',
        prompt: 'Side profile view, 90-degree angle showing the full silhouette of the shoe, clean horizontal lines, focus on design details, sole and heel visible, professional product photography',
        category: 'essential',
    },
    {
        id: 'front_straight',
        name: 'Front View',
        description: 'Symmetric frontal shot for toe box details',
        emoji: '🎯',
        prompt: 'Direct front view, symmetrical composition, showcasing toe box, laces, front branding, straight-on angle, centered framing, studio product shot',
        category: 'essential',
    },
    {
        id: 'dynamic_low',
        name: 'Low Angle Power',
        description: 'Dramatic ground-level perspective',
        emoji: '⚡',
        prompt: 'Low angle ground-level shot looking upward, dramatic and powerful perspective, emphasizes height and presence, urban street context, cinematic feel, slightly tilted',
        category: 'dramatic',
    },
    {
        id: 'birds_eye',
        name: 'Top-Down Flat',
        description: 'Overhead view for lacing and top details',
        emoji: '🦅',
        prompt: 'Overhead top-down view (birds eye), looking directly down at shoes, clean surface, shows top pattern and lacing clearly, styled flat lay aesthetic, perfect symmetry',
        category: 'detail',
    },
    {
        id: 'back_heel',
        name: 'Back Heel Shot',
        description: 'Highlight heel design and branding',
        emoji: '🔙',
        prompt: 'Back angle view focusing on heel counter and back branding, slightly elevated, showing heel shape and pull tab, professional angle for athletic shoes',
        category: 'detail',
    },
    {
        id: 'sole_focus',
        name: 'Sole Display',
        description: 'Showcase tread pattern and technology',
        emoji: '👣',
        prompt: 'Angled shot with visible sole, showing tread pattern and technology, tilted shoe position, macro details on outsole grip and cushioning, tech-focused composition',
        category: 'detail',
    },
    {
        id: 'lifestyle_walking',
        name: 'Walking Motion',
        description: 'Natural in-motion lifestyle shot',
        emoji: '🚶',
        prompt: 'Mid-step walking pose on feet, natural motion captured, lifestyle photography, urban or nature setting, focus maintained on shoes while suggesting movement',
        category: 'lifestyle',
    },
    {
        id: 'lifestyle_crossed',
        name: 'Crossed Stance',
        description: 'Relaxed crossed-leg pose',
        emoji: '🦵',
        prompt: 'Relaxed standing pose with weight shifted, one foot crossed over, casual lifestyle shot, shows shoes from unique angle, modern editorial style',
        category: 'lifestyle',
    },
    {
        id: 'artistic_floating',
        name: 'Floating/Suspended',
        description: 'Creative levitating shoe shot',
        emoji: '✨',
        prompt: 'Creative floating shoe shot, levitating with dynamic shadows, artistic product photography, dramatic lighting, shows shoe from unconventional suspended angle',
        category: 'creative',
    },
];

/**
 * Category filters for organization
 */
const CATEGORIES = [
    { id: 'all', label: 'All Angles', icon: Compass },
    { id: 'essential', label: 'Essential', icon: Camera },
    { id: 'detail', label: 'Detail Shots', icon: Focus },
    { id: 'dramatic', label: 'Dramatic', icon: Target },
    { id: 'lifestyle', label: 'Lifestyle', icon: Eye },
    { id: 'creative', label: 'Creative', icon: Sparkles },
];

/**
 * Animation variants
 */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
};

/**
 * Premium Camera Angle Selection Component
 */
function ShoeCameraAngleSelection({ selectedAngle, onAngleSelect }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredAngles = activeCategory === 'all'
        ? CAMERA_ANGLES
        : CAMERA_ANGLES.filter(a => a.category === activeCategory);

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-shoes to-orange-600 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Camera Angle</h3>
                        <p className="text-sm text-slate-400">Choose how your shoe will be framed</p>
                    </div>
                </div>
                {selectedAngle && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1.5 bg-shoes/20 rounded-full flex items-center gap-2"
                    >
                        <span className="text-lg">{selectedAngle.emoji}</span>
                        <span className="text-sm font-medium text-shoes">{selectedAngle.name}</span>
                    </motion.div>
                )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                        <motion.button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                transition-all duration-200
                ${isActive
                                    ? 'bg-shoes text-white shadow-lg shadow-shoes/30'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }
              `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Icon className="w-4 h-4" />
                            {cat.label}
                        </motion.button>
                    );
                })}
            </div>

            {/* Angle Cards Grid */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={activeCategory}
            >
                <AnimatePresence mode="popLayout">
                    {filteredAngles.map((angle) => {
                        const isSelected = selectedAngle?.id === angle.id;

                        return (
                            <motion.button
                                key={angle.id}
                                variants={itemVariants}
                                layout
                                onClick={() => onAngleSelect(angle)}
                                className={`
                  relative group p-4 rounded-2xl border-2 transition-all duration-300
                  flex flex-col items-center text-center gap-2
                  ${isSelected
                                        ? 'bg-shoes/15 border-shoes shadow-xl shadow-shoes/20 scale-[1.02]'
                                        : 'bg-white/5 border-white/10 hover:border-shoes/40 hover:bg-white/[0.07]'
                                    }
                `}
                                whileHover={{ scale: isSelected ? 1.02 : 1.04 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Popular Badge */}
                                {angle.popular && (
                                    <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-shoes to-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
                                        ⭐ Best
                                    </div>
                                )}

                                {/* Emoji Icon */}
                                <div className={`
                  text-3xl transition-transform duration-300
                  ${isSelected ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}
                `}>
                                    {angle.emoji}
                                </div>

                                {/* Name */}
                                <h4 className="font-bold text-white text-sm leading-tight">
                                    {angle.name}
                                </h4>

                                {/* Description */}
                                <p className="text-xs text-slate-400 leading-tight line-clamp-2 group-hover:text-slate-300">
                                    {angle.description}
                                </p>

                                {/* Selection Indicator */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 left-2 w-5 h-5 bg-shoes rounded-full flex items-center justify-center"
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

export { CAMERA_ANGLES };
export default ShoeCameraAngleSelection;
