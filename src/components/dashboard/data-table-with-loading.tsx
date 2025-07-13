'use client';

import React, { useState, useEffect } from 'react';
import { useLoadingState } from '@/hooks/useLoadingState';
import { LoadingWrapper } from '@/components/ui/loading';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Sample data interface
interface DataItem {
  id: number;
  name: string;
  status: string;
  lastUpdated: string;
}

// Sample data
const sampleData: DataItem[] = [
  {
    id: 1,
    name: 'Dashboard Overview',
    status: 'Active',
    lastUpdated: '2023-06-15',
  },
  {
    id: 2,
    name: 'User Management',
    status: 'Pending',
    lastUpdated: '2023-06-14',
  },
  {
    id: 3,
    name: 'Analytics Report',
    status: 'Completed',
    lastUpdated: '2023-06-10',
  },
  {
    id: 4,
    name: 'System Settings',
    status: 'Active',
    lastUpdated: '2023-06-05',
  },
];

export function DataTableWithLoading() {
  const [data, setData] = useState<DataItem[]>([]);

  // Use our custom loading hook
  const { isLoading, withLoading } = useLoadingState({
    name: 'DataTable',
    useGlobalOverlay: false, // Use component-level loading instead of global
  });

  // Simulate data fetching
  const fetchData = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return sampleData;
  };

  // Function to refresh data with loading state
  const refreshData = async () => {
    await withLoading(
      async () => {
        const newData = await fetchData();
        setData(newData);
        toast('Data refreshed', {
          description: 'The table data has been updated.',
        });
        return newData;
      },
      { message: 'Refreshing data...' }
    );
  };

  // Initial data load
  useEffect(() => {
    withLoading(
      async () => {
        const initialData = await fetchData();
        setData(initialData);
        return initialData;
      },
      { message: 'Loading data...' }
    );
  }, []);

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Data Table Example</CardTitle>
          <CardDescription>
            With integrated loading states and refresh capability
          </CardDescription>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm">
          Refresh Data
        </Button>
      </CardHeader>

      <CardContent>
        <LoadingWrapper isLoading={isLoading} loadingText="Loading data...">
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="h-10 px-4 text-left font-medium">Name</th>
                  <th className="h-10 px-4 text-left font-medium">Status</th>
                  <th className="h-10 px-4 text-left font-medium">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">{item.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LoadingWrapper>
      </CardContent>
    </Card>
  );
}

export default DataTableWithLoading;
