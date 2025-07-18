import { NextRequest, NextResponse } from 'next/server';
import { applySecurityHeaders } from '@/utils/security-headers';
import { jwtDecode } from 'jwt-decode';

/**
 * Next.js Middleware - Authentication protection and security
 *
 * This middleware protects all routes by default except:
 * 1. Public routes (landing page, auth pages)
 * 2. Public API endpoints (auth-related)
 * 3. Static assets (_next/static, images, etc.)
 */
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Check if user is accessing a public route (should NOT be protected)
  const isPublicRoute =
    // Landing page and root
    pathname === '/' ||
    // Landing page subsections that don't require login
    pathname === '/features' ||
    pathname === '/pricing' ||
    pathname === '/contact' ||
    pathname === '/about' ||
    pathname === '/privacy-policy' ||
    pathname === '/terms-of-service' ||
    pathname === '/faq' ||
    // Authentication routes - use startsWith to catch any query parameters
    pathname.startsWith('/signin') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/verify-email') ||
    // Public API endpoints
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/register') ||
    pathname.startsWith('/api/auth/refresh-token') ||
    pathname.startsWith('/api/auth/forgot-password') ||
    pathname.startsWith('/api/auth/reset-password') ||
    pathname.startsWith('/api/auth/verify-email');

  // All routes are protected by default except public routes
  const isProtectedRoute = !isPublicRoute;

  // Get the token from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // If accessing a protected route, check authentication
  if (isProtectedRoute) {
    // No access token - authentication required
    if (!accessToken) {
      // API routes should return 401 for client-side handling
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        );
      }

      // For non-API routes, redirect to login page
      const url = new URL('/signin', request.url);
      url.searchParams.set('from', pathname);

      // If we have a refresh token, indicate that in the URL
      if (refreshToken) {
        url.searchParams.set('refresh', 'true');
      }

      const response = NextResponse.redirect(url);

      // Add headers to help client understand what happened
      response.headers.set('X-Middleware-Redirect', 'signin');
      response.headers.set('X-Redirect-Reason', 'no-token');

      return response;
    }

    // We have an access token, but need to validate it
    try {
      const decodedToken: any = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if token has required fields
      if (!decodedToken.id || !decodedToken.email || !decodedToken.exp) {
        throw new Error('Invalid token structure');
      }

      // Check token expiration
      if (!decodedToken.exp || decodedToken.exp <= currentTime) {
        // For API routes, return 401 for client-side handling
        if (pathname.startsWith('/api')) {
          return NextResponse.json(
            { success: false, message: 'Token expired' },
            { status: 401 }
          );
        }

        // For non-API routes, redirect to login with expired flag
        const url = new URL('/signin', request.url);
        url.searchParams.set('from', pathname);
        url.searchParams.set('expired', 'true');
        const response = NextResponse.redirect(url);
        response.headers.set('X-Middleware-Redirect', 'signin');
        response.headers.set('X-Redirect-Reason', 'expired-token');
        return response;
      }

      // Valid token, continue processing
    } catch (error) {
      // Invalid token format
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { success: false, message: 'Invalid authentication token' },
          { status: 401 }
        );
      }

      // For non-API routes, redirect to login
      const url = new URL('/signin', request.url);
      url.searchParams.set('from', pathname);
      url.searchParams.set('invalid', 'true');
      const response = NextResponse.redirect(url);
      response.headers.set('X-Middleware-Redirect', 'signin');
      response.headers.set('X-Redirect-Reason', 'invalid-token');
      return response;
    }
  }

  // For all responses, ensure security headers are set
  const response = NextResponse.next();

  // Apply security headers using the utility function
  applySecurityHeaders(response);

  return response;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     *
     * The middleware function will determine which routes are public vs protected
     */
    '/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|json)$).*)',
  ],
};
