import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

/**
 * Auth utilities for token management and user authentication
 */

// Cookie configuration for security
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict' as const, // Strict CSRF protection
  path: '/', // Available across the entire site
};

/**
 * Set access token in cookies
 */
export const setToken = (token: string): void => {
  Cookies.set('accessToken', token, {
    ...COOKIE_OPTIONS,
    expires: 1 / 24, // 1 hour expiry
  });
};

/**
 * Set refresh token in cookies
 */
export const setRefreshToken = (token: string): void => {
  Cookies.set('refreshToken', token, {
    ...COOKIE_OPTIONS,
    expires: 7, // 7 days expiry
  });
};

/**
 * Get access token from cookies
 */
export const getToken = (): string | null => {
  return Cookies.get('accessToken') || null;
};

/**
 * Get refresh token from cookies
 */
export const getRefreshToken = (): string | null => {
  return Cookies.get('refreshToken') || null;
};

/**
 * Remove all authentication tokens from cookies
 */
export const removeToken = (): void => {
  Cookies.remove('accessToken', { path: '/' });
  Cookies.remove('refreshToken', { path: '/' });
};

/**
 * Check if a token is valid and not expired
 */
export const isValidToken = (token: string): boolean => {
  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp ? decodedToken.exp > currentTime : false;
  } catch (error) {
    return false;
  }
};

/**
 * Extract user information from a JWT token
 */
export const getUserFromToken = (token: string): any => {
  try {
    const decodedToken: any = jwtDecode(token);
    return {
      id: decodedToken.id,
      name: decodedToken.name,
      email: decodedToken.email,
      role: decodedToken.role,
      avatar: decodedToken.avatar,
    };
  } catch (error) {
    return null;
  }
};

/**
 * Check if the current user is authenticated by validating tokens
 */
export const isAuthenticated = (): boolean => {
  const accessToken = getToken();

  if (accessToken && isValidToken(accessToken)) {
    return true;
  }

  // If access token is invalid, check refresh token
  const refreshToken = getRefreshToken();
  return !!refreshToken; // If refresh token exists, user can be re-authenticated
};
