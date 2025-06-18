'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context';
import { getToken, getRefreshToken } from '@/utils/auth';
import { testMiddlewareProtection } from '@/utils/test-middleware';

export const AuthDiagnostics = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [middlewareTest, setMiddlewareTest] = useState<any>(null);
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);

      // Don't show actual token contents, just existence
      setAccessToken(getToken() ? '[PRESENT]' : null);
      setRefreshToken(getRefreshToken() ? '[PRESENT]' : null);

      // Run middleware test
      const test = testMiddlewareProtection();
      setMiddlewareTest(test);
    }
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl flex items-center gap-2">
          Auth Diagnostics
          {loading ? (
            <Badge variant="outline" className="animate-pulse">
              Loading...
            </Badge>
          ) : isAuthenticated ? (
            <Badge variant="default" className="bg-green-600">
              Authenticated
            </Badge>
          ) : (
            <Badge variant="destructive">Not Authenticated</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Debugging information for authentication state
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="font-medium mb-2">Current Path</h3>
          <pre className="bg-muted p-2 rounded text-sm">{currentPath}</pre>
        </div>

        <div>
          <h3 className="font-medium mb-2">User Info</h3>
          <pre className="bg-muted p-2 rounded text-sm whitespace-pre-wrap">
            {user ? JSON.stringify(user, null, 2) : 'No user data'}
          </pre>
        </div>

        <div>
          <h3 className="font-medium mb-2">Tokens</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Access Token</p>
              <Badge variant={accessToken ? 'default' : 'outline'}>
                {accessToken ? 'Present' : 'Missing'}
              </Badge>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Refresh Token</p>
              <Badge variant={refreshToken ? 'default' : 'outline'}>
                {refreshToken ? 'Present' : 'Missing'}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Middleware Protection Status</h3>
          {middlewareTest && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>Route Protected: </span>
                <Badge
                  variant={
                    currentPath.startsWith('/dashboard') ||
                    currentPath.startsWith('/account') ||
                    currentPath.startsWith('/admin')
                      ? 'default'
                      : 'outline'
                  }
                >
                  {currentPath.startsWith('/dashboard') ||
                  currentPath.startsWith('/account') ||
                  currentPath.startsWith('/admin')
                    ? 'Yes'
                    : 'No'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span>Authentication Required: </span>{' '}
                <Badge
                  variant={
                    !isAuthenticated &&
                    (currentPath.startsWith('/dashboard') ||
                      currentPath.startsWith('/account') ||
                      currentPath.startsWith('/admin'))
                      ? 'destructive'
                      : 'default'
                  }
                >
                  {!isAuthenticated &&
                  (currentPath.startsWith('/dashboard') ||
                    currentPath.startsWith('/account') ||
                    currentPath.startsWith('/admin'))
                    ? '⚠️ Redirect Required'
                    : '✅ OK'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDiagnostics;
