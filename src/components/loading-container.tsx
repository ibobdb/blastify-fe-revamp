'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PageLoading } from '@/components/ui/loading';
import logger from '@/utils/logger';

// Create a logger instance for the loading container
const loadingLogger = logger.child('LoadingContainer');

/**
 * LoadingContainer acts as a wrapper component that shows a loading state
 * for page transitions, data fetching, etc.
 */
export const LoadingContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  // Check if current path is part of the landing page routes
  const isLandingPage =
    pathname === '/' ||
    pathname === '/signin' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/verify-email' ||
    pathname?.startsWith('/about') ||
    pathname?.startsWith('/features') ||
    pathname?.startsWith('/pricing') ||
    pathname?.startsWith('/contact');

  useEffect(() => {
    // Immediately set loading state based on path
    if (isLandingPage) {
      // For landing pages, immediately hide loading
      setIsLoading(false);
      loadingLogger.debug(`Skipping loading for landing page: ${pathname}`);
      return;
    } else {
      // For protected pages, show loading initially
      setIsLoading(true);
      loadingLogger.debug(`Loading page: ${pathname}`);
    }

    // Simulate loading delay for page transitions
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      loadingLogger.debug(`Page loaded: ${pathname}`);
    }, 800); // Show loading for 800ms for smooth transitions

    return () => {
      // Clear timeout when component unmounts or path changes
      clearTimeout(loadingTimeout);
    };
  }, [pathname, isLandingPage]);

  // Don't wrap landing pages with the loading container
  if (isLandingPage) {
    return <>{children}</>;
  }

  // For protected/dashboard pages, show loading indicator
  return (
    <>
      {' '}
      {isLoading ? (
        <PageLoading fullScreen text="Loading page..." />
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default LoadingContainer;
