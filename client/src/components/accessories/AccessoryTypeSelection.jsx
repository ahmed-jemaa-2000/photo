import React from 'react';
import { motion } from 'framer-motion';
import {
    Gem,
    Watch,
    Glasses,
    Wind,
    Crown,
    CheckCircle2
} from 'lucide-react';

/**
 * Accessory types configuration
 */
const ACCESSORY_TYPES = [
    {
        id: 'jewelry',
        name: 'Jewelry',
        description: 'Necklaces, bracelets, rings & earrings',
        icon: Gem,
        color: 'from-amber-400 to-yellow-500',
        subtypes: [
            { id: 'necklace', name: 'Necklace', prompt: 'Elegant necklace on model, close-up on neck and collarbone, soft lighting emphasizing jewelry details' },
            { id: 'bracelet', name: 'Bracelet', prompt: 'Bracelet on wrist, lifestyle shot with natural hand pose, focus on craftsmanship' },
            { id: 'ring', name: 'Ring', prompt: 'Ring on finger, close-up product shot, beautiful hand pose, macro detail on design' },
            { id: 'earrings', name: 'Earrings', prompt: 'Earrings on model, profile or 3/4 face shot, hair styled to show earrings, soft lighting' },
        ],
    },
    {
        id: 'watches',
        name: 'Watches',
        description: 'Wrist & smart watches',
        icon: Watch,
        color: 'from-slate-400 to-zinc-500',
        subtypes: [
            { id: 'wrist_watch', name: 'Wrist Watch', prompt: 'Luxury watch on wrist, arm in elegant pose, lifestyle context, focus on watch face and band' },
            { id: 'smart_watch', name: 'Smart Watch', prompt: 'Smart watch on wrist, active lifestyle context, screen visible, modern tech aesthetic' },
        ],
    },
    {
        id: 'eyewear',
        name: 'Eyewear',
        description: 'Sunglasses & optical frames',
        icon: Glasses,
        color: 'from-blue-400 to-indigo-500',
        subtypes: [
            { id: 'sunglasses', name: 'Sunglasses', prompt: 'Sunglasses on model face, outdoor setting, stylish pose, emphasis on frame design' },
            { id: 'optical', name: 'Optical Frames', prompt: 'Glasses on model, professional or lifestyle setting, clear view of frame design and fit' },
        ],
    },
    {
        id: 'scarves',
        name: 'Scarves & Wraps',
        description: 'Scarves, shawls & hijabs',
        icon: Wind,
        color: 'from-rose-400 to-pink-500',
        subtypes: [
            { id: 'scarf', name: 'Scarf', prompt: 'Scarf styled on model, elegant draping, fashion photography showing fabric texture and pattern' },
            { id: 'hijab', name: 'Hijab', prompt: 'Hijab styled beautifully on model, modest fashion photography, professional lighting and elegant pose' },
            { id: 'shawl', name: 'Shawl', prompt: 'Shawl draped over shoulders, lifestyle or formal setting, showing full design and fabric quality' },
        ],
    },
    {
        id: 'hats',
        name: 'Hats & Headwear',
        description: 'Caps, beanies & hats',
        icon: Crown,
        color: 'from-emerald-400 to-teal-500',
        subtypes: [
            { id: 'cap', name: 'Cap', prompt: 'Cap on model, casual streetwear style, showing logo and design, urban context' },
            { id: 'beanie', name: 'Beanie', prompt: 'Beanie on model, cozy winter aesthetic, lifestyle shot with casual outfit' },
            { id: 'hat', name: 'Hat', prompt: 'Hat on model, fashion or lifestyle setting, showing shape and style, professional photography' },
        ],
    },
];

/**
 * Animation variants
 */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
};

/**
 * Accessory Type Card
 */
const AccessoryTypeCard = ({ type, isSelected, onSelect }) => {
    const Icon = type.icon;

    return (
        <motion.button
            variants={itemVariants}
            onClick={() => onSelect(type)}
            className={`
        group relative p-6 rounded-2xl border-2 
        flex flex-col items-center text-center gap-4
        transition-all duration-300 overflow-hidden
        ${isSelected
                    ? 'bg-accessories/15 border-accessories shadow-xl shadow-accessories/20 scale-105'
                    : 'bg-white/5 border-white/10 hover:border-accessories/40 hover:bg-white/[0.07]'
                }
      `}
            whileHover={{ scale: isSelected ? 1.05 : 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            {/* Icon Container */}
            <div className={`
        w-16 h-16 rounded-2xl flex items-center justify-center
        transition-all duration-300 bg-gradient-to-br
        ${isSelected
                    ? `${type.color} text-white shadow-lg`
                    : 'from-white/10 to-white/5 text-slate-400 group-hover:text-accessories'
                }
      `}>
                <Icon className="w-8 h-8" />
            </div>

            {/* Text */}
            <div>
                <h4 className="font-bold text-white text-lg mb-1">
                    {type.name}
                </h4>
                <p className="text-sm text-slate-400 group-hover:text-slate-300">
                    {type.description}
                </p>
            </div>

            {/* Subtype count */}
            <span className="text-xs text-slate-500">
                {type.subtypes.length} options
            </span>

            {/* Selection indicator */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accessories flex items-center justify-center"
                >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                </motion.div>
            )}
        </motion.button>
    );
};

/**
 * Subtype Selection Component
 */
const SubtypeSelection = ({ parentType, selectedSubtype, onSubtypeSelect }) => {
    if (!parentType) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-5 bg-white/5 rounded-2xl border border-white/10"
        >
            <h4 className="text-lg font-semibold text-white mb-4">
                Select {parentType.name} Type
            </h4>
            <div className="flex flex-wrap gap-3">
                {parentType.subtypes.map((subtype) => (
                    <motion.button
                        key={subtype.id}
                        onClick={() => onSubtypeSelect(subtype)}
                        className={`
              px-4 py-2.5 rounded-xl font-medium
              transition-all duration-200
              ${selectedSubtype?.id === subtype.id
                                ? 'bg-accessories text-white shadow-lg'
                                : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                            }
            `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {subtype.name}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

/**
 * Main AccessoryTypeSelection Component
 */
const AccessoryTypeSelection = ({
    selectedType,
    selectedSubtype,
    onTypeSelect,
    onSubtypeSelect,
    className = ''
}) => {
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                    Accessory Type
                </h3>
                <p className="text-slate-400">
                    Select the type of accessory you want to showcase
                </p>
            </div>

            {/* Type Grid */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {ACCESSORY_TYPES.map((type) => (
                    <AccessoryTypeCard
                        key={type.id}
                        type={type}
                        isSelected={selectedType?.id === type.id}
                        onSelect={onTypeSelect}
                    />
                ))}
            </motion.div>

            {/* Subtype Selection */}
            <SubtypeSelection
                parentType={selectedType}
                selectedSubtype={selectedSubtype}
                onSubtypeSelect={onSubtypeSelect}
            />
        </div>
    );
};

export { ACCESSORY_TYPES };
export default AccessoryTypeSelection;
