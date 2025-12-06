import React from 'react';

/**
 * Skeleton loader components for better loading UX
 * Premium animated skeletons for async content loading
 */

// Base pulse animation class
const pulseClass = "animate-pulse bg-white/10 rounded-xl";

// Shimmer animation for premium effect
const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

// Image skeleton
export const ImageSkeleton = ({ className = "w-full aspect-square" }) => (
    <div className={`${pulseClass} ${shimmerClass} ${className}`} />
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
        <div className={`${pulseClass} ${shimmerClass} aspect-[3/4] mb-4`} />
        <div className="h-4 bg-white/10 rounded w-2/3 mx-auto animate-pulse" />
    </div>
);

// Grid of model skeletons
export const ModelGridSkeleton = ({ count = 6, cols = 3 }) => (
    <div className={`grid grid-cols-2 md:grid-cols-${cols} lg:grid-cols-${cols + 2} gap-4`}>
        {Array.from({ length: count }).map((_, i) => (
            <ModelCardSkeleton key={i} />
        ))}
    </div>
);

// Category card skeleton (for category hub)
export const CategoryCardSkeleton = () => (
    <div className="p-6 md:p-8 rounded-3xl border-2 border-white/10 bg-white/5 flex flex-col items-center gap-4">
        <div className={`${pulseClass} w-20 h-20 md:w-24 md:h-24 rounded-2xl`} />
        <div className={`${pulseClass} h-6 w-24`} />
        <div className={`${pulseClass} h-4 w-32`} />
        <div className="flex gap-2 mt-2">
            <div className={`${pulseClass} h-6 w-16 rounded-full`} />
            <div className={`${pulseClass} h-6 w-20 rounded-full`} />
        </div>
    </div>
);

// Grid of category skeletons
export const CategoryGridSkeleton = ({ count = 4 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
        ))}
    </div>
);

// Option card skeleton (for lighting, camera angles, poses, etc.)
export const OptionCardSkeleton = () => (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-3">
        <div className={`${pulseClass} w-10 h-10 rounded-lg flex-shrink-0`} />
        <div className="flex-1 space-y-2">
            <div className={`${pulseClass} h-4 w-3/4`} />
            <div className={`${pulseClass} h-3 w-full`} />
        </div>
    </div>
);

// Grid skeleton for option cards
export const OptionGridSkeleton = ({ count = 4, cols = 2 }) => (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-3`}>
        {Array.from({ length: count }).map((_, i) => (
            <OptionCardSkeleton key={i} />
        ))}
    </div>
);

// Small option card skeleton (for compact grids)
export const SmallOptionSkeleton = () => (
    <div className="p-3 rounded-lg border border-white/10 bg-white/5">
        <div className={`${pulseClass} w-8 h-8 rounded-lg mx-auto mb-2`} />
        <div className={`${pulseClass} h-3 w-16 mx-auto`} />
    </div>
);

// Background/scene preview skeleton
export const BackgroundSkeleton = () => (
    <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5">
        <div className={`${pulseClass} ${shimmerClass} w-full h-full`} />
    </div>
);

// Background grid skeleton
export const BackgroundGridSkeleton = ({ count = 6 }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
            <BackgroundSkeleton key={i} />
        ))}
    </div>
);

// Text line skeleton
export const TextSkeleton = ({ width = "w-full", height = "h-4" }) => (
    <div className={`${pulseClass} ${width} ${height}`} />
);

// Button skeleton
export const ButtonSkeleton = ({ className = "", size = "md" }) => {
    const sizes = {
        sm: "h-8 w-24",
        md: "h-12 w-40",
        lg: "h-14 w-48",
    };
    return <div className={`${pulseClass} ${sizes[size]} ${className}`} />;
};

// Tab bar skeleton
export const TabBarSkeleton = ({ count = 2 }) => (
    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className={`${pulseClass} h-10 w-24 rounded-md`} />
        ))}
    </div>
);

// Result image skeleton (for generation result)
export const ResultImageSkeleton = () => (
    <div className="glass-panel p-2 overflow-hidden">
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
            <div className={`${pulseClass} ${shimmerClass} w-full h-full`} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                <div className={`${pulseClass} h-10 w-24 rounded-xl`} />
                <div className={`${pulseClass} h-10 w-24 rounded-xl`} />
            </div>
        </div>
    </div>
);

export default {
    ImageSkeleton,
    CardSkeleton,
    ModelCardSkeleton,
    ModelGridSkeleton,
    CategoryCardSkeleton,
    CategoryGridSkeleton,
    OptionCardSkeleton,
    OptionGridSkeleton,
    SmallOptionSkeleton,
    BackgroundSkeleton,
    BackgroundGridSkeleton,
    TextSkeleton,
    ButtonSkeleton,
    TabBarSkeleton,
    ResultImageSkeleton,
};
