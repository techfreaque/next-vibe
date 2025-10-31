"use client";

import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "next-vibe/shared/utils/utils";
import type { ReactElement } from "react";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// Cross-platform base props interface
export interface DataTableProps<TData, TValue = string> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowPress?: (row: Row<TData>) => void;
  estimatedItemSize?: number;
  ListEmptyComponent?: React.ComponentType | ReactElement | null;
  ListFooterComponent?: React.ComponentType | ReactElement | null;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
}

/**
 * @docs https://tanstack.com/table
 */
export function DataTable<TData, TValue = string>({
  columns,
  data,
  onRowPress,
  ListEmptyComponent,
  ListFooterComponent,
  className,
}: DataTableProps<TData, TValue>): ReactElement {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const rows = table.getRowModel().rows;
  const hasNoData = rows.length === 0;

  return (
    <div className={cn("relative w-full", className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {hasNoData ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {ListEmptyComponent ? (
                  React.isValidElement(ListEmptyComponent) ? (
                    ListEmptyComponent
                  ) : (
                    <ListEmptyComponent />
                  )
                ) : (
                  "No results."
                )}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onPress={
                  onRowPress
                    ? (): void => {
                        onRowPress(row);
                      }
                    : undefined
                }
                className={cn(index % 2 && "bg-muted/50")}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {ListFooterComponent &&
        !hasNoData &&
        (React.isValidElement(ListFooterComponent) ? (
          ListFooterComponent
        ) : (
          <ListFooterComponent />
        ))}
    </div>
  );
}
