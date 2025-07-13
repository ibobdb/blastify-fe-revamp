'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw, Shield } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-2xl mx-auto text-center">
            <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
              <CardContent className="p-12">
                {/* Error Icon */}
                <div className="mb-8">
                  <div className="w-32 h-32 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-16 h-16 text-destructive" />
                  </div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    Critical Error
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto mb-4">
                    A critical error has occurred in the application. Please try
                    refreshing the page.
                  </p>

                  {/* Error Details (only in development) */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg text-left border border-red-200 dark:border-red-800">
                      <h3 className="font-medium text-sm text-red-800 dark:text-red-200 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Global Error Details (Development Only)
                      </h3>
                      <p className="text-xs text-red-700 dark:text-red-300 font-mono break-all">
                        {error.message}
                      </p>
                      {error.digest && (
                        <p className="text-xs text-red-700 dark:text-red-300 font-mono mt-2">
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

                  <Button
                    onClick={() => (window.location.href = '/')}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home Page
                  </Button>
                </div>

                {/* Help Text */}
                <div className="mt-8 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    If this problem persists, please contact our technical
                    support team
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </body>
    </html>
  );
}
