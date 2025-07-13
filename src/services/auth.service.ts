import { LoginCredentials } from '@/types/auth';
import api from './api';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import logger from '@/utils/logger';

// Backup mock user data for fallbacks
const mockUser = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
};

// Cookie configuration for security
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict' as const, // Strict CSRF protection
  path: '/', // Available across the entire site
};

// Mock delay function to simulate API calls
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Create a dedicated logger for authentication services
const authLogger = logger.child('AuthService');

const authService = {
  /**
   * Login function that authenticates the user and securely stores tokens
   * @param credentials User login credentials
   * @param rememberMe Whether to extend token expiry times for persistent login
   * @returns Promise with user data and success status
   */ login: async (
    credentials: LoginCredentials,
    rememberMe: boolean = false
  ) => {
    authLogger.info('Login attempt', { email: credentials.email });
    try {
      const response = await api.post('/auth/login', credentials);
      const { status, message, data } = response.data;

      if (status && data) {
        const { accessToken, refreshToken } = data;

        // Validate that we received tokens
        if (!accessToken || !refreshToken) {
          authLogger.error('Login response missing tokens', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
          });
          throw new Error('Authentication failed - invalid server response');
        }

        authLogger.debug('Login successful, setting tokens', { rememberMe });

        // Set token expiry times based on rememberMe preference
        const accessTokenExpiry = rememberMe ? 1 : 1 / 24; // 24 hours if remember me, 1 hour if not
        const refreshTokenExpiry = rememberMe ? 30 : 7; // 30 days if remember me, 7 days if not

        // Store tokens in secure cookies
        Cookies.set('accessToken', accessToken, {
          ...COOKIE_OPTIONS,
          expires: accessTokenExpiry,
        });

        Cookies.set('refreshToken', refreshToken, {
          ...COOKIE_OPTIONS,
          expires: refreshTokenExpiry,
        });

        // Decode user data from JWT
        const decodedToken: any = jwtDecode(accessToken);

        // Validate decoded token has required fields
        if (!decodedToken.id || !decodedToken.email || !decodedToken.name) {
          authLogger.error('Invalid token structure', { decodedToken });
          throw new Error('Authentication failed - invalid token structure');
        }

        const user = {
          id: decodedToken.id,
          name: decodedToken.name,
          email: decodedToken.email,
          role: decodedToken.role,
          avatar: decodedToken.avatar,
        };

        authLogger.info('User authenticated successfully', {
          userId: user.id,
          role: user.role,
        });
        return {
          success: true,
          user,
          message,
        };
      } else {
        authLogger.warn('Authentication failed with status success=false', {
          message,
        });
        throw new Error(message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed';
      authLogger.error('Authentication error', error);
      throw new Error(errorMessage);
    }
  },
  /**
   * Register a new user
   * @param userData User registration data including name, email, password, and phone number
   * @returns Promise with registration result
   */ register: async (userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => {
    authLogger.info('Registration attempt', {
      email: userData.email,
      name: userData.name,
    });
    try {
      const response = await api.post('/auth/register', userData);
      const { status, message, data } = response.data;

      if (status) {
        authLogger.info('Registration successful', { email: userData.email });

        // If the API returns tokens on registration, store them
        if (data?.accessToken && data?.refreshToken) {
          authLogger.debug('Setting authentication tokens after registration');

          // Store tokens in secure cookies
          Cookies.set('accessToken', data.accessToken, {
            ...COOKIE_OPTIONS,
            expires: 1 / 24, // 1 hour expiry
          });

          Cookies.set('refreshToken', data.refreshToken, {
            ...COOKIE_OPTIONS,
            expires: 7, // 7 day expiry
          });
        }

        return {
          success: true,
          message: message || 'Registration successful',
          user: data?.user || null,
        };
      } else {
        authLogger.warn('Registration failed with status success=false', {
          message,
        });
        throw new Error(message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';
      authLogger.error('Registration error', error);
      throw new Error(errorMessage);
    }
  },
  /**
   * Refresh the access token using the refresh token
   * @returns Promise with success status
   */ refreshToken: async () => {
    authLogger.debug('Token refresh attempt');
    try {
      // Get the refresh token from cookies
      const refreshToken = Cookies.get('refreshToken');

      if (!refreshToken) {
        authLogger.warn('Token refresh failed - no refresh token in cookies');
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { status, message, data } = response.data;

      if (status) {
        const { accessToken } = data;
        authLogger.debug('Access token refreshed successfully');

        // Update only the access token cookie
        Cookies.set('accessToken', accessToken, {
          ...COOKIE_OPTIONS,
          expires: 1 / 24, // 1 hour expiry
        });

        return { success: true, message };
      } else {
        authLogger.warn('Token refresh failed with status success=false', {
          message,
        });
        throw new Error(message || 'Token refresh failed');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Token refresh failed';
      authLogger.error('Token refresh error', error);
      throw new Error(errorMessage);
    }
  },
  /**
   * Mock request email verification
   * @param email User email
   */
  requestEmailVerification: async (email: string) => {
    authLogger.info('Email verification requested', { email });
    await mockDelay();
    authLogger.debug('Email verification link sent (mock)');
    return { success: true };
  },
  /**
   * Request password reset
   * @param email User email
   * @returns Promise with the result of the request
   */ requestPasswordReset: async (email: string) => {
    authLogger.info('Password reset requested', { email });
    try {
      const response = await api.post('/auth/request-password-reset', {
        email,
      });
      const { status, message } = response.data;

      if (status) {
        authLogger.info('Password reset link sent successfully', { email });
        return {
          success: true,
          message: message || 'Password reset link sent to your email',
        };
      } else {
        authLogger.warn(
          'Password reset request failed with status success=false',
          { message }
        );
        throw new Error(message || 'Failed to request password reset');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to request password reset';
      authLogger.error('Password reset request error', { email, error });
      throw new Error(errorMessage);
    }
  },

  /**
   * Reset password with token
   * @param data Reset password data containing token and new password
   * @returns Promise with the result of the password reset
   */ resetPassword: async (data: { token: string; newPassword: string }) => {
    authLogger.info('Password reset attempt with token');
    try {
      const { token, newPassword } = data;
      const response = await api.post(`/auth/reset-password?token=${token}`, {
        newPassword,
      });

      const { status, message } = response.data;

      if (status) {
        authLogger.info('Password reset successful');
        return {
          success: true,
          message: message || 'Password reset successfully',
        };
      } else {
        authLogger.warn('Password reset failed with status success=false', {
          message,
        });
        throw new Error(message || 'Failed to reset password');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to reset password';
      authLogger.error('Password reset error', error);
      throw new Error(errorMessage);
    }
  },
  /**
   * Mock verify email
   * @param token Verification token
   */
  verifyEmail: async (token: string) => {
    authLogger.info('Email verification attempt with token');
    await mockDelay();
    authLogger.debug('Email verified successfully (mock)');
    return { success: true };
  },

  /**
   * Mock get current user profile
   * @returns Promise with user profile data
   */
  getProfile: async () => {
    await mockDelay();
    return { user: mockUser };
  },
  /**
   * Mock update user profile
   * @param profileData Updated profile data
   * @returns Promise with updated user data
   */
  updateProfile: async (profileData: {
    name?: string;
    email?: string;
    avatar?: string;
    [key: string]: unknown;
  }) => {
    await mockDelay();
    return { user: { ...mockUser, ...profileData } };
  },
  /**
   * Validate current user's password
   * @param password The password to validate
   * @returns Promise with validation result
   */
  validatePassword: async (password: string) => {
    authLogger.info('Password validation attempt');
    try {
      const response = await api.post('/auth/validate-password', {
        password,
      });
      const { status, message } = response.data;

      if (status) {
        authLogger.info('Password validation successful');
        return {
          success: true,
          message: message || 'Password is valid',
        };
      } else {
        authLogger.warn('Password validation failed', { message });
        throw new Error(message || 'Invalid password');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to validate password';
      authLogger.error('Password validation error', error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Logout function - removes authentication tokens and clears session
   * No API call required since we don't have a logout endpoint
   *
   * @returns A promise that resolves to a success object
   */ logout: async () => {
    authLogger.info('User logout initiated');
    try {
      // Just clear both tokens from cookies
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });

      authLogger.info(
        'User logged out successfully - tokens cleared from cookies'
      );
      return { success: true };
    } catch (error) {
      authLogger.error('Error clearing cookies during logout', error);
      return { success: false };
    }
  },
};

export default authService;
