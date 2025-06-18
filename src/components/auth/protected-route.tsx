'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context';
import { checkProtectedRouteAccess } from '@/utils/route-protection';

/**
 * ProtectedRoute component that works with middleware
 *
 * This provides an additional client-side check on top of the middleware
 * for better UX (avoids unnecessary page loads and redirects)
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If auth is still loading, wait for it
    if (loading) {
      return;
    }

    // Check if we should have access to this route
    const { hasAccess, redirectTo } = checkProtectedRouteAccess(pathname);

    if (!hasAccess && redirectTo) {
      router.push(redirectTo);
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Show nothing while checking authentication
  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Authentication successful, render the protected content
  return <>{children}</>;
}
