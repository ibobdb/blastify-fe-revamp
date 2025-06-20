'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  ConfirmDialogOptions,
  ConfirmDialogType,
} from '@/hooks/useConfirmDialog';

interface ConfirmContextType {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  confirmInfo: (
    title: string,
    description: string,
    confirmText?: string,
    onConfirm?: () => void
  ) => Promise<boolean>;
  confirmWarning: (
    title: string,
    description: string,
    confirmText?: string,
    onConfirm?: () => void
  ) => Promise<boolean>;
  confirmDanger: (
    title: string,
    description: string,
    confirmText?: string,
    onConfirm?: () => void
  ) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

/**
 * Provider component for confirmation dialogs
 */
export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      // Set default values
      const dialogOptions = {
        type: options.type || 'info',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        ...options,
        onConfirm: () => {
          if (options.onConfirm) {
            options.onConfirm();
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

  return (
    <ConfirmContext.Provider
      value={{ confirm, confirmInfo, confirmWarning, confirmDanger }}
    >
      {children}
      <ConfirmDialog open={isOpen} options={options} onOpenChange={setIsOpen} />
    </ConfirmContext.Provider>
  );
};

/**
 * Hook to use the confirm dialog from anywhere in the app
 */
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export default ConfirmProvider;
