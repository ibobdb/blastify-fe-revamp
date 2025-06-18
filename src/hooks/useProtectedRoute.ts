import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth.context';
import Cookies from 'js-cookie';

export const useProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      // Check if there's a token in cookies - if not, redirect
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        const url = `/signin?from=${encodeURIComponent(pathname || '/')}`;
        router.push(url);
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

  return { isAuthenticated, loading };
};
