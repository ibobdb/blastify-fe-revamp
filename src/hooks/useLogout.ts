'use client';

import { useCallback } from 'react';
import { useAuth } from '@/context';
import { useRouter } from 'next/navigation';
import { clearLoadingState } from '@/components/ui/loading';

/**
 * Hook for handling logout functionality
 */
export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();
  const handleLogout = useCallback(async () => {
    try {
      // Clean up any loading states before logout process starts
      clearLoadingState();

      // Perform logout
      await logout();

      // Force cleanup again before navigation to ensure UI is responsive
      clearLoadingState();

      // Add a small delay before navigation to ensure everything is cleaned up
      setTimeout(() => {
        // Navigate to signin page
        router.push('/signin');

        // Add one final cleanup after navigation starts
        setTimeout(clearLoadingState, 100);
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      clearLoadingState();
    }
  }, [logout, router]);

  return handleLogout;
}
