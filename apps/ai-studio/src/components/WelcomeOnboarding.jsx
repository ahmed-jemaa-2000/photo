import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Upload, Palette, Wand2, ChevronRight, X } from 'lucide-react';

const ONBOARDING_STEPS = [
    {
        icon: Upload,
        title: 'Upload Your Product',
        description: 'Start by uploading a clear photo of your product. Better quality = better results.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Palette,
        title: 'Choose Your Style',
        description: 'Select a model, pose, and photography style that matches your brand aesthetic.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Wand2,
        title: 'Generate Magic',
        description: 'Our AI creates professional product photos in under a minute. Try again until perfect!',
        color: 'from-amber-500 to-orange-500',
    },
];

const STORAGE_KEY = 'brandini_onboarding_complete';

/**
 * Welcome Onboarding Modal
 * Shows 3 quick steps for first-time users
 */
export default function WelcomeOnboarding() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Check if user has completed onboarding
        const completed = localStorage.getItem(STORAGE_KEY);
        if (!completed) {
            // Show after a short delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleComplete = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsOpen(false);
    };

    const handleNext = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleSkip}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <div className="pt-8 pb-6 px-8 text-center">
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-4"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                            >
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Welcome to AI Studio</span>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Create Pro Photos in 3 Steps
                            </h2>
                            <p className="text-slate-400 text-sm">
                                No photography skills needed
                            </p>
                        </div>

                        {/* Step Content */}
                        <div className="px-8 pb-6">
                            <AnimatePresence mode="wait">
                                {ONBOARDING_STEPS.map((step, index) => (
                                    index === currentStep && (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="text-center"
                                        >
                                            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                                                <step.icon className="w-10 h-10 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                                        </motion.div>
                                    )
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Step Indicators */}
                        <div className="flex justify-center gap-2 pb-6">
                            {ONBOARDING_STEPS.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                                            ? 'w-8 bg-primary'
                                            : index < currentStep
                                                ? 'w-2 bg-primary/50'
                                                : 'w-2 bg-white/20'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="px-8 pb-8 flex gap-3">
                            <button
                                onClick={handleSkip}
                                className="flex-1 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            >
                                Skip
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                {currentStep < ONBOARDING_STEPS.length - 1 ? (
                                    <>
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Get Started
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
