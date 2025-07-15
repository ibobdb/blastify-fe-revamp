'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  RefreshCw,
  Loader2Icon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination as UiPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface DataTablePaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: DataTablePaginationProps;
  loading?: boolean;
  actionButtons?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onRefresh,
  loading = false,
  onSearch,
  onRowClick,
  actionButtons,
}: DataTableProps<TData, TValue> & {
  onRefresh?: () => void;
  onSearch?: (value: string) => void;
  onRowClick?: (row: TData) => void;
  title?: string;
  description?: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchValue, setSearchValue] = React.useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Table instance (no client-side pagination)
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    pageCount: pagination.pagination.totalPages,
  });
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };
  return (
    <div className="w-full">
      <div className="flex justify-between py-4 gap-2">
        <form onSubmit={handleSearchSubmit} className="">
          <Input
            ref={inputRef}
            placeholder="Search..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="min-w-md h-8 bg-white dark:bg-gray-800 text-sm"
          />
        </form>
        <Button
          variant="outline"
          size={'sm'}
          className="ml-auto cursor-pointer h-8 px-2 text-xs"
          onClick={onRefresh}
          aria-label="Refresh"
          disabled={loading}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
        {actionButtons && (
          <div className="flex items-center gap-2">{actionButtons}</div>
        )}
      </div>

      <div className="rounded-md border relative min-h-[200px] max-h-[600px] overflow-auto">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-background z-1">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="border-b bg-background h-8 px-2 py-1 text-xs font-medium whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody
              className={
                loading ? 'opacity-20 pointer-events-none' : 'bg-white'
              }
            >
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => onRowClick?.(row.original)}
                    className={`h-8 ${
                      onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''
                    }`}
                  >
                    {' '}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-2 py-1 text-xs whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-16 text-center text-xs"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <UiPagination className="mt-2">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.pagination.hasPreviousPage && !loading) {
                  pagination.onPageChange(pagination.pagination.page - 2);
                }
              }}
              aria-disabled={!pagination.pagination.hasPreviousPage || loading}
            />
          </PaginationItem>
          {/* Page numbers logic */}
          {Array.from(
            { length: pagination.pagination.totalPages },
            (_, i) => i + 1
          )
            .filter((pageNum) => {
              // Show first, last, current, and neighbors; ellipsis for gaps
              const current = pagination.pagination.page;
              if (pageNum === 1 || pageNum === pagination.pagination.totalPages)
                return true;
              if (Math.abs(pageNum - current) <= 1) return true;
              return false;
            })
            .map((pageNum, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && pageNum - prev > 1;
              return (
                <React.Fragment key={pageNum}>
                  {showEllipsis && (
                    <PaginationItem key={`ellipsis-${pageNum}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={pagination.pagination.page === pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          !loading &&
                          pagination.pagination.page !== pageNum
                        ) {
                          pagination.onPageChange(pageNum - 1);
                        }
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                </React.Fragment>
              );
            })}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.pagination.hasNextPage && !loading) {
                  pagination.onPageChange(pagination.pagination.page);
                }
              }}
              aria-disabled={!pagination.pagination.hasNextPage || loading}
            />
          </PaginationItem>
          {/* <select
            className="border rounded px-1 py-0 text-xs ml-2"
            value={pagination.pagination.limit}
            onChange={(e) => {
              pagination.onPageSizeChange(Number(e.target.value));
            }}
            disabled={loading}
          >
            {[2, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}/page
              </option>
            ))}
          </select> */}
        </PaginationContent>
      </UiPagination>
    </div>
  );
}
