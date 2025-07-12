'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAlert } from '@/hooks/useAlert';

interface AlertContextType {
  showAlert: (
    props: Parameters<ReturnType<typeof useAlert>['showAlert']>[0]
  ) => void;
  hideAlert: () => void;
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

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

/**
 * Alert Provider component that makes alert functionality available throughout the app
 * Wrap your app or layout with this provider to enable global alert access
 */
export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const {
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    AlertComponent,
  } = useAlert();

  const contextValue: AlertContextType = {
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {AlertComponent}
    </AlertContext.Provider>
  );
};

/**
 * Hook to access alert functionality from anywhere in the app
 * Must be used within an AlertProvider
 *
 * @example
 * ```tsx
 * const { showSuccess, showError, showConfirm } = useGlobalAlert();
 *
 * showSuccess('Success!', 'Operation completed');
 * showError('Error!', 'Something went wrong');
 * showConfirm('Confirm?', 'Are you sure?', () => handleAction());
 * ```
 */
export const useGlobalAlert = (): AlertContextType => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useGlobalAlert must be used within an AlertProvider');
  }

  return context;
};

export default AlertProvider;
