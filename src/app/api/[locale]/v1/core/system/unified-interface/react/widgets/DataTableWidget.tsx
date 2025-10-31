/**
 * Data Table Widget
 * Renders tabular data with sorting, filtering, and pagination
 */

"use client";

import { Div } from "@/packages/next-vibe-ui/web/ui/div";
import { Span } from "@/packages/next-vibe-ui/web/ui/span";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { simpleT } from "@/i18n/core/shared";

import type {
  DataTableWidgetData,
  RenderableValue,
  WidgetComponentProps,
} from "../types";

/**
 * Type guard for DataTableWidgetData
 */
function isDataTableWidgetData(
  data: RenderableValue | DataTableWidgetData,
): data is DataTableWidgetData {
  if (
    typeof data === "object" &&
    data !== null &&
    !Array.isArray(data) &&
    "rows" in data &&
    Array.isArray(data.rows) &&
    "columns" in data &&
    Array.isArray(data.columns)
  ) {
    return true;
  }
  return false;
}

/**
 * Data Table Widget Component
 */
export const DataTableWidget = ({
  data,
  metadata: _metadata,
  context,
  className = "",
  style,
}: WidgetComponentProps<RenderableValue>): JSX.Element => {
  const { t } = simpleT(context.locale);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const isValidData = isDataTableWidgetData(data);
  const typedData = isValidData ? data : null;

  useEffect(() => {
    if (typedData) {
      setSortBy(typedData.sortBy ?? null);
      setSortOrder(typedData.sortOrder ?? "asc");
    }
  }, [typedData]);

  if (!isValidData || !typedData) {
    return <Div className={className} style={style}>—</Div>;
  }

  // Handle column sort
  const handleSort = (columnKey: string): void => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnKey);
      setSortOrder("asc");
    }
  };

  // Sort rows
  const sortedRows = typedData.rows.toSorted((a, b) => {
    if (!sortBy) {
      return 0;
    }

    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal === bVal) {
      return 0;
    }
    if (aVal === null || aVal === undefined) {
      return 1;
    }
    if (bVal === null || bVal === undefined) {
      return -1;
    }

    const comparison = aVal < bVal ? -1 : 1;
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <Div className={`overflow-x-auto ${className}`} style={style}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {typedData.columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-${column.align ?? "left"} text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
                  column.sortable
                    ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    : ""
                }`}
                style={{ width: column.width }}
                onClick={(): void => {
                  if (column.sortable) {
                    handleSort(column.key);
                  }
                }}
                onKeyDown={(e): void => {
                  if (column.sortable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    handleSort(column.key);
                  }
                }}
                role={column.sortable ? "button" : undefined}
                tabIndex={column.sortable ? 0 : undefined}
                aria-sort={
                  column.sortable && sortBy === column.key
                    ? sortOrder === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <Div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortBy === column.key && (
                    <Span className="text-blue-500">
                      {/* eslint-disable-next-line i18next/no-literal-string */}
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </Span>
                  )}
                </Div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {sortedRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {typedData.columns.map((column) => {
                const value = row[column.key];
                const formattedValue = column.format
                  ? column.format(value)
                  : typeof value === "object" && value !== null
                    ? JSON.stringify(value)
                    : String(value ?? "");

                return (
                  <td
                    key={column.key}
                    className={`whitespace-nowrap px-6 py-4 text-sm text-${column.align ?? "left"} text-gray-900 dark:text-gray-100`}
                  >
                    {formattedValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {typedData.totalRows !== undefined &&
        typedData.totalRows > typedData.rows.length && (
          <Div className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
            <Div className="text-sm text-gray-700 dark:text-gray-300">
              {t("app.api.v1.core.system.unifiedInterface.react.widgets.dataTable.showing")}{" "}
              {typedData.rows.length}{" "}
              {t("app.api.v1.core.system.unifiedInterface.react.widgets.dataTable.of")}{" "}
              {typedData.totalRows}{" "}
              {t("app.api.v1.core.system.unifiedInterface.react.widgets.dataTable.results")}
            </Div>
          </Div>
        )}
    </Div>
  );
};
