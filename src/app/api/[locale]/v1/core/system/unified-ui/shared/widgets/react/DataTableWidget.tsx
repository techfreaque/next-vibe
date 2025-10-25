/**
 * Data Table Widget
 * Renders tabular data with sorting, filtering, and pagination
 */

"use client";

import type { FC } from "react";
import { useState } from "react";

import type { DataTableWidgetData, WidgetComponentProps } from "../types";

/**
 * Data Table Widget Component
 */
export const DataTableWidget: FC<WidgetComponentProps<DataTableWidgetData>> = ({
  data,
  className = "",
}) => {
  const [sortBy, setSortBy] = useState<string | null>(data.sortBy ?? null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    data.sortOrder ?? "asc",
  );

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
  const sortedRows = [...data.rows].sort((a, b) => {
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
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {data.columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-${column.align ?? "left"} text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 ${
                  column.sortable
                    ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    : ""
                }`}
                style={{ width: column.width }}
                onClick={() => {
                  if (column.sortable) {
                    handleSort(column.key);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortBy === column.key && (
                    <span className="text-blue-500">
                      {/* eslint-disable-next-line i18next/no-literal-string */}
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
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
              {data.columns.map((column) => {
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

      {data.totalRows !== undefined && data.totalRows > data.rows.length && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
          {/* eslint-disable-next-line i18next/no-literal-string */}
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {data.rows.length} of {data.totalRows} results
          </div>
        </div>
      )}
    </div>
  );
};
