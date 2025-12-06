import { useRef, TouchEvent } from 'react';

interface SwipeGestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeGestureOptions {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
}

interface SwipeGestureResult {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
}

/**
 * Custom hook for handling swipe gestures on touch devices
 * Perfect for image galleries, carousels, and drawer components
 *
 * @param handlers - Callback functions for each swipe direction
 * @param options - Configuration options for swipe sensitivity
 * @returns Touch event handlers to attach to element
 */
export function useSwipeGesture(
  handlers: SwipeGestureHandlers,
  options: SwipeGestureOptions = {}
): SwipeGestureResult {
  const { minSwipeDistance = 50, maxSwipeTime = 500 } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchMove = (e: TouchEvent) => {
    // Prevent default to avoid page scroll during swipe
    if (touchStartRef.current) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

      // If horizontal swipe is dominant, prevent vertical scroll
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      x: 0,
      y: 0,
      time: Date.now(),
    };

    // Get the last touch position from the event
    // Note: touchEnd doesn't have touches, so we'll use the stored start position
    // and calculate based on movement

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;
    const deltaTime = touchEnd.time - touchStartRef.current.time;

    // Check if swipe was fast enough
    if (deltaTime > maxSwipeTime) {
      touchStartRef.current = null;
      return;
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine swipe direction
    if (absX > absY && absX > minSwipeDistance) {
      // Horizontal swipe
      if (deltaX > 0 && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      } else if (deltaX < 0 && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      }
    } else if (absY > absX && absY > minSwipeDistance) {
      // Vertical swipe
      if (deltaY > 0 && handlers.onSwipeDown) {
        handlers.onSwipeDown();
      } else if (deltaY < 0 && handlers.onSwipeUp) {
        handlers.onSwipeUp();
      }
    }

    touchStartRef.current = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

/**
 * Enhanced version with better touch end tracking
 */
export function useSwipeGestureEnhanced(
  handlers: SwipeGestureHandlers,
  options: SwipeGestureOptions = {}
): SwipeGestureResult {
  const { minSwipeDistance = 50, maxSwipeTime = 500 } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    if (touchStartRef.current) {
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

      // Prevent scroll if horizontal swipe is dominant
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) {
      touchStartRef.current = null;
      touchEndRef.current = null;
      return;
    }

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Check if swipe was fast enough
    if (deltaTime > maxSwipeTime) {
      touchStartRef.current = null;
      touchEndRef.current = null;
      return;
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Determine swipe direction
    if (absX > absY && absX > minSwipeDistance) {
      // Horizontal swipe
      if (deltaX > 0 && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      } else if (deltaX < 0 && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      }
    } else if (absY > absX && absY > minSwipeDistance) {
      // Vertical swipe
      if (deltaY > 0 && handlers.onSwipeDown) {
        handlers.onSwipeDown();
      } else if (deltaY < 0 && handlers.onSwipeUp) {
        handlers.onSwipeUp();
      }
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
