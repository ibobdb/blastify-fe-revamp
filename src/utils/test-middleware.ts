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

  console.log('=== MIDDLEWARE PROTECTION TEST ===');
  console.log('Access Token exists:', !!accessToken);
  console.log('Refresh Token exists:', !!refreshToken);
  console.log('Is Authenticated:', isAuth);

  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);

    // Check if current path should be protected
    const isProtectedRoute =
      currentPath.startsWith('/dashboard') ||
      currentPath.startsWith('/account') ||
      currentPath.startsWith('/admin');

    console.log('Is Protected Route:', isProtectedRoute);
    console.log(
      'Protection Status:',
      isProtectedRoute && !isAuth ? '❌ VULNERABLE' : '✅ PROTECTED'
    );
  }

  return {
    accessToken: !!accessToken,
    refreshToken: !!refreshToken,
    isAuthenticated: isAuth,
  };
};

export default testMiddlewareProtection;
