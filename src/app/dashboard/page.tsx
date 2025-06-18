'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context';
import AuthDiagnostics from '@/components/debug/auth-diagnostics';
import { MiddlewareProtectionTester } from '@/components/auth/middleware-tester';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name || 'User'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="font-medium">
              View Reports
            </Button>
            <Button className="font-medium">New Campaign</Button>
          </div>
        </div>{' '}
        {/* Auth diagnostics and middleware testing components */}
        <div className="mb-6 space-y-6">
          <MiddlewareProtectionTester />
          <AuthDiagnostics />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {' '}
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">
                Total Users
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-5 w-5 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>{' '}
            <CardContent className="py-2">
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs text-green-600 mt-2">
                +10.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">Revenue</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-5 w-5 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>{' '}
            <CardContent className="py-2">
              <div className="text-3xl font-bold">$45,231.89</div>
              <p className="text-xs text-green-600 mt-2">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">Sales</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-5 w-5 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>{' '}
            <CardContent className="py-2">
              <div className="text-3xl font-bold">+12,234</div>
              <p className="text-xs text-green-600 mt-2">
                +19% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Recent Campaigns Section */}
        <Card className="mt-8 border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>
              Overview of your latest WhatsApp marketing campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h3 className="font-medium">June Campaign 1</h3>
                  <p className="text-sm text-muted-foreground">
                    Delivered on June 11, 2025
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    96% Delivered
                  </span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h3 className="font-medium">June Campaign 2</h3>
                  <p className="text-sm text-muted-foreground">
                    Delivered on June 12, 2025
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    96% Delivered
                  </span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">June Campaign 3</h3>
                  <p className="text-sm text-muted-foreground">
                    Delivered on June 13, 2025
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                    96% Delivered
                  </span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
