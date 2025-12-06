import React from 'react';
import { motion } from 'framer-motion';
import { User, Check } from 'lucide-react';

/**
 * Body size options for fit visualization
 * User selects their preferred body type for the model
 */
const BODY_SIZES = [
    {
        id: 'small',
        name: 'Small',
        label: 'S',
        description: 'Slim, petite build',
        prompt: 'Slim petite model with small frame, size XS-S body type, lean physique',
        icon: '👤',
    },
    {
        id: 'medium',
        name: 'Medium',
        label: 'M',
        description: 'Average, standard build',
        prompt: 'Average build model, size M body type, standard healthy physique',
        icon: '👤',
        recommended: true,
    },
    {
        id: 'large',
        name: 'Large',
        label: 'L',
        description: 'Curvy, plus size build',
        prompt: 'Curvy plus size model, size L-XL body type, fuller figure, body positive representation',
        icon: '👤',
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
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
};

function BodySizeSelection({ selectedSize, onSizeSelect }) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Model Body Type</h3>
                    <p className="text-sm text-slate-400">Choose the body size for your model</p>
                </div>
            </div>

            {/* Size Cards */}
            <motion.div
                className="grid grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {BODY_SIZES.map((size) => {
                    const isSelected = selectedSize === size.id;

                    return (
                        <motion.button
                            key={size.id}
                            variants={itemVariants}
                            onClick={() => onSizeSelect(size.id)}
                            className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                flex flex-col items-center text-center gap-3
                ${isSelected
                                    ? 'border-purple-400 bg-purple-500/20 shadow-xl shadow-purple-500/20'
                                    : 'border-white/10 bg-white/5 hover:border-purple-500/40 hover:bg-white/10'
                                }
              `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Recommended Badge */}
                            {size.recommended && (
                                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                    Popular
                                </div>
                            )}

                            {/* Size Label */}
                            <div className={`
                w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold
                ${isSelected
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/10 text-slate-300'
                                }
              `}>
                                {size.label}
                            </div>

                            {/* Name */}
                            <h4 className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                {size.name}
                            </h4>

                            {/* Description */}
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {size.description}
                            </p>

                            {/* Selection Indicator */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 left-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                                >
                                    <Check className="w-4 h-4 text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Info Text */}
            <p className="text-center text-sm text-slate-500">
                The garment will be shown on a model with the selected body type
            </p>
        </div>
    );
}

export { BODY_SIZES };
export default BodySizeSelection;
