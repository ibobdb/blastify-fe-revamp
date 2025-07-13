'use client';
import { Schedule } from '@/services/schedule.service';
import { DataTable } from '@/components/dashboard/datatable';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { scheduleService } from '@/services/schedule.service';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination } from '@/components/dashboard/datatable';
import { useConfirm } from '@/context';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal, Ban } from 'lucide-react';
import { Badge } from '../ui/badge';

export function ScheduleTable() {
  const [data, setData] = useState<Schedule[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [cancelingSchedules, setCancelingSchedules] = useState<Set<string>>(
    new Set()
  );
  const { confirmDanger } = useConfirm();

  const columns: ColumnDef<Schedule>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'ID',
      size: 100,
      maxSize: 100,
      cell: ({ row }) => {
        const id = row.getValue('id') as string;
        return (
          <div className="w-20">
            <span
              className="font-mono text-muted-foreground text-xs truncate block"
              title={id}
            >
              {id.slice(0, 8)}...
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'scheduleDate',
      header: 'Schedule Date',
      cell: ({ row }) => {
        const value = row.getValue('scheduleDate');
        const date = value ? new Date(value as string) : null;
        return (
          <span>
            {date && !isNaN(date.getTime()) ? date.toLocaleString() : ''}
          </span>
        );
      },
    },
    {
      accessorKey: 'messageCount',
      header: 'Total Message',
      cell: ({ row }) => <span>{row.getValue('messageCount')}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant={
            row.getValue('status') === 'COMPLETED'
              ? 'default'
              : row.getValue('status') === 'SCHEDULED'
              ? 'outline'
              : row.getValue('status') === 'CANCELED'
              ? 'destructive_accent'
              : 'default'
          }
        >
          {row.getValue('status')}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue('createdAt');
        const date = value ? new Date(value as string) : null;
        return (
          <span>
            {date && !isNaN(date.getTime()) ? date.toLocaleString() : ''}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const schedule = row.getValue('status');
        const scheduleId = row.getValue('id') as string;
        const isCanceling = cancelingSchedules.has(scheduleId);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={isCanceling}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                variant="destructive"
                disabled={schedule !== 'SCHEDULED' || isCanceling}
                onClick={() => {
                  handleCancelSchedule(scheduleId);
                }}
              >
                {isCanceling ? 'Canceling...' : 'Cancel Schedule'}
                <Ban className="ml-2 h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleFetchSchedules = async (
    page = pagination.page,
    limit = pagination.limit,
    search = ''
  ) => {
    try {
      setLoading(true);
      const response = await scheduleService.fetchSchedules({
        page,
        limit,
        search,
      });
      if (response.status) {
        setData(response.data.schedulers);
        setPagination((prev) => ({
          ...prev,
          ...response.data.pagination,
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
        }));
      } else {
        console.error('Failed to fetch schedules:', response.message);
      }
      console.log('Fetched schedules:', response);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);
  const handleCancelSchedule = async (scheduleId: string) => {
    // Prevent multiple cancel operations on the same schedule
    if (cancelingSchedules.has(scheduleId)) {
      return;
    }

    try {
      const confirmed = await confirmDanger(
        'Cancel Schedule?',
        'This will cancel the schedule and all associated messages. Are you sure?',
        'Cancel Schedule',
        async () => {
          // Add to canceling set to show loading state in UI
          setCancelingSchedules((prev) => new Set(prev).add(scheduleId));

          try {
            // This function will be called with loading state managed by the dialog
            const response = await scheduleService.cancelSchedule(scheduleId);
            if (response.status) {
              console.log('Schedule cancelled successfully:', response);
              toast.success('Schedule cancelled successfully');
              // Refresh the schedule list after cancellation
              handleFetchSchedules();
            } else {
              console.error('Failed to cancel schedule:', response.message);
              toast.error(response.message || 'Failed to cancel schedule');
              throw new Error(response.message || 'Failed to cancel schedule');
            }
          } finally {
            // Remove from canceling set
            setCancelingSchedules((prev) => {
              const newSet = new Set(prev);
              newSet.delete(scheduleId);
              return newSet;
            });
          }
        }
      );
    } catch (error) {
      console.error('Error cancelling schedule:', error);
      // Error handling is now done in the onConfirm callback
      // The toast.error for API failures is handled above
    }
  };
  return (
    <DataTable
      data={data}
      columns={columns}
      pagination={{
        pagination,
        onPageChange: (page: number) =>
          setPagination((prev) => ({ ...prev, page: page + 1 })),
        onPageSizeChange: (limit: number) =>
          setPagination((prev) => ({ ...prev, limit, page: 1 })),
      }}
      loading={loading}
      onSearch={(value: string) => {
        handleFetchSchedules(1, pagination.limit, value);
      }}
      onRefresh={() => handleFetchSchedules()}
      title="Scheduled Messages Overview"
      description="View and manage your scheduled messages. Cancel or modify schedules as needed."
    />
  );
}
