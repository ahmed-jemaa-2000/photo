import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * SuspenseFallback - Loading fallback for React.lazy components
 */
export default function SuspenseFallback({ message = 'Loading...' }) {
    return (
        <div className="flex items-center justify-center min-h-[200px] w-full">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-sm text-slate-400">{message}</span>
            </div>
        </div>
    );
}
