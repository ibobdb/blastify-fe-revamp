'use client';

import React, { createContext, useState, useContext } from 'react';
import { Loading } from '@/components/ui/loading';

// Define the structure of the loading context
interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
  loadingMessage: string | undefined;
}

// Create the context with default values
const LoadingContext = createContext<LoadingContextType>({
  showLoading: () => {},
  hideLoading: () => {},
  isLoading: false,
  loadingMessage: undefined,
});

/**
 * Custom hook to access the loading context
 */
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

/**
 * Provider component that wraps the app and provides loading functionality
 */
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(
    undefined
  );

  // Show the loading spinner with optional message
  const showLoading = (message?: string) => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  // Hide the loading spinner
  const hideLoading = () => {
    setIsLoading(false);
    setLoadingMessage(undefined);
  };

  // Value to be provided to consumers
  const value = {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <Loading fullScreen text={loadingMessage} />}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
