'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLoading } from '@/context/loading.context';

type UseLoadingStateOptions = {
  /**
   * Initial loading state
   * @default false
   */
  initialState?: boolean;

  /**
   * Default loading message
   * @default 'Loading...'
   */
  defaultMessage?: string;

  /**
   * Whether to use the global loading overlay
   * @default true
   */
  useGlobalOverlay?: boolean;

  /**
   * Optional name for better logging
   */
  name?: string;
};

/**
 * A hook to manage loading states consistently across the app
 */
export const useLoadingState = ({
  initialState = false,
  defaultMessage = 'Loading...',
  useGlobalOverlay = true,
  name = 'component',
}: UseLoadingStateOptions = {}) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingMessage, setLoadingMessage] = useState(defaultMessage);
  const { showLoading, hideLoading } = useLoading();

  // Update loading state for the global overlay if enabled
  useEffect(() => {
    if (!useGlobalOverlay) return;

    if (isLoading) {
      showLoading(loadingMessage);
    } else {
      hideLoading();
    }

    return () => {
      if (isLoading && useGlobalOverlay) {
        hideLoading();
      }
    };
  }, [
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    useGlobalOverlay,
    name,
  ]);

  // Start loading with an optional message
  const startLoading = useCallback((message?: string) => {
    setIsLoading(true);
    if (message) setLoadingMessage(message);
  }, []);

  // Stop loading
  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Reset loading state
  const resetLoading = useCallback(() => {
    setIsLoading(initialState);
    setLoadingMessage(defaultMessage);
  }, [initialState, defaultMessage]);

  // Helper to wrap async functions with loading state
  const withLoading = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options?: {
        message?: string;
        onSuccess?: (result: T) => void;
        onError?: (error: any) => void;
      }
    ): Promise<T> => {
      try {
        startLoading(options?.message);

        const result = await asyncFn();

        if (options?.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (error) {
        if (options?.onError) {
          options.onError(error);
        }
        throw error;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading, name]
  );

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    resetLoading,
    setLoadingMessage,
    withLoading,
  };
};

export default useLoadingState;
