'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    delay: number;
    size: number;
}

export function Confetti({ trigger }: { trigger: boolean }) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (trigger) {
            const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];
            const newPieces: ConfettiPiece[] = [];

            for (let i = 0; i < 50; i++) {
                newPieces.push({
                    id: i,
                    x: Math.random() * 100,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    delay: Math.random() * 0.5,
                    size: Math.random() * 8 + 4,
                });
            }

            setPieces(newPieces);

            // Clear after animation
            setTimeout(() => setPieces([]), 3000);
        }
    }, [trigger]);

    return (
        <AnimatePresence>
            {pieces.length > 0 && (
                <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
                    {pieces.map((piece) => (
                        <motion.div
                            key={piece.id}
                            initial={{
                                y: -20,
                                x: `${piece.x}vw`,
                                opacity: 1,
                                rotate: 0,
                            }}
                            animate={{
                                y: '100vh',
                                rotate: Math.random() * 720 - 360,
                                opacity: 0,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 2.5 + Math.random(),
                                delay: piece.delay,
                                ease: 'linear',
                            }}
                            style={{
                                position: 'absolute',
                                width: piece.size,
                                height: piece.size,
                                backgroundColor: piece.color,
                                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            }}
                        />
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
}

// Animated gradient button
export function GradientButton({
    children,
    onClick,
    className = '',
    variant = 'primary',
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'success' | 'purple';
}) {
    const gradients = {
        primary: 'from-blue-600 via-indigo-600 to-purple-600',
        success: 'from-emerald-500 via-green-500 to-teal-500',
        purple: 'from-purple-600 via-pink-600 to-rose-600',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
        relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-white
        bg-gradient-to-r ${gradients[variant]}
        shadow-lg hover:shadow-xl transition-shadow
        ${className}
      `}
        >
            {/* Animated shine effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
            />
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    );
}

// Floating particles background
export function FloatingParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full"
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}
        </div>
    );
}

// Success checkmark animation
export function SuccessCheckmark({ show }: { show: boolean }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg"
                >
                    <motion.svg
                        className="w-8 h-8 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <motion.path
                            d="M5 13l4 4L19 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </motion.svg>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Pulse ring effect
export function PulseRing({ color = 'purple' }: { color?: 'purple' | 'green' | 'blue' }) {
    const colors = {
        purple: 'bg-purple-500',
        green: 'bg-emerald-500',
        blue: 'bg-blue-500',
    };

    return (
        <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors[color]} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${colors[color]}`} />
        </span>
    );
}
