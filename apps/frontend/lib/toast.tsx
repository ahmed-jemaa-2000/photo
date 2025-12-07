'use client';

import { toast as sonnerToast, ExternalToast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

// Custom toast wrapper with themed styles and animations
export const toast = {
    /**
     * Success toast with confetti-like burst animation
     */
    success: (message: string, options?: ExternalToast) => {
        sonnerToast.custom(
            (t) => (
                <motion.div
          initial= {{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
exit = {{ opacity: 0, y: -20, scale: 0.95 }}
className = "relative flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden min-w-[300px]"
    >
    {/* Success burst background animation */ }
    < motion.div
initial = {{ scale: 0, opacity: 0.5 }}
animate = {{ scale: 3, opacity: 0 }}
transition = {{ duration: 0.6, ease: 'easeOut' }}
className = "absolute -left-4 -top-4 w-16 h-16 bg-green-400 rounded-full"
    />

    {/* Confetti particles */ }
    < div className = "absolute inset-0 pointer-events-none" >
    {
        [...Array(6)].map((_, i) => (
            <motion.div
                key= { i }
                initial = {{
            opacity: 1,
            x: 20,
            y: 20,
            scale: 1
        }}
animate = {{
    opacity: 0,
        x: 20 + Math.random() * 60 - 30,
            y: -20 - Math.random() * 30,
                scale: 0
}}
transition = {{
    duration: 0.6,
        delay: i * 0.05,
            ease: 'easeOut'
}}
className = {`absolute w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-green-400' : i % 3 === 1 ? 'bg-emerald-300' : 'bg-teal-400'
    }`}
              />
            ))}
</div>

    < div className = "relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30" >
        <motion.div
              initial={ { scale: 0 } }
animate = {{ scale: 1 }}
transition = {{ type: 'spring', stiffness: 400, damping: 10, delay: 0.1 }}
            >
    <CheckCircle2 className="w-5 h-5" />
        </motion.div>
        </div>

        < div className = "relative z-10 flex-1" >
            <p className="font-semibold text-gray-900" > Success! </p>
                < p className = "text-sm text-gray-600" > { message } </p>
                    </div>
                    </motion.div>
      ),
{ duration: 4000, ...options }
    );
  },

/**
 * Error toast with shake animation
 */
error: (message: string, options?: ExternalToast) => {
    sonnerToast.custom(
        (t) => (
            <motion.div
          initial= {{ opacity: 0, x: -10 }}
animate = {{
    opacity: 1,
        x: [0, -10, 10, -10, 10, 0],
          }}
transition = {{
    opacity: { duration: 0.2 },
    x: { duration: 0.5, ease: 'easeInOut' }
}}
className = "flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg border border-red-200 min-w-[300px]"
    >
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-rose-500 text-white shadow-lg shadow-red-500/30" >
        <XCircle className="w-5 h-5" />
            </div>

            < div className = "flex-1" >
                <p className="font-semibold text-gray-900" > Error </p>
                    < p className = "text-sm text-gray-600" > { message } </p>
                        </div>
                        </motion.div>
      ),
{ duration: 5000, ...options }
    );
  },

/**
 * Info toast with slide-in from corner
 */
info: (message: string, options?: ExternalToast) => {
    sonnerToast.custom(
        (t) => (
            <motion.div
          initial= {{ opacity: 0, x: 50, scale: 0.9 }}
animate = {{ opacity: 1, x: 0, scale: 1 }}
exit = {{ opacity: 0, x: 50 }}
transition = {{ type: 'spring', stiffness: 300, damping: 25 }}
className = "flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg border border-blue-200 min-w-[300px]"
    >
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-lg shadow-blue-500/30" >
        <Info className="w-5 h-5" />
            </div>

            < div className = "flex-1" >
                <p className="font-semibold text-gray-900" > Info </p>
                    < p className = "text-sm text-gray-600" > { message } </p>
                        </div>
                        </motion.div>
      ),
{ duration: 4000, ...options }
    );
  },

/**
 * Warning toast with pulsing glow
 */
warning: (message: string, options?: ExternalToast) => {
    sonnerToast.custom(
        (t) => (
            <motion.div
          initial= {{ opacity: 0, y: -20 }}
animate = {{ opacity: 1, y: 0 }}
className = "relative flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg border border-amber-200 min-w-[300px] overflow-hidden"
    >
    <motion.div
            animate={
    {
        boxShadow: [
            '0 0 0 0 rgba(251, 191, 36, 0.4)',
            '0 0 0 10px rgba(251, 191, 36, 0)',
        ]
    }
}
transition = {{ duration: 1.5, repeat: Infinity }}
className = "flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white"
    >
    <AlertTriangle className="w-5 h-5" />
        </motion.div>

        < div className = "flex-1" >
            <p className="font-semibold text-gray-900" > Warning </p>
                < p className = "text-sm text-gray-600" > { message } </p>
                    </div>
                    </motion.div>
      ),
{ duration: 5000, ...options }
    );
  },

/**
 * Loading toast - shows a spinner
 */
loading: (message: string, options?: ExternalToast) => {
    return sonnerToast.loading(message, options);
},

    /**
     * Promise toast - for async operations
     */
    promise: <T,>(
        promise: Promise<T>,
        opts: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: unknown) => string);
        }
    ) => {
        return sonnerToast.promise(promise, opts);
    },

        /**
         * Dismiss a specific toast or all toasts
         */
        dismiss: (toastId?: string | number) => {
            sonnerToast.dismiss(toastId);
        },
};

export default toast;
