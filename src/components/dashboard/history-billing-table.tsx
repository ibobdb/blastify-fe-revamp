'use client';
import { billingService } from '@/services/billing.service';
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
import {
  ArrowUpDown,
  Eye,
  Copy,
  MoreHorizontal,
  DollarSign,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

type Transaction = {
  id: string;
  quotaId: string;
  orderId: string;
  amount: number;
  quotaAmount: number;
  status: string;
  paymentType: string | null;
  midtransId: string | null;
  paymentDetails: {
    bank: string;
    vaNumber: string;
  };
  paymentTime: string | null;
  paidAt: string | null;
  expiredAt: string;
  snapToken: string;
  snapRedirectUrl: string;
  createdAt: string;
  updatedAt: string;
};

export function HistoryBillingTable() {
  const [data, setData] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<Transaction>[] = [
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
      accessorKey: 'orderId',
      header: 'Order ID',
      size: 120,
      maxSize: 120,
      cell: ({ row }) => {
        const orderId = row.getValue('orderId') as string;
        return (
          <div className="w-28">
            <span
              className="font-mono text-muted-foreground text-xs truncate block"
              title={orderId}
            >
              {orderId}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="p-0 text-xs h-6"
        >
          Amount
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      size: 100,
      maxSize: 100,
      cell: ({ row }) => {
        const amount = row.getValue('amount') as number;
        return (
          <div className="flex items-center gap-1">
            <span className="text-green-600 text-xs font-semibold">RP</span>
            <span className="font-mono text-xs">
              {new Intl.NumberFormat('id-ID', {
                minimumFractionDigits: 0,
              }).format(amount)}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'quotaAmount',
      header: 'Quota',
      size: 80,
      maxSize: 80,
      cell: ({ row }) => {
        const quotaAmount = row.getValue('quotaAmount') as number;
        return (
          <Badge variant="outline" className="text-xs">
            {quotaAmount.toLocaleString()}
          </Badge>
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
              status === 'PAID' || status === 'SETTLEMENT'
                ? 'success'
                : status === 'PENDING'
                ? 'warning'
                : status === 'FAILED' || status === 'EXPIRED'
                ? 'destructive'
                : status === 'CANCELLED'
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
      accessorKey: 'paymentType',
      header: 'Payment Type',
      size: 140,
      maxSize: 140,
      cell: ({ row }) => {
        const paymentType = row.getValue('paymentType') as string | null;
        const paymentDetails = row.original.paymentDetails;

        if (!paymentType)
          return <span className="text-muted-foreground text-xs">Not Set</span>;

        const formatPaymentType = (type: string) => {
          const typeMap: { [key: string]: string } = {
            bank_transfer: 'Bank Transfer',
            credit_card: 'Credit Card',
            e_wallet: 'E-Wallet',
            virtual_account: 'Virtual Account',
            qris: 'QRIS',
            cash: 'Cash',
            other: 'Other',
          };
          return (
            typeMap[type.toLowerCase()] ||
            type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
          );
        };

        const getPaymentTypeVariant = (type: string) => {
          switch (type.toLowerCase()) {
            case 'bank_transfer':
            case 'virtual_account':
              return 'default';
            case 'credit_card':
              return 'secondary';
            case 'e_wallet':
            case 'qris':
              return 'outline';
            default:
              return 'outline';
          }
        };

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help space-y-1">
                  <Badge
                    variant={getPaymentTypeVariant(paymentType)}
                    className="text-xs font-medium"
                  >
                    {formatPaymentType(paymentType)}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium">
                    {formatPaymentType(paymentType)}
                  </p>
                  {paymentDetails?.bank && (
                    <p className="text-sm">Bank: {paymentDetails.bank}</p>
                  )}
                  {paymentDetails?.vaNumber && (
                    <p className="text-sm font-mono">
                      VA: {paymentDetails.vaNumber}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: 'paidAt',
      header: 'Paid At',
      size: 140,
      maxSize: 140,
      cell: ({ row }) => {
        const paidAt = row.getValue('paidAt') as string | null;
        const date = paidAt ? new Date(paidAt) : null;
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
      accessorKey: 'expiredAt',
      header: 'Expires At',
      size: 140,
      maxSize: 140,
      cell: ({ row }) => {
        const expiredAt = row.getValue('expiredAt') as string;
        const date = new Date(expiredAt);
        const now = new Date();
        const isExpired = date < now;

        return (
          <span className={`text-xs ${isExpired ? 'text-red-500' : ''}`}>
            {date.toLocaleDateString() +
              ' ' +
              date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
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
        const createdAt = row.getValue('createdAt') as string;
        const date = new Date(createdAt);
        return (
          <span className="text-xs">
            {date.toLocaleDateString() +
              ' ' +
              date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
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
        const transaction = row.original;

        const handleCopyOrderId = () => {
          navigator.clipboard.writeText(transaction.orderId);
          toast.success('Order ID copied to clipboard');
        };

        const handleCopyTransactionId = () => {
          navigator.clipboard.writeText(transaction.id);
          toast.success('Transaction ID copied to clipboard');
        };

        const handleCopyVANumber = () => {
          if (transaction.paymentDetails?.vaNumber) {
            navigator.clipboard.writeText(transaction.paymentDetails.vaNumber);
            toast.success('VA Number copied to clipboard');
          }
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
              <DropdownMenuItem
                onClick={handleCopyTransactionId}
                className="text-xs"
              >
                Copy Transaction ID
                <Copy className="ml-2 h-3 w-3" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyOrderId} className="text-xs">
                Copy Order ID
                <Copy className="ml-2 h-3 w-3" />
              </DropdownMenuItem>
              {transaction.paymentDetails?.vaNumber && (
                <DropdownMenuItem
                  onClick={handleCopyVANumber}
                  className="text-xs"
                >
                  Copy VA Number
                  <Copy className="ml-2 h-3 w-3" />
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleFetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await billingService.getTransactions({});

      if (response.status) {
        const transactions = response.data;
        setAllTransactions(transactions);

        // Client-side pagination
        const totalCount = transactions.length;
        const totalPages = Math.ceil(totalCount / pagination.limit);

        updatePaginatedData(transactions, pagination.page, pagination.limit);

        setPagination((prev) => ({
          ...prev,
          totalCount,
          totalPages,
          hasNextPage: pagination.page < totalPages,
          hasPreviousPage: pagination.page > 1,
        }));
      } else {
        toast.error(response.message || 'Failed to fetch billing history');
        setData([]);
        setAllTransactions([]);
      }
    } catch (error) {
      toast.error('Error fetching billing history');
      setData([]);
      setAllTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const updatePaginatedData = (
    transactions: Transaction[],
    page: number,
    limit: number
  ) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = transactions.slice(startIndex, endIndex);
    setData(paginatedData);
  };

  useEffect(() => {
    if (allTransactions.length > 0) {
      updatePaginatedData(allTransactions, pagination.page, pagination.limit);
      const totalPages = Math.ceil(allTransactions.length / pagination.limit);
      setPagination((prev) => ({
        ...prev,
        totalPages,
        hasNextPage: pagination.page < totalPages,
        hasPreviousPage: pagination.page > 1,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    handleFetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
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
          onRefresh={() => handleFetchTransactions()}
          title="Billing History"
          description="View your payment transactions and quota purchases. Track payment status and transaction details."
        />
      </div>
    </div>
  );
}
