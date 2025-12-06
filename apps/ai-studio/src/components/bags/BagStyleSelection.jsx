import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    ArrowLeft,
    ShoppingBag,
    CheckCircle2,
    Backpack,
    Package
} from 'lucide-react';

/**
 * Bag styles configuration
 */
const BAG_STYLES = [
    {
        id: 'handbag',
        name: 'Handbag',
        description: 'Classic handbags, purses & clutches',
        icon: ShoppingBag,
        prompt: 'Fashion handbag held elegantly, professional product photography, clear details on hardware and stitching',
        previewPlaceholder: '👜',
    },
    {
        id: 'backpack',
        name: 'Backpack',
        description: 'Casual & travel backpacks',
        icon: Backpack,
        prompt: 'Backpack worn on model, lifestyle shot, showing straps and design, urban context',
        previewPlaceholder: '🎒',
    },
    {
        id: 'tote',
        name: 'Tote Bag',
        description: 'Shopping & everyday totes',
        icon: Package,
        prompt: 'Large tote bag held by handles, professional fashion photography, spacious interior visible',
        previewPlaceholder: '👝',
    },
    {
        id: 'crossbody',
        name: 'Crossbody',
        description: 'Crossbody & messenger bags',
        icon: Briefcase,
        prompt: 'Crossbody bag worn across body, showing strap and closure, lifestyle fashion shot',
        previewPlaceholder: '💼',
    },
    {
        id: 'clutch',
        name: 'Clutch',
        description: 'Evening clutches & wallets',
        icon: Package,
        prompt: 'Elegant clutch bag held in hand, evening/formal setting, premium materials and details visible',
        previewPlaceholder: '👛',
    },
    {
        id: 'duffle',
        name: 'Duffle Bag',
        description: 'Gym & travel duffles',
        icon: Package,
        prompt: 'Duffle bag in action, sporty or travel context, showing handles and compartments',
        previewPlaceholder: '🧳',
    },
];

/**
 * Animation variants
 */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
        },
    },
};

/**
 * Bag Style Card Component
 */
const BagStyleCard = ({ style, isSelected, onSelect }) => {
    const Icon = style.icon;

    return (
        <motion.button
            variants={itemVariants}
            onClick={() => onSelect(style)}
            className={`
        group relative p-5 rounded-2xl border-2 
        flex flex-col items-center text-center gap-3
        transition-all duration-300 overflow-hidden
        ${isSelected
                    ? 'bg-bags/15 border-bags shadow-xl shadow-bags/20 scale-105'
                    : 'bg-white/5 border-white/10 hover:border-bags/40 hover:bg-white/[0.07]'
                }
      `}
            whileHover={{ scale: isSelected ? 1.05 : 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            {/* Icon/Preview */}
            <div className={`
        w-16 h-16 rounded-xl flex items-center justify-center
        text-3xl transition-all duration-300
        ${isSelected
                    ? 'bg-bags text-white shadow-lg'
                    : 'bg-white/10 text-slate-400 group-hover:text-bags group-hover:bg-white/15'
                }
      `}>
                {style.previewPlaceholder}
            </div>

            {/* Text */}
            <div>
                <h4 className="font-bold text-white text-lg mb-0.5">
                    {style.name}
                </h4>
                <p className="text-xs text-slate-400 group-hover:text-slate-300">
                    {style.description}
                </p>
            </div>

            {/* Selection indicator */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-bags flex items-center justify-center"
                >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                </motion.div>
            )}
        </motion.button>
    );
};

/**
 * Main BagStyleSelection Component
 */
const BagStyleSelection = ({
    selectedStyle,
    onStyleSelect,
    className = ''
}) => {
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                    Choose Bag Type
                </h3>
                <p className="text-slate-400">
                    Select the type of bag you're photographing
                </p>
            </div>

            {/* Style Grid */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {BAG_STYLES.map((style) => (
                    <BagStyleCard
                        key={style.id}
                        style={style}
                        isSelected={selectedStyle?.id === style.id}
                        onSelect={onStyleSelect}
                    />
                ))}
            </motion.div>

            {/* Selected Info */}
            {selectedStyle && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-bags/10 border border-bags/30"
                >
                    <p className="text-sm text-bags-light">
                        <span className="font-semibold">Selected:</span> {selectedStyle.name} — {selectedStyle.description}
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export { BAG_STYLES };
export default BagStyleSelection;
