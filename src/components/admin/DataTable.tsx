'use client';
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Loader2, Search } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface Column<T> {
  key: string;                // data key or synthetic id
  header: string;             // column header label
  width?: string;             // optional fixed width
  sortable?: boolean;         // allow sorting
  render?: (row: T) => React.ReactNode; // custom cell render
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableMeta {
  page: number;
  page_size: number;
  total: number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  // server meta for pagination
  meta?: DataTableMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  // sorting
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSortChange?: (key: string, dir: 'asc' | 'desc' | undefined) => void;
  // search
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (value: string) => void;
  // row click
  onRowClick?: (row: T) => void;
  // empty state
  emptyText?: string;
  // accessibility
  ariaLabel?: string;
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  rows,
  loading = false,
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  sortKey,
  sortDir,
  onSortChange,
  searchable = true,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearch,
  onRowClick,
  emptyText = 'No data',
  ariaLabel = 'Data table'
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState('');

  const controlledSearch = searchValue !== undefined;
  const currentSearch = controlledSearch ? searchValue : internalSearch;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (controlledSearch) {
      onSearch?.(val);
    } else {
      setInternalSearch(val);
      onSearch?.(val);
    }
  };

  const totalPages = useMemo(() => {
    if (!meta) return 1;
    return Math.max(1, Math.ceil(meta.total / meta.page_size));
  }, [meta]);

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    let nextDir: 'asc' | 'desc' | undefined = 'asc';
    if (sortKey === col.key) {
      if (sortDir === 'asc') nextDir = 'desc';
      else if (sortDir === 'desc') nextDir = undefined; // remove sort
      else nextDir = 'asc';
    }
    onSortChange?.(col.key, nextDir);
  };

  const page = meta?.page || 1;
  const pageSize = meta?.page_size || rows.length || 10;

  return (
    <div className="w-full border rounded-lg bg-white shadow-sm">
      {searchable && (
        <div className="p-3 border-b bg-gray-50 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={currentSearch}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              aria-label="Search table"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label={ariaLabel}>
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    'px-4 py-2 font-medium text-left select-none',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer hover:bg-gray-200'
                  )}
                  onClick={() => handleSort(col)}
                  scope="col"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <ArrowUpDown
                        className={cn(
                          'w-3 h-3 opacity-40',
                          sortKey === col.key && 'opacity-100 text-green-600'
                        )}
                      />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                  {emptyText}
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                  </div>
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row, idx) => (
                <tr
                  key={(row as any).id || idx}
                  className={cn(
                    'border-t hover:bg-gray-50',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-2 align-middle text-gray-800',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        col.className
                      )}
                    >
                      {col.render ? col.render(row) : (row as any)[col.key] ?? ''}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-gray-50 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {pageSizeOptions.map(sz => (
              <option key={sz} value={sz}>{sz}</option>
            ))}
          </select>
        </div>
        <div className="text-gray-600">
          {meta && (
            <span>
              Page {page} of {totalPages} • {meta.total} total
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded disabled:opacity-40 hover:bg-gray-200"
            onClick={() => onPageChange?.(1)}
            disabled={page <= 1}
            aria-label="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded disabled:opacity-40 hover:bg-gray-200"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded disabled:opacity-40 hover:bg-gray-200"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded disabled:opacity-40 hover:bg-gray-200"
            onClick={() => onPageChange?.(totalPages)}
            disabled={page >= totalPages}
            aria-label="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
