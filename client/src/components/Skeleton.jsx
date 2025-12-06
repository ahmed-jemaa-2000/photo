import React from 'react';

/**
 * Skeleton loader components for better loading UX
 */

// Pulse animation
const pulseClass = "animate-pulse bg-white/10 rounded-xl";

// Image skeleton
export const ImageSkeleton = ({ className = "w-full aspect-square" }) => (
    <div className={`${pulseClass} ${className}`} />
);

// Card skeleton
export const CardSkeleton = ({ className = "" }) => (
    <div className={`${pulseClass} p-6 ${className}`}>
        <div className="h-4 bg-white/5 rounded w-3/4 mb-4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
    </div>
);

// Model card skeleton
export const ModelCardSkeleton = () => (
    <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
        <div className={`${pulseClass} aspect-[3/4] mb-4`} />
        <div className="h-4 bg-white/10 rounded w-2/3 mx-auto" />
    </div>
);

// Grid of model skeletons
export const ModelGridSkeleton = ({ count = 6 }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
            <ModelCardSkeleton key={i} />
        ))}
    </div>
);

// Text line skeleton
export const TextSkeleton = ({ width = "w-full", height = "h-4" }) => (
    <div className={`${pulseClass} ${width} ${height}`} />
);

// Button skeleton
export const ButtonSkeleton = ({ className = "" }) => (
    <div className={`${pulseClass} h-12 w-40 ${className}`} />
);

export default {
    ImageSkeleton,
    CardSkeleton,
    ModelCardSkeleton,
    ModelGridSkeleton,
    TextSkeleton,
    ButtonSkeleton,
};
