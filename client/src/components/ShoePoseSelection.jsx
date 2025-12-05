import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    User,
    Footprints,
    Heart,
    Zap,
    CheckCircle2,
    Sparkles,
    Target
} from 'lucide-react';

/**
 * Comprehensive shoe pose options for on-feet product photography
 */
const SHOE_POSES = [
    // Standing Poses
    {
        id: 'stand_classic',
        name: 'Classic Stand',
        description: 'Natural standing, weight evenly balanced',
        emoji: '🧍',
        prompt: 'Standing pose with weight evenly distributed, feet slightly apart (hip-width), natural relaxed stance, both shoes fully visible, professional catalogue photography',
        category: 'standing',
        popular: true,
    },
    {
        id: 'stand_crossed',
        name: 'Crossed Casual',
        description: 'One foot crossed over, relaxed vibe',
        emoji: '🦵',
        prompt: 'Casual standing pose with one ankle crossed over the other, relaxed and confident stance, lifestyle photography style, urban context',
        category: 'standing',
    },
    {
        id: 'stand_weight_shift',
        name: 'Weight Shifted',
        description: 'Hip pop, model-like stance',
        emoji: '💃',
        prompt: 'Standing with weight shifted to one leg, slight hip angle, one foot forward, confident fashion model stance, editorial style',
        category: 'standing',
    },
    {
        id: 'stand_tiptoe',
        name: 'Tiptoe Elegant',
        description: 'On toes for elongated look (heels)',
        emoji: '🩰',
        prompt: 'Standing on tiptoes, elegant elongated leg line, perfect for heels and formal shoes, ballet-inspired graceful pose',
        category: 'standing',
    },

    // Walking/Movement Poses
    {
        id: 'walk_stride',
        name: 'Mid-Stride Walk',
        description: 'Captured mid-step in motion',
        emoji: '🚶',
        prompt: 'Walking pose captured mid-stride, one foot forward lifting off ground, natural arm movement, dynamic lifestyle shot, focus on shoes in motion',
        category: 'walking',
        popular: true,
    },
    {
        id: 'walk_direction',
        name: 'Walking Away',
        description: 'Back view walking forward',
        emoji: '🚶‍♂️',
        prompt: 'Walking away from camera, back view, showing heel and sole in motion, storytelling lifestyle shot, destination-focused composition',
        category: 'walking',
    },
    {
        id: 'walk_stair',
        name: 'Stair Step',
        description: 'Ascending stairs angle',
        emoji: '🪜',
        prompt: 'Walking up stairs or steps, dynamic angle showing shoe flex and grip, urban architectural context, interesting perspective',
        category: 'walking',
    },

    // Dynamic/Action Poses
    {
        id: 'jump_float',
        name: 'Jump/Float',
        description: 'Mid-air suspended shot',
        emoji: '⬆️',
        prompt: 'Mid-air jump shot, shoes floating in suspension, dynamic and energetic, shows sole and upper simultaneously, action sports photography style',
        category: 'dynamic',
    },
    {
        id: 'run_sprint',
        name: 'Running Sprint',
        description: 'Athletic running motion',
        emoji: '🏃',
        prompt: 'Running/sprinting pose, athletic in motion, showing shoe performance, track or urban running context, sports photography style',
        category: 'dynamic',
    },
    {
        id: 'kick_up',
        name: 'Heel Kick Up',
        description: 'Playful foot kicked back',
        emoji: '👢',
        prompt: 'Standing with one foot kicked up behind, playful and flirty pose, shows sole clearly, fun lifestyle shot',
        category: 'dynamic',
    },

    // Seated/Relaxed Poses
    {
        id: 'sit_extended',
        name: 'Legs Extended',
        description: 'Seated with legs stretched forward',
        emoji: '🛋️',
        prompt: 'Seated pose with legs extended toward camera, shallow depth of field, shoes as clear focal point, relaxed lifestyle context',
        category: 'seated',
    },
    {
        id: 'sit_cross',
        name: 'Crossed Seated',
        description: 'Legs crossed showing ankles',
        emoji: '🧘',
        prompt: 'Seated with legs crossed at ankles, casual and comfortable, coffee shop or home context, lifestyle photography',
        category: 'seated',
    },
    {
        id: 'sit_dangling',
        name: 'Feet Dangling',
        description: 'Sitting high with feet dangling',
        emoji: '🪑',
        prompt: 'Sitting on elevated surface with feet dangling, carefree and youthful, shows shoes from unique angle, creative lifestyle shot',
        category: 'seated',
    },

    // Creative/Editorial Poses
    {
        id: 'creative_floor',
        name: 'Floor Art',
        description: 'Artistic ground-level composition',
        emoji: '🎨',
        prompt: 'Creative floor-level shot, artistic composition with legs and shoes, editorial fashion photography, unconventional angle',
        category: 'creative',
    },
    {
        id: 'creative_mirror',
        name: 'Mirror Reflection',
        description: 'Double vision reflection shot',
        emoji: '🪞',
        prompt: 'Mirror or reflective surface shot, showing shoes with their reflection, artistic double image, modern editorial style',
        category: 'creative',
    },
    {
        id: 'creative_shadow',
        name: 'Shadow Play',
        description: 'Dramatic shadow emphasis',
        emoji: '🌓',
        prompt: 'Creative shadow play, shoes with dramatic long shadow, artistic and moody, late afternoon light, cinematic composition',
        category: 'creative',
    },
];

/**
 * Pose categories
 */
const POSE_CATEGORIES = [
    { id: 'all', label: 'All Poses', icon: Target, count: SHOE_POSES.length },
    { id: 'standing', label: 'Standing', icon: User, count: SHOE_POSES.filter(p => p.category === 'standing').length },
    { id: 'walking', label: 'Walking', icon: Footprints, count: SHOE_POSES.filter(p => p.category === 'walking').length },
    { id: 'dynamic', label: 'Dynamic', icon: Zap, count: SHOE_POSES.filter(p => p.category === 'dynamic').length },
    { id: 'seated', label: 'Seated', icon: Heart, count: SHOE_POSES.filter(p => p.category === 'seated').length },
    { id: 'creative', label: 'Creative', icon: Sparkles, count: SHOE_POSES.filter(p => p.category === 'creative').length },
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
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
};

/**
 * Premium Shoe Pose Selection Component
 */
function ShoePoseSelection({ selectedPose, onPoseSelect }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredPoses = activeCategory === 'all'
        ? SHOE_POSES
        : SHOE_POSES.filter(p => p.category === activeCategory);

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Model Pose</h3>
                        <p className="text-sm text-slate-400">How should the model wear your shoes?</p>
                    </div>
                </div>
                {selectedPose && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1.5 bg-emerald-500/20 rounded-full flex items-center gap-2"
                    >
                        <span className="text-lg">{selectedPose.emoji}</span>
                        <span className="text-sm font-medium text-emerald-400">{selectedPose.name}</span>
                    </motion.div>
                )}
            </div>

            {/* Category Filter Tabs with Counts */}
            <div className="flex flex-wrap gap-2">
                {POSE_CATEGORIES.map((cat) => {
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
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }
              `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Icon className="w-4 h-4" />
                            {cat.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                                {cat.count}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Pose Cards Grid */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={activeCategory}
            >
                <AnimatePresence mode="popLayout">
                    {filteredPoses.map((pose) => {
                        const isSelected = selectedPose?.id === pose.id;

                        return (
                            <motion.button
                                key={pose.id}
                                variants={itemVariants}
                                layout
                                onClick={() => onPoseSelect(pose)}
                                className={`
                  relative group p-4 rounded-2xl border-2 transition-all duration-300
                  flex flex-col items-center text-center gap-2
                  ${isSelected
                                        ? 'bg-emerald-500/15 border-emerald-500 shadow-xl shadow-emerald-500/20 scale-[1.02]'
                                        : 'bg-white/5 border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.07]'
                                    }
                `}
                                whileHover={{ scale: isSelected ? 1.02 : 1.04 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Popular Badge */}
                                {pose.popular && (
                                    <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg">
                                        ⭐
                                    </div>
                                )}

                                {/* Emoji Icon */}
                                <div className={`
                  text-4xl transition-transform duration-300
                  ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                `}>
                                    {pose.emoji}
                                </div>

                                {/* Name */}
                                <h4 className="font-bold text-white text-sm leading-tight">
                                    {pose.name}
                                </h4>

                                {/* Description */}
                                <p className="text-xs text-slate-400 leading-tight line-clamp-2 group-hover:text-slate-300">
                                    {pose.description}
                                </p>

                                {/* Selection Indicator */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 left-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
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

export { SHOE_POSES };
export default ShoePoseSelection;
