import { useEffect, useState } from 'react';

/**
 * Custom hook to track scroll position
 * Useful for sticky headers, parallax effects, and scroll-based animations
 *
 * @param throttleMs - Throttle delay in milliseconds (default: 100ms)
 * @returns Current Y scroll position
 */
export function useScrollPosition(throttleMs: number = 100): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Set initial scroll position
    setScrollY(window.scrollY);

    let timeoutId: NodeJS.Timeout | null = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only update if scroll position changed
      if (currentScrollY === lastScrollY) return;

      lastScrollY = currentScrollY;

      // Throttle scroll updates for performance
      if (timeoutId !== null) {
        return;
      }

      timeoutId = setTimeout(() => {
        setScrollY(currentScrollY);
        timeoutId = null;
      }, throttleMs);
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [throttleMs]);

  return scrollY;
}

/**
 * Hook to check if element is in viewport
 * @param element - Element to check
 * @returns Boolean indicating if element is scrolled past
 */
export function useScrollPast(element: HTMLElement | null): boolean {
  const scrollY = useScrollPosition();
  const [isScrolledPast, setIsScrolledPast] = useState(false);

  useEffect(() => {
    if (!element) return;

    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    setIsScrolledPast(scrollY > elementTop);
  }, [scrollY, element]);

  return isScrolledPast;
}
