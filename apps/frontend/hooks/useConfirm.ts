/**
 * Custom hook for confirmation dialogs
 * Provides a promise-based confirm function that returns boolean
 */

import { toast } from 'sonner';

export interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirm() {
  const confirm = async (options: ConfirmOptions = {}): Promise<boolean> => {
    const {
      title = 'Are you sure?',
      description = 'This action cannot be undone.',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
    } = options;

    return new Promise((resolve) => {
      toast(title, {
        description,
        action: {
          label: confirmText,
          onClick: () => resolve(true),
        },
        cancel: {
          label: cancelText,
          onClick: () => resolve(false),
        },
        duration: Infinity, // Keep open until user responds
      });
    });
  };

  return { confirm };
}
