import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Box, Text } from "ink";
import type { JSX } from "react";
import * as React from "react";

import type { DataTableProps } from "../../web/ui/data-table";
import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

export type { DataTableProps } from "../../web/ui/data-table";

const SEPARATOR = "\u2500".repeat(60);
const CELL_DIVIDER = " | ";
const NO_RESULTS = "No results.";

export function DataTable<TData, TValue = string>({
  columns,
  data,
  onRowPress,
  ListEmptyComponent,
  ListFooterComponent,
  className,
  style,
}: DataTableProps<TData, TValue>): JSX.Element {
  void className;
  void style;
  void onRowPress; // not interactive in terminal

  const isMcp = useIsMcp();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;
  const hasNoData = rows.length === 0;

  if (hasNoData) {
    if (ListEmptyComponent) {
      if (React.isValidElement(ListEmptyComponent)) {
        return <Box>{ListEmptyComponent}</Box>;
      }
      const EmptyComp = ListEmptyComponent as React.ComponentType;
      return (
        <Box>
          <EmptyComp />
        </Box>
      );
    }
    return (
      <Box>
        <Text dimColor>{NO_RESULTS}</Text>
      </Box>
    );
  }

  const headerGroups = table.getHeaderGroups();

  const renderSeparator = (): JSX.Element => (
    <Box>
      <Text dimColor>{SEPARATOR}</Text>
    </Box>
  );

  const renderHeaderRow = (): JSX.Element => {
    return (
      <Box flexDirection="column">
        {headerGroups.map((headerGroup) => {
          if (isMcp) {
            const cells: React.ReactNode[] = [];
            headerGroup.headers.forEach((header, i) => {
              if (i > 0) {
                cells.push(
                  <Text key={`sep-${header.id}`}>{CELL_DIVIDER}</Text>,
                );
              }
              cells.push(
                <Text key={header.id} bold>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </Text>,
              );
            });
            return (
              <Box key={headerGroup.id} flexDirection="row">
                {cells}
              </Box>
            );
          }

          return (
            <Box key={headerGroup.id} flexDirection="column">
              <Box flexDirection="row" gap={2}>
                {headerGroup.headers.map((header) => (
                  <Text key={header.id} bold>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Text>
                ))}
              </Box>
              {renderSeparator()}
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderDataRows = (): JSX.Element => (
    <Box flexDirection="column">
      {rows.map((row, rowIndex) => {
        const cells = row.getVisibleCells();
        if (isMcp) {
          const mcpCells: React.ReactNode[] = [];
          cells.forEach((cell, i) => {
            if (i > 0) {
              mcpCells.push(<Text key={`sep-${cell.id}`}>{CELL_DIVIDER}</Text>);
            }
            mcpCells.push(
              <Text key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Text>,
            );
          });
          return (
            <Box key={row.id} flexDirection="row">
              {mcpCells}
            </Box>
          );
        }

        const isLast = rowIndex === rows.length - 1;
        return (
          <Box key={row.id} flexDirection="column">
            <Box flexDirection="row" gap={2}>
              {cells.map((cell) => (
                <Text key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Text>
              ))}
            </Box>
            {!isLast && renderSeparator()}
          </Box>
        );
      })}
    </Box>
  );

  const footer = (): JSX.Element | null => {
    if (!ListFooterComponent) {
      return null;
    }
    if (React.isValidElement(ListFooterComponent)) {
      return <Box>{ListFooterComponent}</Box>;
    }
    const FooterComp = ListFooterComponent as React.ComponentType;
    return (
      <Box>
        <FooterComp />
      </Box>
    );
  };

  return (
    <Box flexDirection="column">
      {renderHeaderRow()}
      {renderDataRows()}
      {footer()}
    </Box>
  );
}
