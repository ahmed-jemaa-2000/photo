import React from 'react';
import { motion } from 'framer-motion';
import { Coins, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Credit Badge - Displays user's credit balance in the header
 */
export default function CreditBadge({ credits, loading, error }) {
    if (loading) {
        // Skeleton loading state with shimmer
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="w-4 h-4 rounded-full bg-white/10 animate-pulse" />
                <div className="relative w-8 h-4 rounded bg-white/10 overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                <div className="hidden sm:block relative w-12 h-3 rounded bg-white/10 overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
            </div>
        );
    }

    // Not authenticated or error - don't show anything
    if (!credits || error) {
        return null;
    }

    const isLowBalance = credits.balance <= 3;
    const isVeryLowBalance = credits.balance <= 1;

    return (
        <motion.div
            className={`
        flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300
        ${isVeryLowBalance
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : isLowBalance
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-primary/10 border-primary/30 text-primary'
                }
      `}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
        >
            <Coins className="w-4 h-4" />
            <span className="text-sm font-semibold">{credits.balance}</span>
            <span className="text-xs text-slate-400 hidden sm:inline">credits</span>

            {isVeryLowBalance && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1"
                >
                    <AlertCircle className="w-4 h-4 text-red-400" />
                </motion.div>
            )}
        </motion.div>
    );
}

/**
 * Credit Cost Display - Shows cost of an action
 */
export function CreditCost({ type = 'photo', costs }) {
    if (!costs) return null;

    const cost = type === 'video' ? costs.video : costs.photo;

    return (
        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Coins className="w-3 h-3" />
            <span>{cost} credit{cost !== 1 ? 's' : ''}</span>
        </span>
    );
}
