import { FlashList, type FlashListProps } from "@shopify/flash-list";
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { JSX } from "react";
import * as React from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
} from "react-native";
import { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StyledAnimatedView } from "../lib/styled";
import { cn } from "../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowPress?: (row: Row<TData>) => void;
  estimatedItemSize?: number;
  ListEmptyComponent?: React.ComponentType<unknown> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<unknown> | React.ReactElement | null;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

/**
 * @docs https://tanstack.com/table
 */

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowPress,
  estimatedItemSize = 45,
  ListEmptyComponent,
  ListFooterComponent,
  isRefreshing = false,
  onRefresh,
}: DataTableProps<TData, TValue>): JSX.Element {
  const insets = useSafeAreaInsets();
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

  return (
    <>
      {isRefreshing && (
        <StyledAnimatedView
          entering={FadeInUp}
          exiting={FadeOutUp}
          className="h-14 top-16 absolute items-center justify-center w-screen"
        >
          <ActivityIndicator size="small" />
        </StyledAnimatedView>
      )}
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: getColumnWidth(header.getSize(), columns.length),
                      }}
                    >
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
            <FlashList<Row<TData>>
              {...({
                data: table.getRowModel().rows,
                estimatedItemSize,
                ListEmptyComponent,
                ListFooterComponent,
                showsVerticalScrollIndicator: false,
                contentContainerStyle: {
                  paddingBottom: insets.bottom,
                },
                refreshControl: (
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    style={{ opacity: 0 }}
                  />
                ),
                renderItem: ({ item: row, index }: { item: Row<TData>; index: number }): JSX.Element => {
                  const rowClassName = cn(
                    "active:opacity-70",
                    index % 2 && "bg-zinc-100/50 dark:bg-zinc-900/50",
                  );
                  const handlePress = onRowPress
                    ? (): void => {
                        onRowPress(row);
                      }
                    : undefined;
                  return (
                    <TableRow
                      className={rowClassName}
                      onPress={handlePress}
                    >
                      {row.getVisibleCells().map((cell): JSX.Element => (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: getColumnWidth(
                              cell.column.getSize(),
                              columns.length,
                            ),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any)}
            />
          </TableBody>
        </Table>
      </ScrollView>
    </>
  );
}

const { width } = Dimensions.get("window");

function getColumnWidth(size: number, length: number): number {
  const evenWidth = width / length;
  return evenWidth > size ? evenWidth : size;
}
