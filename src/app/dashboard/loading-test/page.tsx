'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useLoading } from '@/context';
import {
  PageLoading,
  DataLoading,
  LoadingWrapper,
  DataLoadingWrapper,
} from '@/components/ui/loading';
import { LoadingExamples } from '@/components/dashboard/loading-examples';
import { useLoadingState } from '@/hooks/useLoadingState';
import { toast } from 'sonner';

export default function LoadingTestPage() {
  // Global loading control
  const { showLoading, hideLoading } = useLoading();

  // Component-level loading with the useLoadingState hook
  const {
    isLoading: localLoading,
    startLoading,
    stopLoading,
    withLoading,
  } = useLoadingState({ name: 'TestComponent', useGlobalOverlay: false });

  // State for the inline loading components
  const [showInlineLoading, setShowInlineLoading] = useState(false);

  // State for the data wrapper examples
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Handler for global loading
  const handleGlobalLoading = () => {
    showLoading('Testing global loading overlay...');

    setTimeout(() => {
      hideLoading();
      toast('Global loading complete!');
    }, 3000);
  };

  // Handler for local component loading
  const handleLocalLoading = () => {
    startLoading('Processing local component...');

    setTimeout(() => {
      stopLoading();
      toast('Local loading complete!');
    }, 2000);
  };

  // Handler for withLoading helper
  const handleAsyncLoading = async () => {
    try {
      await withLoading(
        async () => {
          // Simulate async work
          await new Promise((resolve) => setTimeout(resolve, 2500));
          return true;
        },
        { message: 'Performing async operation...' }
      );

      toast('Async operation completed!');
    } catch (error) {
      toast('Async operation failed!');
    }
  };

  // Handler for inline loading
  const handleInlineLoading = () => {
    setShowInlineLoading(true);

    setTimeout(() => {
      setShowInlineLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Loading Component Tests
        </h1>
        <p className="text-muted-foreground">
          This page demonstrates various loading patterns available in the
          application.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Global Loading Test */}
        <Card>
          <CardHeader>
            <CardTitle>Global Loading Overlay</CardTitle>
            <CardDescription>
              Shows a fullscreen loading overlay across the entire application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGlobalLoading}>
              Show Global Loading (3s)
            </Button>
          </CardContent>
        </Card>
        {/* Local Component Loading Test */}
        <Card>
          <CardHeader>
            <CardTitle>Component Loading</CardTitle>
            <CardDescription>
              Uses the useLoadingState hook for component-level loading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoadingWrapper
              isLoading={localLoading}
              loadingText="Component loading..."
            >
              <Button onClick={handleLocalLoading}>
                Show Component Loading (2s)
              </Button>
            </LoadingWrapper>
          </CardContent>
        </Card>
        {/* withLoading Helper Test */}
        <Card>
          <CardHeader>
            <CardTitle>Async Loading Helper</CardTitle>
            <CardDescription>
              Uses the withLoading helper for async operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAsyncLoading}>
              Start Async Operation (2.5s)
            </Button>
          </CardContent>
        </Card>
        {/* Inline Loading Test */}
        <Card>
          <CardHeader>
            <CardTitle>Inline Loading</CardTitle>
            <CardDescription>
              Shows different loading spinner sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={handleInlineLoading}>
                Show Inline Loading (2s)
              </Button>{' '}
              {showInlineLoading && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <DataLoading size="sm" />
                    <span>Small Data Loading</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <DataLoading size="md" />
                    <span>Medium Data Loading</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <DataLoading size="lg" />
                    <span>Large Data Loading</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <PageLoading size="sm" />
                    <span>Small Page Loading</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>{' '}
      </div>

      <div className="border-t pt-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">New Loading Components</h2>
        <LoadingExamples />

        {/* Additional data loading wrapper example */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Data Loading Wrapper Example</span>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDataLoading(true);
                  setTimeout(() => setIsDataLoading(false), 2000);
                }}
              >
                Toggle Loading
              </Button>
            </CardTitle>
            <CardDescription>
              Shows how to use the new DataLoadingWrapper component
            </CardDescription>
          </CardHeader>
          <DataLoadingWrapper
            isLoading={isDataLoading}
            loadingText="Processing data..."
          >
            <CardContent>
              <p>
                This content is wrapped with the DataLoadingWrapper component.
              </p>
              <p className="mt-4">
                When loading is active, this content is replaced with a data
                loading spinner.
              </p>
            </CardContent>
          </DataLoadingWrapper>
        </Card>
      </div>
    </div>
  );
}
