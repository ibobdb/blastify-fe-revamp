'use client';

import React, { useState } from 'react';
import {
  DataLoading,
  LoadingWrapper,
  DataLoadingWrapper,
  LoadingButton,
} from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Component showing various examples of loading states
 */
export const LoadingExamples = () => {
  // Component level loading states
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  // Function to simulate data loading
  const simulateLoading = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    time = 2000
  ) => {
    setter(true);
    setTimeout(() => setter(false), time);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Loading Components Examples</h2>

      {/* Inline data loading spinners */}
      <Card>
        <CardHeader>
          <CardTitle>Data Loading Spinners</CardTitle>
          <CardDescription>
            Use these for component-level loading states during data fetching
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-8">
          <div className="flex flex-col items-center gap-2">
            <DataLoading size="sm" />
            <span className="text-sm">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <DataLoading size="md" />
            <span className="text-sm">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <DataLoading size="lg" />
            <span className="text-sm">Large</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <DataLoading size="xl" />
            <span className="text-sm">Extra Large</span>
          </div>
        </CardContent>
      </Card>

      {/* Card with loading state */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Card with Loading State</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateLoading(setIsCardLoading)}
            >
              Load Data
            </Button>
          </CardTitle>
        </CardHeader>
        <DataLoadingWrapper
          isLoading={isCardLoading}
          loadingText="Loading card data..."
        >
          <CardContent>
            <p>
              This card has a loading state that covers only the content area.
            </p>
            <p className="mt-4">
              The loading is controlled by the button above.
            </p>
          </CardContent>
        </DataLoadingWrapper>
      </Card>

      {/* Table with loading state */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Data Table Example</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateLoading(setIsTableLoading)}
            >
              Refresh Data
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <DataLoadingWrapper
              isLoading={isTableLoading}
              loadingText="Fetching data..."
            >
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="border-t">
                      <td className="p-2">Item {item}</td>
                      <td className="p-2">
                        {item % 2 === 0 ? 'Active' : 'Inactive'}
                      </td>
                      <td className="p-2">2025-06-{10 + item}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataLoadingWrapper>
          </div>
        </CardContent>
      </Card>

      {/* Loading Button */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Button</CardTitle>
          <CardDescription>Button with built-in loading state</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <LoadingButton
              isLoading={isButtonLoading}
              onClick={() => simulateLoading(setIsButtonLoading, 2000)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
              loadingText="Saving..."
            >
              Save Changes
            </LoadingButton>

            <Button
              onClick={() => setIsButtonLoading(false)}
              variant="outline"
              disabled={!isButtonLoading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingExamples;
