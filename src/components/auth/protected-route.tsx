'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context';
import { useLoading } from '@/context/loading.context';
import { Loading } from '@/components/ui/loading';
import { checkProtectedRouteAccess } from '@/utils/route-protection';
import logger from '@/utils/logger';

/**
 * ProtectedRoute component that works with middleware
 *
 * This provides an additional client-side check on top of the middleware
 * for better UX (avoids unnecessary page loads and redirects)
 */
// Create a logger for the protected route
const protectedRouteLogger = logger.child('ProtectedRoute');

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If auth is still loading, just wait
    if (authLoading) {
      protectedRouteLogger.debug('Authentication verification in progress');
      return;
    }

    // Check if we should have access to this route
    const { hasAccess, redirectTo } = checkProtectedRouteAccess(
      pathname || '/'
    );

    if (!hasAccess && redirectTo) {
      protectedRouteLogger.info(
        `Access denied to ${pathname}, redirecting to ${redirectTo}`
      );
      // Don't show loading for redirect, let the middleware handle it
      router.replace(redirectTo);
    } else {
      protectedRouteLogger.debug(`Access granted to ${pathname}`);
      setChecking(false);
    }
  }, [isAuthenticated, authLoading, pathname, router]);

  // Show simple loading while checking authentication (not full screen)
  if (authLoading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading text="Verifying access..." />
      </div>
    );
  }

  // Authentication successful, render the protected content
  return <>{children}</>;
}
