'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context';

/**
 * Hook to redirect authenticated users away from auth pages
 */
export function useRedirectAuthenticated() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until auth state is loaded and user is authenticated
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  return { isAuthenticated, loading };
}

/**
 * Hook to get auth state, simplified version without real authentication
 */
export function useAuthState() {
  const { isAuthenticated, user, loading } = useAuth();
  
  return {
    isAuthenticated,
    user,
    loading
  };
}
