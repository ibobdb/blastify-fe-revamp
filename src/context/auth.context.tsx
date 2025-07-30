'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/auth.service';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Simplified mock user type
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

// Simplified auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => Promise<void>;
  clearError: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  validatePassword: (password: string) => Promise<void>;
}

// Create context with default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
  register: async (_name, _email, _password, _phoneNumber) => {},
  clearError: () => {},
  requestPasswordReset: async () => {},
  resetPassword: async () => {},
  verifyEmail: async () => {},
  validatePassword: async () => {},
});

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'suhu',
  avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
};

// Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  // Real authentication functions using the auth service
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login({ email, password }, rememberMe);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage); // Rethrow for the component to handle
    } finally {
      setLoading(false);
    }
  };
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      // Always clear local state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  const register = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.register({
        name,
        email,
        password,
        phoneNumber,
      });

      if (result.success && result.user) {
        // If registration returns user data and tokens, set the user as authenticated
        setUser(result.user);
        setIsAuthenticated(true);
      }

      setLoading(false);
      return;
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
      throw err; // Rethrow for the component to handle
    }
  };

  const clearError = (): void => {
    setError(null);
  };
  const requestPasswordReset = async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.requestPasswordReset(email);
      if (!result.success) {
        throw new Error(result.message || 'Failed to request password reset');
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset.');
      setLoading(false);
      throw err;
    }
  };

  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.resetPassword({ token, newPassword });
      if (!result.success) {
        throw new Error(result.message || 'Failed to reset password');
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
      setLoading(false);
      throw err;
    }
  };

  const verifyEmail = async (token: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Always succeed
      setLoading(false);
    } catch (err) {
      setError('Failed to verify email.');
      setLoading(false);
      throw new Error('Email verification failed');
    }
  };

  const validatePassword = async (password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.validatePassword(password);
      if (!result.success) {
        throw new Error(result.message || 'Invalid password');
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Password validation failed.');
      setLoading(false);
      throw err;
    }
  };

  // Check for authentication on mount using token from cookies
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = Cookies.get('accessToken');

      if (accessToken) {
        try {
          // Decode the token to get user info
          const decodedToken: any = jwtDecode(accessToken);

          // Validate token structure
          if (
            !decodedToken.id ||
            !decodedToken.email ||
            !decodedToken.name ||
            !decodedToken.exp
          ) {
            Cookies.remove('accessToken', { path: '/' });
            Cookies.remove('refreshToken', { path: '/' });
            setLoading(false);
            return;
          }

          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp && decodedToken.exp > currentTime) {
            // Token is valid, set auth state
            setUser({
              id: decodedToken.id,
              name: decodedToken.name,
              email: decodedToken.email,
              role: decodedToken.role || 'user',
              avatar: decodedToken.avatar,
            });
            setIsAuthenticated(true);
            setLoading(false);
          } else {
            // Token is expired, try to refresh
            try {
              await authService.refreshToken();
              // Recursively check auth again after refresh
              setTimeout(checkAuth, 100);
            } catch (refreshErr) {
              // Clear cookies and auth state if refresh fails
              Cookies.remove('accessToken', { path: '/' });
              Cookies.remove('refreshToken', { path: '/' });
              setUser(null);
              setIsAuthenticated(false);
              setLoading(false);
            }
          }
        } catch (err) {
          // Token is invalid, remove it
          Cookies.remove('accessToken', { path: '/' });
          Cookies.remove('refreshToken', { path: '/' });
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      } else {
        // No token found, user is not authenticated
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Create context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    register,
    clearError,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    validatePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
