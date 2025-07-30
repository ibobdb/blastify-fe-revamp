/**
 * Utility functions to test the middleware protection
 */

import { getToken, getRefreshToken, isAuthenticated } from './auth';

/**
 * Test function to check if the current route is protected
 * Use this in development to verify middleware protection
 */
export const testMiddlewareProtection = () => {
  const accessToken = getToken();
  const refreshToken = getRefreshToken();
  const isAuth = isAuthenticated();

  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;

    // Check if current path should be protected
    const isProtectedRoute =
      currentPath.startsWith('/dashboard') ||
      currentPath.startsWith('/account') ||
      currentPath.startsWith('/admin');
  }

  return {
    accessToken: !!accessToken,
    refreshToken: !!refreshToken,
    isAuthenticated: isAuth,
  };
};

export default testMiddlewareProtection;
