'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PageLoading } from '@/components/ui/loading';
import { useAuth } from '@/context';

/**
 * LoadingContainer acts as a wrapper component that shows a loading state
 * for page transitions. Simplified to prevent conflicts with auth redirects.
 */
export const LoadingContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const { loading: authLoading } = useAuth();

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
    // Don't show loading if auth is still loading (prevents double loading)
    if (authLoading) {
      setIsLoading(false);
      return;
    }

    // Don't show loading for landing pages
    if (isLandingPage) {
      setIsLoading(false);
      return;
    }

    // For protected pages, show brief loading
    setIsLoading(true);

    // Simulate loading delay for page transitions (shorter delay)
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Reduced from 800ms to 300ms

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [pathname, isLandingPage, authLoading]);

  // Always render children without loading overlay to prevent conflicts
  return <>{children}</>;
};

export default LoadingContainer;
