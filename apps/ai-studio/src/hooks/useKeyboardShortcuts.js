import { useEffect, useCallback } from 'react';

/**
 * Hook to handle keyboard shortcuts throughout the app
 * @param {Object} options - Keyboard shortcut handlers
 * @param {Function} options.onEscape - Handler for Escape key
 * @param {Function} options.onEnter - Handler for Enter key
 * @param {Function} options.onArrowLeft - Handler for Left Arrow
 * @param {Function} options.onArrowRight - Handler for Right Arrow
 * @param {boolean} options.enabled - Whether shortcuts are active
 */
export function useKeyboardShortcuts({
    onEscape,
    onEnter,
    onArrowLeft,
    onArrowRight,
    enabled = true,
}) {
    const handleKeyDown = useCallback((event) => {
        // Don't trigger if user is typing in an input
        const isTyping =
            event.target.tagName === 'INPUT' ||
            event.target.tagName === 'TEXTAREA' ||
            event.target.contentEditable === 'true';

        if (isTyping) return;

        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                onEscape?.();
                break;
            case 'Enter':
                event.preventDefault();
                onEnter?.();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                onArrowLeft?.();
                break;
            case 'ArrowRight':
                event.preventDefault();
                onArrowRight?.();
                break;
            default:
                break;
        }
    }, [onEscape, onEnter, onArrowLeft, onArrowRight]);

    useEffect(() => {
        if (!enabled) return;

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, handleKeyDown]);
}

export default useKeyboardShortcuts;
