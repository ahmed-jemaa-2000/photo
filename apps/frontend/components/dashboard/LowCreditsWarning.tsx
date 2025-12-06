'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface LowCreditsWarningProps {
    balance: number;
    threshold?: number;
}

/**
 * Warning banner displayed when user's credit balance is low
 * Dismissable and remembers dismissal in localStorage
 */
export default function LowCreditsWarning({
    balance,
    threshold = 3
}: LowCreditsWarningProps) {
    const [dismissed, setDismissed] = useState(true); // Start hidden until we check

    useEffect(() => {
        // Check localStorage for dismissal
        const dismissKey = `low_credits_warning_dismissed_${threshold}`;
        const dismissedAt = localStorage.getItem(dismissKey);

        if (dismissedAt) {
            // Re-show after 24 hours
            const dismissedTime = parseInt(dismissedAt, 10);
            const now = Date.now();
            const oneDayMs = 24 * 60 * 60 * 1000;

            if (now - dismissedTime < oneDayMs) {
                setDismissed(true);
                return;
            }
        }

        setDismissed(false);
    }, [threshold]);

    const handleDismiss = () => {
        const dismissKey = `low_credits_warning_dismissed_${threshold}`;
        localStorage.setItem(dismissKey, Date.now().toString());
        setDismissed(true);
    };

    // Only show if balance is at or below threshold and not dismissed
    if (balance > threshold || dismissed) {
        return null;
    }

    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 mb-6 relative">
            <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 p-1 hover:bg-amber-100 rounded-lg transition"
                aria-label="Dismiss warning"
            >
                <X className="w-4 h-4 text-amber-600" />
            </button>

            <div className="flex items-start gap-4 pr-8">
                <div className="text-3xl flex-shrink-0">⚠️</div>
                <div className="flex-1">
                    <h3 className="font-semibold text-amber-800 mb-1">
                        Low Credits Warning
                    </h3>
                    <p className="text-amber-700 text-sm mb-3">
                        You have <span className="font-bold">{balance}</span> credit{balance !== 1 ? 's' : ''} remaining.
                        {balance === 0
                            ? " You won't be able to generate new AI photos."
                            : " Top up to continue generating AI photos."}
                    </p>
                    <a
                        href="mailto:support@brandili.shop?subject=Credit Top-up Request"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition"
                    >
                        📧 Contact Us to Top Up
                    </a>
                </div>
            </div>
        </div>
    );
}
