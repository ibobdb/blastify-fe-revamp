import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Send, Calendar, TrendingUp } from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';
import React from 'react';
interface SummaryCardProps {
  date: {
    start_date: string;
    end_date: string;
  };
}
interface SummaryData {
  totalDevices: number;
  broadcastSent: number;
  activeSchedules: number;
  currentQuota: number;
}

export function SummaryCard({ date }: SummaryCardProps) {
  const [summaryData, setSummaryData] = React.useState<SummaryData | null>(
    null
  );
  const fetchSummaryData = async () => {
    try {
      const response = await dashboardService.getDashboardSummary(date);
      if (response.success) {
        setSummaryData(response.data);
      }
    } catch (error) {
      // Handle error silently or implement proper error handling
    }
  };
  React.useEffect(() => {
    fetchSummaryData();
  }, [date]);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-medium">Total Devices</CardTitle>
          <Smartphone className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="py-2">
          <div className="text-3xl font-semibold">
            {summaryData ? summaryData.totalDevices : 'Loading...'}
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
          <div className="text-3xl font-semibold">
            {summaryData ? summaryData.broadcastSent : 'Loading...'}
          </div>
          <p className="text-xs text-green-600 mt-2">
            Broadcasts sent this week
          </p>
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
          <div className="text-3xl font-semibold">
            {summaryData ? summaryData.activeSchedules : 'Loading...'}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Scheduled broadcasts
          </p>
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
          <div className="text-3xl font-semibold">
            {summaryData ? summaryData.currentQuota : 'Loading...'}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Current broadcast quota
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
