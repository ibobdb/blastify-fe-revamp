'use client';

import { useState, useCallback } from 'react';

export type ConfirmDialogType = 'info' | 'warning' | 'danger';

export interface ConfirmDialogOptions {
  title: string;
  description: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

/**
 * Hook for handling confirmation dialogs with different types:
 * - info: For informational confirmations
 * - warning: For actions that need attention but are not destructive
 * - danger: For destructive actions like delete
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);

  /**
   * Opens a confirmation dialog with the specified options
   */
  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      // Set default values
      const dialogOptions = {
        type: options.type || 'info',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        ...options,
        onConfirm: async () => {
          if (options.onConfirm) {
            setIsLoading(true);
            try {
              await options.onConfirm();
            } catch (error) {
              console.error('Confirm action failed:', error);
            } finally {
              setIsLoading(false);
            }
          }
          setIsOpen(false);
          resolve(true);
        },
        onCancel: () => {
          if (options.onCancel) {
            options.onCancel();
          }
          setIsOpen(false);
          resolve(false);
        },
      };

      setOptions(dialogOptions);
      setIsOpen(true);
    });
  }, []);

  /**
   * Shorthand for creating an info confirmation dialog
   */
  const confirmInfo = useCallback(
    (
      title: string,
      description: string,
      confirmText = 'OK',
      onConfirm?: () => void
    ) => {
      return confirm({
        title,
        description,
        type: 'info',
        confirmText,
        onConfirm,
      });
    },
    [confirm]
  );

  /**
   * Shorthand for creating a warning confirmation dialog
   */
  const confirmWarning = useCallback(
    (
      title: string,
      description: string,
      confirmText = 'Continue',
      onConfirm?: () => void
    ) => {
      return confirm({
        title,
        description,
        type: 'warning',
        confirmText,
        onConfirm,
      });
    },
    [confirm]
  );

  /**
   * Shorthand for creating a danger confirmation dialog
   */
  const confirmDanger = useCallback(
    (
      title: string,
      description: string,
      confirmText = 'Delete',
      onConfirm?: () => void
    ) => {
      return confirm({
        title,
        description,
        type: 'danger',
        confirmText,
        onConfirm,
      });
    },
    [confirm]
  );

  return {
    isOpen,
    isLoading,
    options,
    setIsOpen,
    confirm,
    confirmInfo,
    confirmWarning,
    confirmDanger,
  };
}

export default useConfirmDialog;
