"use client";

import { flexRender, useTable } from "@tanstack/react-table";
import {
  columnSizingFeature,
  columnVisibilityFeature,
  createCoreRowModel,
  createSortedRowModel,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  type ColumnDef,
  type Row,
  type RowData,
  type SortingState,
} from "@tanstack/table-core";
import type { ReactElement } from "react";
import * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { StyleType } from "../utils/style-type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export const tableConfig = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  sortedRowModel: createSortedRowModel(),
  coreRowModel: createCoreRowModel(),
});

type AppFeatures = typeof tableConfig;

export type AppColumnDef<TData extends RowData> = ColumnDef<AppFeatures, TData>;
export type AppRow<TData extends RowData> = Row<AppFeatures, TData>;

export type DataTableProps<TData extends RowData> = {
  columns: AppColumnDef<TData>[];
  data: TData[];
  onRowPress?: (row: AppRow<TData>) => void;
  estimatedItemSize?: number;
  ListEmptyComponent?: React.ComponentType | ReactElement | null;
  ListFooterComponent?: React.ComponentType | ReactElement | null;
  isRefreshing?: boolean;
  onRefresh?: () => void;
} & StyleType;

/**
 * @docs https://tanstack.com/table
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  onRowPress,
  ListEmptyComponent,
  ListFooterComponent,
  className,
  style,
}: DataTableProps<TData>): ReactElement {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useTable({
    features: tableConfig,
    data,
    columns,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const rows = table.getRowModel().rows;
  const hasNoData = rows.length === 0;

  return (
    <div className={cn("relative w-full", className)} style={style}>
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
                onClick={
                  onRowPress
                    ? (): void => {
                        onRowPress(row);
                      }
                    : undefined
                }
                className={cn(index % 2 && "bg-accent")}
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
