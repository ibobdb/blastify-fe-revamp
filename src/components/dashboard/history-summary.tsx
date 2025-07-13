'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  historyService,
  HistorySummary as HistorySummaryType,
} from '@/services/history.service';
import { Loader2 } from 'lucide-react';

interface StatusConfig {
  [key: string]: {
    color: string;
    bgColor: string;
    label: string;
  };
}

const statusConfig: StatusConfig = {
  SENT: { color: 'text-green-600', bgColor: 'bg-green-100', label: 'Sent' },
  PENDING: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    label: 'Pending',
  },
  SCHEDULED: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'Scheduled',
  },
  PROCESSING: {
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'Processing',
  },
  CANCELED: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    label: 'Canceled',
  },
  FAILED: { color: 'text-red-600', bgColor: 'bg-red-100', label: 'Failed' },
};

export function HistorySummary() {
  const [summary, setSummary] = useState<HistorySummaryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'last7Days' | 'last30Days' | 'last90Days'
  >('last30Days');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await historyService.getHistory({});
        setSummary(response.data.summary);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch summary'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading summary...</span>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="text-center p-8 text-red-600">
        Error: {error || 'No data available'}
      </div>
    );
  }

  const sentStatus = summary.byStatus.find((s) => s.status === 'SENT');
  const failedStatus = summary.byStatus.find((s) => s.status === 'FAILED');

  // Get current period data
  const currentPeriodData = summary.byPeriod[selectedPeriod];
  const periodTotal = currentPeriodData.count;

  const deliveryRate = sentStatus ? sentStatus.percentage : 0;
  const successRate =
    sentStatus && summary.total > 0
      ? (sentStatus.total / summary.total) * 100
      : 0;

  return (
    <div className="space-y-4">
      {/* Title and Period Filter Tabs */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-muted-foreground">
          Overview
        </h2>
        <Tabs
          value={selectedPeriod}
          onValueChange={(value) => setSelectedPeriod(value as any)}
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="last7Days" className="text-xs">
              Last 7 days
            </TabsTrigger>
            <TabsTrigger value="last30Days" className="text-xs">
              Last 30 days
            </TabsTrigger>
            <TabsTrigger value="last90Days" className="text-xs">
              Last 90 days
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Messages Card */}
        <Card className="p-3">
          <CardHeader className="pb-1 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Messages (
              {selectedPeriod.replace('last', '').replace('Days', ' days')})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-1">
            <div className="text-xl font-bold">{periodTotal}</div>
            <div className="text-xs text-muted-foreground">
              {currentPeriodData.changeFromPrevious > 0 ? '+' : ''}
              {currentPeriodData.changeFromPrevious.toFixed(1)}% from previous
              period
            </div>
          </CardContent>
        </Card>

        {/* Delivery Rate Card */}
        <Card className="p-3">
          <CardHeader className="pb-1 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Delivery Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-0 pt-1">
            <div className="text-lg font-bold text-green-600">
              {deliveryRate.toFixed(1)}%
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-600">Sent</span>
                <span className="font-medium">{sentStatus?.total || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${deliveryRate}%` }}
                />
              </div>
              {failedStatus && failedStatus.total > 0 && (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-600">Failed</span>
                    <span className="font-medium">{failedStatus.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${failedStatus.percentage}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Success Rate Card */}
        <Card className="p-3">
          <CardHeader className="pb-1 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-0 pt-1">
            <div className="relative w-16 h-16">
              {/* Background circle */}
              <svg
                className="w-16 h-16 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="stroke-gray-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="2"
                />
                {/* Progress circle */}
                <path
                  className="stroke-green-500"
                  strokeDasharray={`${successRate}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">
                  {successRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Status Card */}
        <Card className="p-3">
          <CardHeader className="pb-1 p-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Message Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-0 pt-1">
            {summary.byStatus
              .filter((status) => status.total > 0)
              .sort((a, b) => b.total - a.total)
              .map((status) => {
                const config =
                  statusConfig[status.status] || statusConfig.FAILED;
                const statusColor =
                  status.status === 'SENT'
                    ? '#10b981'
                    : status.status === 'PENDING'
                    ? '#f59e0b'
                    : status.status === 'SCHEDULED'
                    ? '#3b82f6'
                    : status.status === 'PROCESSING'
                    ? '#8b5cf6'
                    : status.status === 'CANCELED'
                    ? '#6b7280'
                    : '#ef4444';

                return (
                  <div
                    key={status.status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: statusColor }}
                      />
                      <span className="text-xs font-medium">
                        {config.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold">{status.total}</span>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
