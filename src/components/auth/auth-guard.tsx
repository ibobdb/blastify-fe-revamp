'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context';
import { Loading } from '@/components/ui/loading';
import { isPublicRoute } from '@/utils/route-protection';

/**
 * AuthGuard component that handles authentication checks without causing loading loops
 * This is a lightweight alternative to ProtectedRoute for better UX
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only act when loading is complete
    if (!loading) {
      const isPublic = isPublicRoute(pathname || '/');

      // If trying to access a protected route without authentication
      if (!isPublic && !isAuthenticated) {
        const redirectUrl = `/signin?from=${encodeURIComponent(
          pathname || '/'
        )}`;
        router.replace(redirectUrl);
        return;
      }

      // If authenticated user tries to access auth pages, redirect to dashboard
      if (
        isPublic &&
        isAuthenticated &&
        (pathname?.startsWith('/signin') ||
          pathname?.startsWith('/signup') ||
          pathname?.startsWith('/forgot-password') ||
          pathname?.startsWith('/reset-password'))
      ) {
        router.replace('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Show loading only when auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loading text="Loading..." />
      </div>
    );
  }

  // If not authenticated and trying to access protected route,
  // don't render anything (redirect will happen)
  if (!isAuthenticated && !isPublicRoute(pathname || '/')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loading text="Redirecting..." />
      </div>
    );
  }

  return <>{children}</>;
}
