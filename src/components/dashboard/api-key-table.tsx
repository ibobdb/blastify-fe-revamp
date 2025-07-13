'use client';

import { useState, useEffect } from 'react';
import { apiManagementService } from '@/services/api-management.service';
import { DataTable } from '@/components/dashboard/datatable';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Copy, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
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
import { PasswordValidationDialog } from '@/components/dashboard/password-validation-dialog';

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
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // Password validation states
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'view' | 'copy-key' | 'copy-id';
    data: { keyId: string; key?: string; label?: string };
  } | null>(null);

  const toggleKeyVisibility = (keyId: string) => {
    setPendingAction({
      type: 'view',
      data: { keyId },
    });
    setPasswordDialogOpen(true);
  };

  const handlePasswordValidated = () => {
    if (!pendingAction) return;

    switch (pendingAction.type) {
      case 'view':
        setVisibleKeys((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(pendingAction.data.keyId)) {
            newSet.delete(pendingAction.data.keyId);
          } else {
            newSet.add(pendingAction.data.keyId);
          }
          return newSet;
        });
        break;
      case 'copy-key':
      case 'copy-id':
        if (pendingAction.data.key && pendingAction.data.label) {
          executeClipboardCopy(
            pendingAction.data.key,
            pendingAction.data.label
          );
        }
        break;
    }

    setPendingAction(null);
  };

  const executeClipboardCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  const requestPasswordForCopy = (text: string, label: string) => {
    setPendingAction({
      type: label === 'API key' ? 'copy-key' : 'copy-id',
      data: { keyId: '', key: text, label },
    });
    setPasswordDialogOpen(true);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    // This function is kept for backward compatibility but now redirects to password validation
    requestPasswordForCopy(text, label);
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
      accessorKey: 'key',
      header: 'API Key',
      size: 300,
      cell: ({ row }) => {
        const apiKey = row.original;
        const isVisible = visibleKeys.has(apiKey.id);
        const displayKey = isVisible ? apiKey.key : maskApiKey(apiKey.key);

        return (
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted px-2 py-1 rounded font-mono max-w-[200px] truncate">
              {displayKey}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => toggleKeyVisibility(apiKey.id)}
            >
              {isVisible ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => copyToClipboard(apiKey.key, 'API key')}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        );
      },
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
              <DropdownMenuItem
                onClick={() => copyToClipboard(apiKey.key, 'API key')}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Key
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">API Keys</h2>
          <p className="text-muted-foreground">
            Manage your API keys for accessing the Blastify API
          </p>
        </div>
        <Button onClick={onCreateNew}>Create New API Key</Button>
      </div>

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

      <PasswordValidationDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onValidated={handlePasswordValidated}
        title="Confirm Password"
        description="Please enter your password to perform this sensitive action."
        actionLabel="Confirm"
      />
    </div>
  );
}
