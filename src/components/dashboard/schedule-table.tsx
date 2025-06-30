'use client';
import { Schedule } from '@/services/schedule.service';
import { DataTable } from '@/components/dashboard/datatable';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { scheduleService } from '@/services/schedule.service';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination } from '@/components/dashboard/datatable';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal, Ban } from 'lucide-react';
import { Badge } from '../ui/badge';
export const columns: ColumnDef<Schedule>[] = [
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
    size: 10,
    cell: ({ row }) => (
      <span className="font-mono text-muted-foreground text-xs truncate">
        {row.getValue('id')}
      </span>
    ),
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
            : row.getValue('status') === 'failed'
            ? 'destructive'
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
      const schedule = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem variant="destructive">
              Cancel Schedule
              <Ban className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

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
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetchSchedules = async (
    page = pagination.page,
    limit = pagination.limit,
    search = searchValue
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
    handleFetchSchedules(pagination.page, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

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
      onRefresh={() => handleFetchSchedules(pagination.page, pagination.limit)}
    />
  );
}
