import axios from 'axios';
import logger from '@/utils/logger';

// Create an API-specific logger instance
const apiLogger = logger.child('API');

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Request interceptor with auth token handling
api.interceptors.request.use(
  (config) => {
    // Import here to avoid circular dependency issues
    const Cookies = require('js-cookie');

    // Get the token from cookies
    const token = Cookies.get('accessToken');

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the outgoing request (without sensitive data)
    apiLogger.debug(
      `Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      {
        method: config.method,
        url: `${config.baseURL}${config.url}`,
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization
            ? 'Bearer [REDACTED]'
            : undefined,
        },
        timestamp: new Date().toISOString(),
      }
    );

    return config;
  },
  (error) => {
    apiLogger.error('Request error', error);
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses (without sensitive data)
    apiLogger.debug(
      `Response: ${response.status} ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`,
      {
        status: response.status,
        method: response.config.method,
        url: response.config.url,
        duration: response.headers['x-response-time'] || 'unknown',
        timestamp: new Date().toISOString(),
      }
    );

    return response;
  },
  async (error) => {
    // Get the original request config
    const originalRequest = error.config;

    // Log the error response
    if (error.response) {
      apiLogger.warn(
        `API Error: ${
          error.response.status
        } ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
        {
          status: error.response.status,
          method: originalRequest?.method,
          url: originalRequest?.url,
          message: error.response.data?.message || error.message,
          timestamp: new Date().toISOString(),
        }
      );
    } else {
      apiLogger.error('API Request failed', error);
    }

    // Check if the error is due to an expired token (401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      apiLogger.info('Token expired, attempting to refresh...');

      try {
        // Import the auth service locally to avoid circular dependency
        const authService = require('./auth.service').default;

        // Try to refresh the token
        const refreshResult = await authService.refreshToken();

        if (refreshResult.success) {
          apiLogger.debug(
            'Token refreshed successfully, retrying original request'
          );
          // Retry the original request with the new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        apiLogger.warn(
          'Token refresh failed, redirecting to login',
          refreshError
        );

        // If refresh fails, redirect to login
        if (typeof window !== 'undefined') {
          // Clear authentication state
          const authService = require('./auth.service').default;
          await authService.logout();

          // Redirect to login page
          window.location.href = '/signin';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
