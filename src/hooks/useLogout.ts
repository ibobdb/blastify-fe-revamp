'use client';

import { useCallback } from 'react';
import { useAuth } from '@/context';
import { useRouter } from 'next/navigation';

/**
 * Hook for handling logout functionality
 */
export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout, router]);

  return handleLogout;
}
