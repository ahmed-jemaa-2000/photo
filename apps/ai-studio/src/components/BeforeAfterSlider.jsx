import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, ArrowLeftRight } from 'lucide-react';

/**
 * BeforeAfterSlider - Drag-to-compare image component
 * 
 * Allows users to compare the original product image with the AI-generated result
 * by dragging a slider handle left/right.
 */

function BeforeAfterSlider({
    beforeImage,
    afterImage,
    beforeLabel = 'Original',
    afterLabel = 'Generated',
    initialPosition = 50,
    className = '',
}) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    // Calculate position from mouse/touch event
    const updatePosition = useCallback((clientX) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setPosition(Math.max(2, Math.min(98, percentage)));
    }, []);

    // Mouse handlers
    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
        updatePosition(e.clientX);
    }, [updatePosition]);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;
        updatePosition(e.clientX);
    }, [isDragging, updatePosition]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Touch handlers
    const handleTouchStart = useCallback((e) => {
        setIsDragging(true);
        updatePosition(e.touches[0].clientX);
    }, [updatePosition]);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging) return;
        updatePosition(e.touches[0].clientX);
    }, [isDragging, updatePosition]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Keyboard support
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowLeft') {
            setPosition(prev => Math.max(2, prev - 5));
        } else if (e.key === 'ArrowRight') {
            setPosition(prev => Math.min(98, prev + 5));
        }
    }, []);

    // Global mouse/touch listeners
    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    if (!beforeImage || !afterImage) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden select-none cursor-ew-resize ${className}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            role="slider"
            aria-label="Comparison slider"
            aria-valuenow={Math.round(position)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {/* After Image (Full, Bottom Layer) */}
            <img
                src={afterImage}
                alt={afterLabel}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable={false}
            />

            {/* Before Image (Clipped, Top Layer) */}
            <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt={beforeLabel}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                />
            </div>

            {/* Slider Line */}
            <motion.div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                animate={{
                    boxShadow: isDragging
                        ? '0 0 20px rgba(255,255,255,0.8)'
                        : '0 4px 12px rgba(0,0,0,0.3)'
                }}
            >
                {/* Top notch */}
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
                {/* Bottom notch */}
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-white rounded-full" />
            </motion.div>

            {/* Slider Handle */}
            <motion.div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                style={{ left: `${position}%` }}
                animate={{ scale: isDragging ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
                <div className={`
          w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center
          transition-all duration-200
          ${isDragging ? 'ring-4 ring-primary/50' : ''}
        `}>
                    <ArrowLeftRight className="w-5 h-5 text-slate-700" />
                </div>
            </motion.div>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg">
                <span className="text-white text-sm font-medium">{beforeLabel}</span>
            </div>
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg">
                <span className="text-white text-sm font-medium">{afterLabel}</span>
            </div>

            {/* Instructions overlay (only shown briefly) */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
            >
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm">
                    <GripVertical className="w-4 h-4" />
                    <span>Drag to compare</span>
                </div>
            </motion.div>
        </div>
    );
}

export default BeforeAfterSlider;
