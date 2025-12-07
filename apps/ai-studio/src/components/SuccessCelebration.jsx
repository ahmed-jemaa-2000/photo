import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Confetti Particle Component
 */
const ConfettiParticle = ({ delay, x, color }) => (
    <motion.div
        className="absolute w-2 h-2 rounded-full"
        style={{ backgroundColor: color, left: x }}
        initial={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
        animate={{
            y: [0, -150, 300],
            opacity: [1, 1, 0],
            rotate: [0, 360, 720],
            scale: [1, 1.2, 0.5],
            x: [0, Math.random() * 100 - 50],
        }}
        transition={{
            duration: 2,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
        }}
    />
);

/**
 * Success Celebration Animation
 * Shows confetti burst + success message on successful generation
 */
export default function SuccessCelebration({ show, onComplete }) {
    const [particles, setParticles] = useState([]);

    const colors = [
        '#8B5CF6', // Primary purple
        '#EC4899', // Pink
        '#F59E0B', // Amber
        '#10B981', // Emerald
        '#3B82F6', // Blue
        '#EF4444', // Red
    ];

    useEffect(() => {
        if (show) {
            // Create particles
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: `${Math.random() * 100}%`,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.5,
            }));
            setParticles(newParticles);

            // Auto-hide after animation
            const timer = setTimeout(() => {
                setParticles([]);
                onComplete?.();
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [show]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Confetti particles */}
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
                        {particles.map((p) => (
                            <ConfettiParticle key={p.id} {...p} />
                        ))}
                    </div>

                    {/* Success burst */}
                    <motion.div
                        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50">
                            <Sparkles className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>

                    {/* Radial burst lines */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute top-1/3 left-1/2 w-1 h-20 bg-gradient-to-t from-primary to-transparent origin-bottom"
                            style={{
                                transform: `translateX(-50%) rotate(${i * 45}deg)`,
                            }}
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0] }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Pulse ring effect for the Generate button on success
 */
export function SuccessPulse({ show }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="absolute inset-0 rounded-xl"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
                    }}
                />
            )}
        </AnimatePresence>
    );
}
