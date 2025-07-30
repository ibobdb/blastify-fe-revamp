'use client';

import { useState, useEffect } from 'react';
import { apiManagementService } from '@/services/api-management.service';
import { DataTable } from '@/components/dashboard/datatable';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Copy, Edit, Trash2, KeyIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  isActive: boolean;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiKeyTableProps {
  onCreateNew: () => void;
  refreshTrigger?: number;
}

export function ApiKeyTable({ onCreateNew, refreshTrigger }: ApiKeyTableProps) {
  const [data, setData] = useState<ApiKey[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingApiKey, setDeletingApiKey] = useState<ApiKey | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  const handleDeleteApiKey = async (apiKey: ApiKey) => {
    setDeletingApiKey(apiKey);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingApiKey) return;

    try {
      await apiManagementService.deleteApiKey(deletingApiKey.id);
      toast.success('API key deleted successfully');
      fetchApiKeys(pagination.page);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete API key');
    } finally {
      setDeleteDialogOpen(false);
      setDeletingApiKey(null);
    }
  };

  const handleToggleStatus = async (apiKey: ApiKey) => {
    try {
      await apiManagementService.updateApiKey(apiKey.id, {
        isActive: !apiKey.isActive,
      });
      toast.success(
        `API key ${apiKey.isActive ? 'disabled' : 'enabled'} successfully`
      );
      fetchApiKeys(pagination.page);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update API key status');
    }
  };

  const columns: ColumnDef<ApiKey>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 150,
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      size: 100,
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge variant={isActive ? 'success' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'lastUsedAt',
      header: 'Last Used',
      size: 140,
      cell: ({ row }) => {
        const lastUsedAt = row.getValue('lastUsedAt') as string | null;
        if (!lastUsedAt)
          return <span className="text-muted-foreground">Never</span>;

        const date = new Date(lastUsedAt);
        return (
          <span className="text-xs">
            {date.toLocaleDateString()}{' '}
            {date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        );
      },
    },
    {
      accessorKey: 'expiresAt',
      header: 'Expires',
      size: 140,
      cell: ({ row }) => {
        const expiresAt = row.getValue('expiresAt') as string | null;
        if (!expiresAt)
          return <span className="text-muted-foreground">Never</span>;

        const date = new Date(expiresAt);
        const now = new Date();
        const isExpired = date < now;

        return (
          <div className="flex flex-col">
            <span className={`text-xs ${isExpired ? 'text-red-500' : ''}`}>
              {date.toLocaleDateString()}
            </span>
            {isExpired && (
              <Badge variant="destructive" className="text-xs w-fit">
                Expired
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      size: 140,
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string;
        const date = new Date(createdAt);
        return (
          <span className="text-xs">
            {date.toLocaleDateString()}{' '}
            {date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 50,
      cell: ({ row }) => {
        const apiKey = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => copyToClipboard(apiKey.id, 'API key ID')}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleToggleStatus(apiKey)}>
                <Edit className="mr-2 h-4 w-4" />
                {apiKey.isActive ? 'Disable' : 'Enable'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteApiKey(apiKey)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const fetchApiKeys = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await apiManagementService.getApiKeys(
        page,
        pagination.limit
      );
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, [refreshTrigger]);

  const handlePageChange = (page: number) => {
    fetchApiKeys(page);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        pagination={{
          pagination: pagination,
          onPageChange: handlePageChange,
          onPageSizeChange: (size: number) => {
            setPagination((prev) => ({ ...prev, limit: size }));
            fetchApiKeys(1);
          },
        }}
        loading={loading}
        title="API Keys"
        description="Manage your API keys for accessing the Blastify API"
        actionButtons={
          <Button
            onClick={onCreateNew}
            size={'sm'}
            className="ml-auto cursor-pointer h-8 px-2 text-xs"
          >
            <KeyIcon size={14} /> New Key
          </Button>
        }
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the API key "
              {deletingApiKey?.name}"? This action cannot be undone and will
              permanently revoke access for applications using this key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
