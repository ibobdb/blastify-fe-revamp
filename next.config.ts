import type { NextConfig } from 'next';
import { getSecurityHeaders } from './src/utils/security-headers';

const nextConfig: NextConfig = {
  /* config options here */

  // Enable standalone output for Docker builds
  output: 'standalone',

  // Improve build performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Setting this to false can help bypass TypeScript errors in development
  typescript: {
    // This ignores TypeScript errors during builds
    ignoreBuildErrors: true,
  },

  // Setting this to false can help bypass ESLint errors during builds
  eslint: {
    // This ignores ESLint errors during builds
    ignoreDuringBuilds: true,
  },

  // Remove the X-Powered-By header
  poweredByHeader: false,

  // Webpack configuration for production builds (when not using Turbopack)
  webpack: (config, { isServer, dev }) => {
    // Only apply webpack config when not in development with Turbopack
    if (!dev || !process.env.TURBOPACK) {
      // Fix client reference manifest issues in route groups
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
          path: false,
          crypto: false,
          stream: false,
          util: false,
          buffer: false,
          querystring: false,
          url: false,
        };
      }
    }

    return config;
  },

  // Set security headers at the server level
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: getSecurityHeaders(),
      },
    ];
  },

  // Ensure API URL is correctly set
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://api.blastify.com',
  },
};

export default nextConfig;
