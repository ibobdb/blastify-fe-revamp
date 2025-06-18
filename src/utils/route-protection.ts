/**
 * Route protection utilities for client components
 */

import { getToken, getRefreshToken, isValidToken } from './auth';

/**
 * Check if a route is public (accessible without authentication)
 *
 * @param pathname The current pathname
 * @returns boolean indicating if the route is public
 */
export const isPublicRoute = (pathname: string): boolean => {
  // List of public routes that don't require authentication
  const publicRoutes = [
    // Root and landing pages
    '/',
    '/features',
    '/pricing',
    '/contact',
    '/about',
    '/privacy-policy',
    '/terms-of-service',
    '/faq',

    // Auth routes
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ];

  // Check exact matches
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  // Check route prefixes
  const publicPrefixes = [
    '/signin/',
    '/signup/',
    '/forgot-password/',
    '/reset-password/',
    '/verify-email/',
  ];

  // Check if pathname starts with any of the public prefixes
  return publicPrefixes.some((prefix) => pathname.startsWith(prefix));
};

/**
 * Check if the current user should have access to a protected route
 *
 * @param pathname The current pathname
 * @returns An object with access status and redirect info
 */
export const checkProtectedRouteAccess = (pathname: string) => {
  // First check if this is a public route
  if (isPublicRoute(pathname)) {
    return { hasAccess: true };
  }

  // For protected routes, check authentication
  const accessToken = getToken();

  // No token means no access
  if (!accessToken) {
    return {
      hasAccess: false,
      redirectTo: `/signin?from=${encodeURIComponent(pathname)}`,
    };
  }

  // Have token but need to verify it's valid
  if (!isValidToken(accessToken)) {
    // If we have a refresh token, we could potentially refresh
    const refreshToken = getRefreshToken();

    return {
      hasAccess: false,
      redirectTo: `/signin?from=${encodeURIComponent(pathname)}&expired=true${
        refreshToken ? '&refresh=true' : ''
      }`,
    };
  }

  // All checks passed, allow access
  return { hasAccess: true };
};
