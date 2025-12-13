import { FlashList } from "@shopify/flash-list";
import type { FlashListProps, ListRenderItemInfo } from "@shopify/flash-list";
import type { Row, SortingState } from "@tanstack/react-table";
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
  Text as RNText,
} from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// Import ALL types from web version (web is source of truth)
import type { DataTableProps } from "@/packages/next-vibe-ui/web/ui/data-table";

// Re-export types for consistency
export type { DataTableProps };

// Styled components for NativeWind support
const StyledAnimatedView = styled(Animated.View, { className: "style" });

// Helper to wrap flexRender output in Text if it's a string or number
function wrapInTextIfNeeded(content: React.ReactNode): React.ReactNode {
  if (typeof content === "string" || typeof content === "number") {
    return <RNText>{content}</RNText>;
  }
  return content;
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
  isRefreshing = false,
  onRefresh,
}: DataTableProps<TData, TValue>): JSX.Element {
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

  const HeaderComponent = (): React.ReactElement => (
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
                      : wrapInTextIfNeeded(
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          ),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
      </Table>
    </ScrollView>
  );

  const EmptyComponent = (): React.ReactElement => (
    <ScrollView
      horizontal
      bounces={false}
      showsHorizontalScrollIndicator={false}
    >
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              style={{
                width: width,
              }}
            >
              {ListEmptyComponent ? (
                React.isValidElement(ListEmptyComponent) ? (
                  ListEmptyComponent
                ) : (
                  <ListEmptyComponent />
                )
              ) : null}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </ScrollView>
  );

  const FooterComponent = (): React.ReactElement | null => {
    if (!ListFooterComponent || hasNoData) {
      return null;
    }
    return React.isValidElement(ListFooterComponent) ? (
      ListFooterComponent
    ) : (
      <ListFooterComponent />
    );
  };

  const renderItem = (
    info: ListRenderItemInfo<Row<TData>>,
  ): React.ReactElement => {
    const { item: row, index } = info;
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
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        <Table>
          <TableBody>
            <TableRow className={rowClassName} onClick={handlePress}>
              {row.getVisibleCells().map(
                (cell): React.ReactElement => (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: getColumnWidth(
                        cell.column.getSize(),
                        columns.length,
                      ),
                    }}
                  >
                    {wrapInTextIfNeeded(
                      flexRender(cell.column.columnDef.cell, cell.getContext()),
                    )}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableBody>
        </Table>
      </ScrollView>
    );
  };

  const refreshControlElement = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      style={{ opacity: 0 }}
    />
  );

  const flashListProps: FlashListProps<Row<TData>> = {
    data: rows,
    ListHeaderComponent: HeaderComponent,
    ListEmptyComponent: hasNoData ? EmptyComponent : null,
    ListFooterComponent: FooterComponent,
    showsVerticalScrollIndicator: false,
    refreshControl: refreshControlElement,
    renderItem,
  };

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
      <FlashList<Row<TData>> {...flashListProps} />
    </>
  );
}

const { width } = Dimensions.get("window");

function getColumnWidth(size: number, length: number): number {
  const evenWidth = width / length;
  return evenWidth > size ? evenWidth : size;
}
