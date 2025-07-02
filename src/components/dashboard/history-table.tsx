'use client';
import { DataMessage, historyService } from '@/services/history.service';
import { DataTable } from '@/components/dashboard/datatable';
import { ColumnDef } from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination } from '@/components/dashboard/datatable';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HistoryDetailDialog } from '@/components/dashboard/history-detail-dialog';
import { ArrowUpDown, Eye, Copy, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function HistoryTable() {
  const [data, setData] = useState<DataMessage[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<DataMessage | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns: ColumnDef<DataMessage>[] = [
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
      size: 80,
      maxSize: 80,
      cell: ({ row }) => {
        const id = row.getValue('id') as string;
        return (
          <div className="w-20">
            <span
              className="font-mono text-muted-foreground text-xs truncate block"
              title={id}
            >
              {id}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'number',
      header: 'Phone Number',
      cell: ({ row }) => (
        <span className="font-mono">{row.getValue('number')}</span>
      ),
    },
    {
      accessorKey: 'content',
      header: 'Message',
      cell: ({ row }) => {
        const content = row.getValue('content') as string;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-[200px] cursor-help">
                  <span className="truncate block">{content}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="whitespace-pre-wrap break-words">{content}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge
            variant={
              status === 'SENT'
                ? 'info'
                : status === 'DELIVERED'
                ? 'success'
                : status === 'READ'
                ? 'success'
                : status === 'FAILED'
                ? 'destructive'
                : status === 'CANCELED'
                ? 'warning'
                : status === 'pending'
                ? 'muted'
                : 'default'
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'ackStatus',
      header: 'Delivery Status',
      cell: ({ row }) => {
        const ackStatus = row.getValue('ackStatus') as number | string | null;
        if (ackStatus === null || ackStatus === undefined)
          return <span className="text-muted-foreground">-</span>;

        // Convert to string for consistent comparison
        const status = String(ackStatus);

        const getStatusInfo = (status: string) => {
          switch (status) {
            case '-1':
              return { variant: 'destructive' as const, label: 'Error' };
            case '0':
              return { variant: 'warning' as const, label: 'Pending' };
            case '1':
              return { variant: 'info' as const, label: 'Server' };
            case '2':
              return { variant: 'success' as const, label: 'Device' };
            case '3':
              return { variant: 'success' as const, label: 'Read' };
            case '4':
              return { variant: 'accent' as const, label: 'Played' };
            default:
              return { variant: 'muted' as const, label: status };
          }
        };

        const { variant, label } = getStatusInfo(status);

        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => {
        const source = row.getValue('source') as string;
        const variant =
          source === 'WEB' ? 'info' : source === 'API' ? 'outline' : 'default';
        return <Badge variant={variant}>{source}</Badge>;
      },
    },
    {
      accessorKey: 'scheduleDate',
      header: 'Schedule Date',
      cell: ({ row }) => {
        const value = row.getValue('scheduleDate');
        const date = value ? new Date(value as string) : null;
        return (
          <span className="text-sm">
            {date && !isNaN(date.getTime()) ? date.toLocaleString() : '-'}
          </span>
        );
      },
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
          <span className="text-sm">
            {date && !isNaN(date.getTime()) ? date.toLocaleString() : '-'}
          </span>
        );
      },
      enableSorting: true,
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const message = row.original;

        const handleCopyNumber = () => {
          navigator.clipboard.writeText(message.number);
          toast.success('Phone number copied to clipboard');
        };

        const handleCopyContent = () => {
          navigator.clipboard.writeText(message.content);
          toast.success('Message content copied to clipboard');
        };

        const handleCopyId = () => {
          navigator.clipboard.writeText(message.id);
          toast.success('Message ID copied to clipboard');
        };

        const handleViewDetails = () => {
          setSelectedMessage(message);
          setIsDialogOpen(true);
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleViewDetails}>
                View Details
                <Eye className="ml-2 h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyId}>
                Copy Message ID
                <Copy className="ml-2 h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyNumber}>
                Copy Phone Number
                <Copy className="ml-2 h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyContent}>
                Copy Message
                <Copy className="ml-2 h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleFetchHistory = async (
    page = pagination.page,
    limit = pagination.limit,
    search = ''
  ) => {
    try {
      setLoading(true);
      const response = await historyService.getHistory({
        page,
        limit,
        search,
      });

      if (response.status) {
        setData(response.data.data);
        setPagination((prev) => ({
          ...prev,
          ...response.data.pagination,
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
        }));
      } else {
        console.error('Failed to fetch history:', response.message);
        toast.error(response.message || 'Failed to fetch history');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Error fetching message history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  const getStatusLabel = (ackStatus: number | string | null) => {
    if (ackStatus === null || ackStatus === undefined) return '-';
    const status = String(ackStatus);
    switch (status) {
      case '-1':
        return 'Error';
      case '0':
        return 'Pending';
      case '1':
        return 'Server';
      case '2':
        return 'Device';
      case '3':
        return 'Read';
      case '4':
        return 'Played';
      default:
        return status;
    }
  };

  return (
    <>
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
          handleFetchHistory(1, pagination.limit, value);
        }}
        onRefresh={() => handleFetchHistory()}
        onRowClick={(row: DataMessage) => {
          setSelectedMessage(row);
          setIsDialogOpen(true);
        }}
      />

      <HistoryDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        historyItem={selectedMessage}
      />
    </>
  );
}
