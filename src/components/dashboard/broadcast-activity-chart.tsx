import React from 'react';
import { dashboardService } from '@/services/dashboard.service';
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface ChartProps {
  day: string;
  broadcasts: number;
}

interface BroadcastActivityChartProps {
  date: {
    start_date: string;
    end_date: string;
  };
}

interface ApiResponse {
  date: string;
  count: number;
}

export function BroadcastActivityChart({ date }: BroadcastActivityChartProps) {
  const [chartData, setChartData] = React.useState<ChartProps[]>([]);

  const groupDataByWeek = (data: ApiResponse[]): ChartProps[] => {
    const weekMap = new Map<string, number>();

    data.forEach((item) => {
      const date = new Date(item.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];

      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + item.count);
    });

    // Sort weeks by date and assign sequential numbers
    const sortedWeeks = Array.from(weekMap.entries()).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );

    return sortedWeeks.map(([weekStart, count], index) => ({
      day: `Week ${index + 1}`,
      broadcasts: count,
    }));
  };

  const groupDataByMonth = (data: ApiResponse[]): ChartProps[] => {
    const monthMap = new Map<string, number>();

    data.forEach((item) => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;

      monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + item.count);
    });

    // Sort months by date
    const sortedMonths = Array.from(monthMap.entries()).sort(([a], [b]) =>
      a.localeCompare(b)
    );

    return sortedMonths.map(([monthKey, count]) => {
      const [year, month] = monthKey.split('-');
      const monthName = new Date(
        parseInt(year),
        parseInt(month) - 1,
        1
      ).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      return {
        day: monthName,
        broadcasts: count,
      };
    });
  };

  const groupDataByYear = (data: ApiResponse[]): ChartProps[] => {
    const yearMap = new Map<string, number>();

    data.forEach((item) => {
      const date = new Date(item.date);
      const year = date.getFullYear().toString();

      yearMap.set(year, (yearMap.get(year) || 0) + item.count);
    });

    // Sort years
    const sortedYears = Array.from(yearMap.entries()).sort(
      ([a], [b]) => parseInt(a) - parseInt(b)
    );

    return sortedYears.map(([year, count]) => ({
      day: year,
      broadcasts: count,
    }));
  };

  const processChartData = (data: ApiResponse[]): ChartProps[] => {
    const dataLength = data.length;

    if (dataLength <= 7) {
      // Group by date (default) - sort by date
      const sortedData = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return sortedData.map((item) => ({
        day: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        broadcasts: item.count,
      }));
    } else if (dataLength <= 30) {
      // Group by week
      return groupDataByWeek(data);
    } else if (dataLength <= 365) {
      // Group by month
      return groupDataByMonth(data);
    } else {
      // Group by year
      return groupDataByYear(data);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await dashboardService.getBroadcastActivity({
        start_date: date.start_date,
        end_date: date.end_date,
      });

      if (response.success && response.data) {
        const processedData = processChartData(response.data);
        setChartData(processedData);
      }
    } catch (error) {
      setChartData([]);
    }
  };

  React.useEffect(() => {
    fetchChartData();
  }, [date]);

  return (
    <>
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
    </>
  );
}
