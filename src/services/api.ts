import axios from 'axios';

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

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Get the original request config
    const originalRequest = error.config;

    // Check if the error is due to an expired token (401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Import the auth service locally to avoid circular dependency
        const authService = require('./auth.service').default;

        // Try to refresh the token
        const refreshResult = await authService.refreshToken();

        if (refreshResult.success) {
          // Retry the original request with the new token
          return api(originalRequest);
        }
      } catch (refreshError) {
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
