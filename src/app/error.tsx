'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw, Bug } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto text-center">
        <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
          <CardContent className="p-12">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-16 h-16 text-destructive" />
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                Something went wrong!
              </h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto mb-4">
                An unexpected error has occurred. We're working to fix this
                issue.
              </p>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-4 bg-muted rounded-lg text-left">
                  <h3 className="font-medium text-sm text-foreground mb-2 flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Error Details (Development Only)
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-muted-foreground font-mono mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={reset}
                variant="default"
                size="lg"
                className="w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Home Page
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                If this problem persists, please{' '}
                <Link
                  href="/contact"
                  className="text-primary hover:underline font-medium"
                >
                  contact our support team
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
