'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Smartphone,
  Send,
  Calendar,
  TrendingUp,
  Wifi,
  WifiOff,
  Clock,
} from 'lucide-react';
import { MainPageLayout } from '@/components/dashboard/main-page-layout';
// Dummy data for the dashboard
const dashboardData = {
  totalDevices: 3,
  broadcastsSent: 54,
  activeSchedules: 2,
  quota: { used: 54, total: 200 },
};

// Dummy data for recent broadcasts
const recentBroadcasts = [
  {
    id: 1,
    name: 'Summer Sale Campaign',
    date: '2025-07-12',
    status: 'Delivered',
  },
  { id: 2, name: 'Product Launch', date: '2025-07-11', status: 'Delivered' },
  { id: 3, name: 'Weekly Newsletter', date: '2025-07-10', status: 'Failed' },
  { id: 4, name: 'Customer Survey', date: '2025-07-09', status: 'Delivered' },
  { id: 5, name: 'Flash Sale Alert', date: '2025-07-08', status: 'Pending' },
];

// Dummy data for chart (last 7 days)
const chartData = [
  { day: 'Jul 7', broadcasts: 8 },
  { day: 'Jul 8', broadcasts: 12 },
  { day: 'Jul 9', broadcasts: 6 },
  { day: 'Jul 10', broadcasts: 15 },
  { day: 'Jul 11', broadcasts: 9 },
  { day: 'Jul 12', broadcasts: 4 },
  { day: 'Jul 13', broadcasts: 0 },
];

// Dummy data for devices
const devices = [
  {
    id: 1,
    name: 'WhatsApp Device 1',
    status: 'online',
    lastActive: '2 minutes ago',
  },
  {
    id: 2,
    name: 'WhatsApp Device 2',
    status: 'offline',
    lastActive: '1 hour ago',
  },
  {
    id: 3,
    name: 'WhatsApp Device 3',
    status: 'online',
    lastActive: 'Just now',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            Delivered
          </Badge>
        );
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'Pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeviceIcon = (status: string) => {
    return status === 'online' ? (
      <Wifi className="h-4 w-4 text-green-600" />
    ) : (
      <WifiOff className="h-4 w-4 text-gray-400" />
    );
  };
  return (
    <MainPageLayout
      title="Dashboard"
      description={`Welcome back, ${
        user?.name || 'User'
      }! Here's your dashboard overview.`}
    >
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">
              Total Devices
            </CardTitle>
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-3xl font-bold">
              {dashboardData.totalDevices}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Connected devices
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">
              Broadcasts Sent
            </CardTitle>
            <Send className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-3xl font-bold">
              {dashboardData.broadcastsSent}
            </div>
            <p className="text-xs text-green-600 mt-2">+12 from last week</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">
              Active Schedules
            </CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-3xl font-bold">
              {dashboardData.activeSchedules}
            </div>
            <p className="text-xs text-blue-600 mt-2">2 upcoming campaigns</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">
              Broadcast Quota
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-3xl font-bold">
              {dashboardData.quota.total - dashboardData.quota.used}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {dashboardData.quota.total} remaining
            </p>
            <Progress
              value={
                (dashboardData.quota.used / dashboardData.quota.total) * 100
              }
              className="mt-3 h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Chart and Recent Broadcasts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Broadcasts Chart */}
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle>Broadcasts Last 7 Days</CardTitle>
            <CardDescription>Daily broadcast activity overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="broadcasts" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Broadcasts Table */}
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Broadcasts</CardTitle>
            <CardDescription>
              Your 5 most recent broadcast campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBroadcasts.map((broadcast) => (
                  <TableRow key={broadcast.id}>
                    <TableCell className="font-medium">
                      {broadcast.name}
                    </TableCell>
                    <TableCell>{broadcast.date}</TableCell>
                    <TableCell>{getStatusBadge(broadcast.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Device Status */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle>Device Status</CardTitle>
          <CardDescription>
            Current status of your connected WhatsApp devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Last Active
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.status)}
                      <span
                        className={
                          device.status === 'online'
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }
                      >
                        {device.status.charAt(0).toUpperCase() +
                          device.status.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {device.lastActive}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainPageLayout>
  );
}
