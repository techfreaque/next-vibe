"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe-ui/ui/table";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { WidgetType } from "../../../shared/types/enums";
import { extractDataTableData, formatCellValue } from "../../../shared/widgets/logic/data-table";
import type { ReactWidgetProps } from "../../../shared/widgets/types";
import {
  extractColumnConfig,
  extractTableSortConfig,
  sortTableRows,
} from "../../../shared/widgets/utils/widget-helpers";

/**
 * Renders sortable data table with column headers.
 */
export const DataTableWidget = <const TKey extends string>({
  value,
  field,
  context,
  className = "",
  form,
}: ReactWidgetProps<typeof WidgetType.DATA_TABLE, TKey>): JSX.Element => {
  const hasRequestUsage = field.usage && "request" in field.usage;

  if (hasRequestUsage && form) {
    // TODO: Implement column selector UI
  }
  const { t } = simpleT(context.locale);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const data = extractDataTableData(value);
  const sortConfig = extractTableSortConfig(value);

  useEffect(() => {
    setSortBy(sortConfig.sortBy);
    setSortOrder(sortConfig.sortOrder);
  }, [sortConfig.sortBy, sortConfig.sortOrder]);

  if (!data) {
    return <Div className={className}>—</Div>;
  }

  const { rows, columns } = data;

  const handleSort = (columnKey: string): void => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnKey);
      setSortOrder("asc");
    }
  };

  const sortedRows = sortTableRows(rows, sortBy, sortOrder);

  return (
    <Div className={`overflow-x-auto ${className}`}>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            {columns.map((column) => {
              const key = column.key;
              const label = column.label;

              const columnConfig = extractColumnConfig(value, key);
              const { align, sortable, width } = columnConfig;

              return (
                <TableHead
                  key={key}
                  className={`px-6 py-3 ${align} text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 ${
                    sortable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : ""
                  }`}
                  width={width}
                  onClick={(): void => {
                    if (sortable) {
                      handleSort(key);
                    }
                  }}
                  onKeyDown={(e): void => {
                    if (sortable && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      handleSort(key);
                    }
                  }}
                  role={sortable ? "button" : undefined}
                  tabIndex={sortable ? 0 : undefined}
                  aria-sort={
                    sortable && sortBy === key
                      ? sortOrder === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <Div className="flex items-center gap-2">
                    {label}
                    {sortable && sortBy === key && (
                      <Span className="text-blue-500">
                        {/* eslint-disable-next-line i18next/no-literal-string */}
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </Span>
                    )}
                  </Div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {sortedRows.map((row, rowIndex: number) => {
            return (
              <TableRow key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {columns.map((column) => {
                  const key = column.key;

                  const columnConfig = extractColumnConfig(value, key);
                  const { align, format } = columnConfig;

                  const cellValue = row[key];
                  const formattedValue = format
                    ? String(format(cellValue))
                    : formatCellValue(cellValue);

                  return (
                    <TableCell
                      key={key}
                      className={`whitespace-nowrap px-6 py-4 text-sm text-${align} text-gray-900 dark:text-gray-100`}
                    >
                      {formattedValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {sortConfig.totalRows !== undefined && sortConfig.totalRows > rows.length && (
        <Div className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
          <Div className="text-sm text-gray-700 dark:text-gray-300">
            {t("app.api.system.unifiedInterface.react.widgets.dataTable.showingResults", {
              count: rows.length,
              total: sortConfig.totalRows,
            })}
          </Div>
        </Div>
      )}
    </Div>
  );
};
