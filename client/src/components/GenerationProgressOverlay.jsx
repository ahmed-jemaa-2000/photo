import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    ScanLine,
    User,
    Layers,
    Wand2,
    Camera,
    Footprints,
    ShoppingBag,
    Watch,
    Sun,
    Palette,
    X,
    Lightbulb
} from 'lucide-react';

/**
 * GenerationProgressOverlay - Premium multi-phase loading overlay
 * Shows category-specific progress phases and rotating tips
 */

// Phase configurations by category
const PHASE_CONFIGS = {
    clothes: [
        { id: 1, label: 'Analyzing garment structure', icon: ScanLine, duration: 0.12 },
        { id: 2, label: 'Detecting colors & patterns', icon: Palette, duration: 0.15 },
        { id: 3, label: 'Selecting model pose', icon: User, duration: 0.20 },
        { id: 4, label: 'Composing scene & lighting', icon: Layers, duration: 0.28 },
        { id: 5, label: 'Rendering final details', icon: Sparkles, duration: 0.25 },
    ],
    shoes: [
        { id: 1, label: 'Analyzing footwear design', icon: ScanLine, duration: 0.12 },
        { id: 2, label: 'Detecting materials & colors', icon: Palette, duration: 0.15 },
        { id: 3, label: 'Positioning on model', icon: Footprints, duration: 0.20 },
        { id: 4, label: 'Setting camera angle', icon: Camera, duration: 0.28 },
        { id: 5, label: 'Polishing final shot', icon: Sparkles, duration: 0.25 },
    ],
    bags: [
        { id: 1, label: 'Analyzing bag structure', icon: ScanLine, duration: 0.12 },
        { id: 2, label: 'Detecting hardware & materials', icon: Palette, duration: 0.15 },
        { id: 3, label: 'Styling with model', icon: ShoppingBag, duration: 0.20 },
        { id: 4, label: 'Adjusting scene composition', icon: Layers, duration: 0.28 },
        { id: 5, label: 'Final quality enhancement', icon: Sparkles, duration: 0.25 },
    ],
    accessories: [
        { id: 1, label: 'Analyzing accessory details', icon: ScanLine, duration: 0.12 },
        { id: 2, label: 'Capturing material shine', icon: Sun, duration: 0.15 },
        { id: 3, label: 'Setting up close-up shot', icon: Watch, duration: 0.20 },
        { id: 4, label: 'Perfecting lighting', icon: Camera, duration: 0.28 },
        { id: 5, label: 'Adding final sparkle', icon: Sparkles, duration: 0.25 },
    ],
};

// Fun tips that rotate during generation
const TIPS = [
    { icon: '💡', text: 'Pro tip: Clean backgrounds produce the best results!' },
    { icon: '🎨', text: 'Color Lock preserves your exact product color.' },
    { icon: '📸', text: 'High-resolution uploads create sharper results.' },
    { icon: '✨', text: 'Try different poses for variety in your shots.' },
    { icon: '🌟', text: 'Good lighting in your product photo = better AI results.' },
    { icon: '🎯', text: 'Center your product in the frame for best detection.' },
    { icon: '👗', text: 'Flat lay photos work great for clothing items.' },
    { icon: '💎', text: 'Premium quality takes a moment - worth the wait!' },
];

function GenerationProgressOverlay({ isGenerating, category = 'clothes', onCancel }) {
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const phases = useMemo(() => {
        return PHASE_CONFIGS[category] || PHASE_CONFIGS.clothes;
    }, [category]);

    // Calculate which phase we're in based on progress
    const currentPhase = useMemo(() => {
        let accumulated = 0;
        for (let i = 0; i < phases.length; i++) {
            accumulated += phases[i].duration * 100;
            if (progress <= accumulated) {
                return phases[i];
            }
        }
        return phases[phases.length - 1];
    }, [progress, phases]);

    // Progress timer
    useEffect(() => {
        if (!isGenerating) {
            setProgress(0);
            setTimeLeft(60);
            setCurrentPhaseIndex(0);
            setCurrentTipIndex(0);
            return;
        }

        const duration = 60 * 1000; // 60 seconds
        const intervalTime = 100;
        const increment = 100 / (duration / intervalTime);

        const progressTimer = setInterval(() => {
            setProgress(prev => {
                const next = prev + increment;
                return next >= 100 ? 100 : next;
            });

            setTimeLeft(prev => {
                const next = prev - 0.1;
                return next <= 0 ? 0 : next;
            });
        }, intervalTime);

        return () => clearInterval(progressTimer);
    }, [isGenerating]);

    // Phase cycling based on progress
    useEffect(() => {
        if (!isGenerating) return;

        let accumulated = 0;
        for (let i = 0; i < phases.length; i++) {
            accumulated += phases[i].duration * 100;
            if (progress <= accumulated) {
                setCurrentPhaseIndex(i);
                break;
            }
        }
    }, [progress, phases, isGenerating]);

    // Tip rotation every 8 seconds
    useEffect(() => {
        if (!isGenerating) return;

        const tipInterval = setInterval(() => {
            setCurrentTipIndex(prev => (prev + 1) % TIPS.length);
        }, 8000);

        return () => clearInterval(tipInterval);
    }, [isGenerating]);

    if (!isGenerating) return null;

    const PhaseIcon = currentPhase.icon;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = Math.floor(timeLeft % 60);

    // Category-specific gradient
    const categoryGradients = {
        clothes: 'from-purple-500 to-indigo-600',
        shoes: 'from-orange-500 to-amber-600',
        bags: 'from-pink-500 to-rose-600',
        accessories: 'from-teal-500 to-cyan-600',
    };
    const gradient = categoryGradients[category] || categoryGradients.clothes;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Cancel button */}
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            )}

            <div className="w-full max-w-md px-6 text-center space-y-8">
                {/* Animated Icon with Progress Ring */}
                <div className="relative w-40 h-40 mx-auto">
                    {/* Background glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-full blur-2xl opacity-30 animate-pulse`} />

                    {/* Progress ring background */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-white/10"
                        />
                        {/* Progress ring fill */}
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 70}
                            strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
                            className="transition-all duration-300 ease-linear"
                        />
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Center icon with animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPhase.id}
                                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0.5, opacity: 0, rotate: 20 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className={`p-4 rounded-2xl bg-gradient-to-br ${gradient}`}
                            >
                                <PhaseIcon className="w-12 h-12 text-white" />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Floating particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-primary/60"
                            style={{
                                left: '50%',
                                top: '50%',
                            }}
                            animate={{
                                x: [0, Math.cos(i * 60 * Math.PI / 180) * 80],
                                y: [0, Math.sin(i * 60 * Math.PI / 180) * 80],
                                opacity: [1, 0],
                                scale: [1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
                </div>

                {/* Phase Indicators */}
                <div className="flex justify-center gap-2">
                    {phases.map((phase, idx) => (
                        <motion.div
                            key={phase.id}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx < currentPhaseIndex
                                    ? 'bg-primary w-6'
                                    : idx === currentPhaseIndex
                                        ? 'bg-gradient-to-r from-primary to-secondary w-8'
                                        : 'bg-white/20 w-4'
                                }`}
                            initial={false}
                            animate={{
                                scale: idx === currentPhaseIndex ? [1, 1.1, 1] : 1,
                            }}
                            transition={{ duration: 0.5, repeat: idx === currentPhaseIndex ? Infinity : 0 }}
                        />
                    ))}
                </div>

                {/* Current Phase Text */}
                <div className="space-y-3">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={currentPhase.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-2xl font-bold text-white"
                        >
                            {currentPhase.label}
                        </motion.h2>
                    </AnimatePresence>

                    {/* Timer */}
                    <div className="text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        {minutes}:{seconds.toString().padStart(2, '0')}
                    </div>

                    {/* Progress percentage */}
                    <p className="text-sm text-slate-400">
                        {Math.round(progress)}% complete
                    </p>
                </div>

                {/* Rotating Tips */}
                <div className="pt-4 border-t border-white/10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentTipIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center justify-center gap-3 text-slate-400"
                        >
                            <span className="text-xl">{TIPS[currentTipIndex].icon}</span>
                            <span className="text-sm">{TIPS[currentTipIndex].text}</span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Subtle message */}
                <p className="text-xs text-slate-600">
                    AI is creating your professional product photo
                </p>
            </div>
        </motion.div>
    );
}

export default GenerationProgressOverlay;
