'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorPageLayout } from './error-page-layout';
import { Button } from './ui/button';
import { AlertTriangle, Home, RefreshCw, Bug } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Here you could also log the error to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, render the default error UI
      return (
        <ErrorPageLayout
          errorCode="Error"
          title="Something went wrong"
          description="An unexpected error occurred. Please try refreshing the page or go back to the homepage."
          icon={AlertTriangle}
          iconColor="destructive"
          actions={
            <>
              <Button
                onClick={this.handleRetry}
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
            </>
          }
          additionalInfo={
            <>
              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-6 p-4 bg-muted rounded-lg text-left">
                  <h3 className="font-medium text-sm text-foreground mb-2 flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Error Details (Development Only)
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer">
                        Stack Trace
                      </summary>
                      <pre className="text-xs text-muted-foreground font-mono mt-2 overflow-auto max-h-40">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border/50">
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
            </>
          }
        />
      );
    }

    return this.props.children;
  }
}
