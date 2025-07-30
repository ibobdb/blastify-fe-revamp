'use client';
import { useAuth } from '@/context';

import { MainPageLayout } from '@/components/dashboard/main-page-layout';
import { DateRangePickerWithPresets } from '@/components/dashboard/date-range';

import React from 'react';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { BroadcastActivityChart } from '@/components/dashboard/broadcast-activity-chart';
export default function DashboardPage() {
  const { user } = useAuth();
  type Filter = {
    start_date: string;
    end_date: string;
  };
  const [filter, setFilter] = React.useState<Filter | null>(null);
  return (
    <MainPageLayout
      title="Dashboard"
      description={`Welcome back, ${
        user?.name || 'User'
      }! Here's your dashboard overview.`}
      actionButtons={
        <DateRangePickerWithPresets
          className="w-full md:w-auto"
          onChange={(range) => {
            if (range && range.from && range.to) {
              // Use local date formatting to avoid timezone issues
              const formatLocalDate = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
              };

              setFilter({
                start_date: formatLocalDate(range.from),
                end_date: formatLocalDate(range.to),
              });
            } else {
              setFilter(null);
            }
          }}
          value={
            filter
              ? {
                  from: new Date(filter.start_date + 'T00:00:00'),
                  to: new Date(filter.end_date + 'T00:00:00'),
                }
              : { from: new Date(), to: new Date() }
          }
        />
      }
    >
      {/* Summary Cards */}
      <SummaryCard
        date={{
          start_date:
            filter?.start_date || new Date().toISOString().split('T')[0],
          end_date: filter?.end_date || new Date().toISOString().split('T')[0],
        }}
      />

      {/* Chart and Recent Broadcasts */}
      <div className="grid gap-6 lg:grid-cols-1 mb-8">
        <BroadcastActivityChart
          date={
            filter || {
              start_date: new Date().toISOString().split('T')[0],
              end_date: new Date().toISOString().split('T')[0],
            }
          }
        />
      </div>
    </MainPageLayout>
  );
}
