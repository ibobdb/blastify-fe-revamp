import { NextResponse } from 'next/server';

/**
 * Security headers to be used in middleware and API routes
 */
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy':
    process.env.NODE_ENV === 'production'
      ? `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL};`
      : '',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

/**
 * Apply security headers to a Next.js response
 * @param response The NextResponse object
 * @returns The response with security headers added
 */
export const applySecurityHeaders = (response: NextResponse): NextResponse => {
  // Apply each security header
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });

  return response;
};

/**
 * Get security headers as a simple object (for use with next.config.js)
 * @returns Object containing security headers
 */
export function getSecurityHeaders() {
  return [
    {
      key: 'X-DNS-Prefetch-Control',
      value: 'on',
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
      key: 'X-Frame-Options',
      value: 'DENY',
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=()',
    },
  ];
}
