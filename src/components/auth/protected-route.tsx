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
  const { showLoading, hideLoading } = useLoading();
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If auth is still loading, show loading indicator
    if (authLoading) {
      showLoading('Verifying authentication...');
      protectedRouteLogger.debug('Authentication verification in progress');
      return;
    }

    // Check if we should have access to this route
    const { hasAccess, redirectTo } = checkProtectedRouteAccess(pathname);

    if (!hasAccess && redirectTo) {
      protectedRouteLogger.info(
        `Access denied to ${pathname}, redirecting to ${redirectTo}`
      );
      showLoading('Redirecting to login...');
      router.push(redirectTo);
    } else {
      protectedRouteLogger.debug(`Access granted to ${pathname}`);
      setChecking(false);
      hideLoading();
    }
  }, [
    isAuthenticated,
    authLoading,
    pathname,
    router,
    showLoading,
    hideLoading,
  ]);

  // Show loading while checking authentication
  if (authLoading || checking) {
    return <Loading fullScreen text="Verifying access..." />;
  }

  // Authentication successful, render the protected content
  return <>{children}</>;
}
