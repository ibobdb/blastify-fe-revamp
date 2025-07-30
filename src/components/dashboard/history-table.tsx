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
import { ArrowUpDown, Eye, Copy, MoreHorizontal, Info } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const StatusLegend = () => {
  const statusItems = [
    { label: 'Sent', color: 'bg-blue-500', variant: 'info' as const },
    { label: 'Delivered', color: 'bg-green-500', variant: 'success' as const },
    { label: 'Read', color: 'bg-green-600', variant: 'success' as const },
    { label: 'Failed', color: 'bg-red-500', variant: 'destructive' as const },
  ];

  return (
    <div className="flex items-center gap-4 mb-4 p-3 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-4">
        {statusItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

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
      accessorKey: 'number',
      header: 'Phone Number',
      size: 140,
      maxSize: 140,
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue('number')}</span>
      ),
    },
    {
      accessorKey: 'content',
      header: 'Message',
      size: 200,
      maxSize: 250,
      cell: ({ row }) => {
        const content = row.getValue('content') as string;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="max-w-[180px] cursor-help">
                  <span className="truncate block text-xs">{content}</span>
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
      size: 100,
      maxSize: 100,
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
            className="text-xs"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'ackStatus',
      header: 'Delivery Status',
      size: 120,
      maxSize: 120,
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

        return (
          <Badge variant={variant} className="text-xs">
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'source',
      header: 'Source',
      size: 80,
      maxSize: 80,
      cell: ({ row }) => {
        const source = row.getValue('source') as string;
        const variant =
          source === 'WEB' ? 'info' : source === 'API' ? 'outline' : 'default';
        return (
          <Badge variant={variant} className="text-xs">
            {source}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'scheduleDate',
      header: 'Schedule Date',
      size: 140,
      maxSize: 140,
      enableHiding: true,
      cell: ({ row }) => {
        const value = row.getValue('scheduleDate');
        const date = value ? new Date(value as string) : null;
        return (
          <span className="text-xs">
            {date && !isNaN(date.getTime())
              ? date.toLocaleDateString() +
                ' ' +
                date.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-'}
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
          className="p-0 text-xs h-6"
        >
          Created At
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      size: 140,
      maxSize: 140,
      cell: ({ row }) => {
        const value = row.getValue('createdAt');
        const date = value ? new Date(value as string) : null;
        return (
          <span className="text-xs">
            {date && !isNaN(date.getTime())
              ? date.toLocaleDateString() +
                ' ' +
                date.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-'}
          </span>
        );
      },
      enableSorting: true,
    },

    {
      id: 'actions',
      enableHiding: false,
      size: 50,
      maxSize: 50,
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
              <Button variant="ghost" className="h-6 w-6 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleViewDetails} className="text-xs">
                View Details
                <Eye className="ml-2 h-3 w-3" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyId} className="text-xs">
                Copy Message ID
                <Copy className="ml-2 h-3 w-3" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyNumber} className="text-xs">
                Copy Phone Number
                <Copy className="ml-2 h-3 w-3" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyContent} className="text-xs">
                Copy Message
                <Copy className="ml-2 h-3 w-3" />
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
        toast.error(response.message || 'Failed to fetch history');
      }
    } catch (error) {
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
        return 'Sent';
      case '3':
        return 'Read';
      case '4':
        return 'Played';
      default:
        return status;
    }
  };

  return (
    <div className="h-full flex flex-col">
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
    </div>
  );
}
