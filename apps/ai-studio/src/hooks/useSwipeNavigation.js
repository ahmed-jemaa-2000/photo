import { useRef, useCallback, useState } from 'react';

/**
 * useSwipeNavigation - Custom hook for touch swipe navigation
 * 
 * Detects horizontal swipe gestures and calls the appropriate callback.
 * Works on both mobile and touch-enabled desktop devices.
 * 
 * @param {Object} options
 * @param {Function} options.onSwipeLeft - Called when user swipes left (next)
 * @param {Function} options.onSwipeRight - Called when user swipes right (previous)
 * @param {number} options.threshold - Minimum swipe distance in pixels (default: 50)
 * @param {number} options.maxVerticalMovement - Max vertical movement allowed (default: 100)
 * @returns {Object} { ref, isSwiping, swipeDirection }
 */
export function useSwipeNavigation({
    onSwipeLeft,
    onSwipeRight,
    threshold = 50,
    maxVerticalMovement = 100,
} = {}) {
    const touchStartRef = useRef({ x: 0, y: 0 });
    const touchEndRef = useRef({ x: 0, y: 0 });
    const [isSwiping, setIsSwiping] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null);
    const ref = useRef(null);

    const handleTouchStart = useCallback((e) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
        touchEndRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };
        setIsSwiping(true);
        setSwipeDirection(null);
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (!isSwiping) return;

        touchEndRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
        };

        // Determine swipe direction during move for visual feedback
        const deltaX = touchEndRef.current.x - touchStartRef.current.x;
        if (Math.abs(deltaX) > 20) {
            setSwipeDirection(deltaX > 0 ? 'right' : 'left');
        }
    }, [isSwiping]);

    const handleTouchEnd = useCallback(() => {
        if (!isSwiping) return;

        const deltaX = touchEndRef.current.x - touchStartRef.current.x;
        const deltaY = touchEndRef.current.y - touchStartRef.current.y;

        // Check if swipe is valid (horizontal enough, meets threshold)
        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        const isAboveThreshold = Math.abs(deltaX) >= threshold;
        const isWithinVerticalLimit = Math.abs(deltaY) <= maxVerticalMovement;

        if (isHorizontalSwipe && isAboveThreshold && isWithinVerticalLimit) {
            if (deltaX > 0 && onSwipeRight) {
                onSwipeRight();
            } else if (deltaX < 0 && onSwipeLeft) {
                onSwipeLeft();
            }
        }

        setIsSwiping(false);
        setSwipeDirection(null);
    }, [isSwiping, threshold, maxVerticalMovement, onSwipeLeft, onSwipeRight]);

    // Attach handlers to ref element
    const setRef = useCallback((element) => {
        // Remove listeners from previous element
        if (ref.current) {
            ref.current.removeEventListener('touchstart', handleTouchStart);
            ref.current.removeEventListener('touchmove', handleTouchMove);
            ref.current.removeEventListener('touchend', handleTouchEnd);
        }

        ref.current = element;

        // Add listeners to new element
        if (element) {
            element.addEventListener('touchstart', handleTouchStart, { passive: true });
            element.addEventListener('touchmove', handleTouchMove, { passive: true });
            element.addEventListener('touchend', handleTouchEnd, { passive: true });
        }
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    return {
        ref: setRef,
        isSwiping,
        swipeDirection,
    };
}

export default useSwipeNavigation;
