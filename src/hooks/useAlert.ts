'use client';

import * as React from 'react';
import { ReusableAlertDialog } from '@/components/alert';
import type { AlertDialogProps } from '@/components/alert';

interface UseAlertReturn {
  showAlert: (props: Omit<AlertDialogProps, 'open' | 'onOpenChange'>) => void;
  hideAlert: () => void;
  AlertComponent: React.ReactElement;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
  showWarning: (title: string, description?: string) => void;
  showInfo: (title: string, description?: string) => void;
  showConfirm: (
    title: string,
    description?: string,
    onConfirm?: () => void | Promise<void>
  ) => void;
}

/**
 * Custom hook for managing alert dialogs throughout the application
 *
 * @example
 * ```tsx
 * const { showSuccess, showError, showConfirm, AlertComponent } = useAlert();
 *
 * // Show different types of alerts
 * showSuccess('Success!', 'Operation completed successfully');
 * showError('Error!', 'Something went wrong');
 * showConfirm('Delete item?', 'This action cannot be undone', async () => {
 *   await deleteItem();
 *   showSuccess('Deleted!', 'Item removed successfully');
 * });
 *
 * return (
 *   <div>
 *     {/* Your content *\/}
 *     {AlertComponent}
 *   </div>
 * );
 * ```
 */
export const useAlert = (): UseAlertReturn => {
  const [alertState, setAlertState] = React.useState<{
    open: boolean;
    props: Omit<AlertDialogProps, 'open' | 'onOpenChange'>;
  }>({
    open: false,
    props: { title: '' },
  });

  const showAlert = React.useCallback(
    (props: Omit<AlertDialogProps, 'open' | 'onOpenChange'>) => {
      setAlertState({ open: true, props });
    },
    []
  );

  const hideAlert = React.useCallback(() => {
    setAlertState((prev) => ({ ...prev, open: false }));
  }, []);

  const AlertComponent = React.useMemo(
    () => (
      <ReusableAlertDialog
        {...alertState.props}
        open={alertState.open}
        onOpenChange={hideAlert}
      />
    ),
    [alertState, hideAlert]
  );

  const showSuccess = React.useCallback(
    (title: string, description?: string) =>
      showAlert({ variant: 'success', title, description }),
    [showAlert]
  );

  const showError = React.useCallback(
    (title: string, description?: string) =>
      showAlert({ variant: 'error', title, description }),
    [showAlert]
  );

  const showWarning = React.useCallback(
    (title: string, description?: string) =>
      showAlert({ variant: 'warning', title, description }),
    [showAlert]
  );

  const showInfo = React.useCallback(
    (title: string, description?: string) =>
      showAlert({ variant: 'info', title, description }),
    [showAlert]
  );

  const showConfirm = React.useCallback(
    (
      title: string,
      description?: string,
      onConfirm?: () => void | Promise<void>
    ) =>
      showAlert({
        variant: 'warning',
        title,
        description,
        onConfirm,
        showCancel: true,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      }),
    [showAlert]
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
};

export default useAlert;
