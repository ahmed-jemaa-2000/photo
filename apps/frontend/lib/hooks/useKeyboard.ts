import { useEffect } from 'react';

/**
 * Hook for keyboard shortcuts
 * @param key - Key to listen for (e.g., 'Escape', 'Enter')
 * @param callback - Function to call when key is pressed
 * @param options - Additional options (ctrl, shift, alt, meta)
 */
export function useKeyboard(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  }
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the key matches
      if (event.key !== key) return;

      // Check modifiers
      if (options?.ctrl && !event.ctrlKey) return;
      if (options?.shift && !event.shiftKey) return;
      if (options?.alt && !event.altKey) return;
      if (options?.meta && !event.metaKey) return;

      // Prevent default and call callback
      event.preventDefault();
      callback(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, options]);
}

/**
 * Common keyboard shortcuts
 */
export const useEscapeKey = (callback: () => void) => {
  useKeyboard('Escape', callback);
};

export const useEnterKey = (callback: () => void) => {
  useKeyboard('Enter', callback);
};

export const useCommandK = (callback: () => void) => {
  useKeyboard('k', callback, { meta: true });
};
