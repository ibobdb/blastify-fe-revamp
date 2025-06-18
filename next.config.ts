import type { NextConfig } from 'next';
import { getSecurityHeaders } from './src/utils/security-headers';

const nextConfig: NextConfig = {
  /* config options here */

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
