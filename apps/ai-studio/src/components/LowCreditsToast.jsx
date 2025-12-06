import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

/**
 * Toast notification for low credits in AI Studio
 * Shows once per session when credits drop to threshold
 */
export function LowCreditsToast({ balance, threshold = 3, onDismiss }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Only show if balance is at or below threshold
        if (balance === null || balance === undefined) return;
        if (balance > threshold) return;

        // Check session storage to show only once per session
        const shownKey = 'low_credits_toast_shown';
        const alreadyShown = sessionStorage.getItem(shownKey);

        if (!alreadyShown) {
            setVisible(true);
            sessionStorage.setItem(shownKey, 'true');

            // Auto-hide after 8 seconds
            const timer = setTimeout(() => {
                setVisible(false);
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [balance, threshold]);

    const handleDismiss = () => {
        setVisible(false);
        onDismiss?.();
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -50, x: '-50%' }}
                    className="fixed top-4 left-1/2 z-50 max-w-md w-full mx-4"
                >
                    <div className="bg-amber-500 text-white rounded-2xl p-4 shadow-xl flex items-start gap-3">
                        <div className="flex-shrink-0 bg-white/20 rounded-full p-2">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold mb-1">Low Credits</h4>
                            <p className="text-sm text-amber-100">
                                You have {balance} credit{balance !== 1 ? 's' : ''} remaining.
                                Contact support to top up.
                            </p>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default LowCreditsToast;
