"use client";

import { cn } from "next-vibe/shared/utils";
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
import { useState } from "react";

import { simpleT } from "@/i18n/core/shared";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import { MultiWidgetRenderer } from "../../../renderers/react/MultiWidgetRenderer";
import { getFieldLabel } from "../../_shared/field-helpers";
import type { ReactWidgetProps } from "../../_shared/react-types";
import { hasChild } from "../../_shared/type-guards";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import {
  useWidgetLocale,
  useWidgetTranslation,
} from "../../_shared/use-widget-context";
import type { DataTableWidgetConfig } from "./types";

/**
 * Data Table Widget - Displays array data in sortable table format
 *
 * Renders arrays of objects as a table with sortable columns. Column definitions
 * come from the child field's children. Uses WidgetRenderer for each cell.
 * Automatically translates field labels.
 *
 * Features:
 * - Sortable columns with ascending/descending indicators
 * - Column headers from field labels
 * - Dark mode support
 * - Hover effects on rows
 *
 * @param value - Array of row objects
 * @param field - Field definition with child (row) and child.children (columns)
 * @param context - Rendering context with locale and translator
 * @param endpoint - Endpoint context for nested widget rendering
 */
export const DataTableWidget = <
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional" | "object" | "object-optional",
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  field,
  fieldName,
}: ReactWidgetProps<
  TEndpoint,
  DataTableWidgetConfig<TKey, TUsage, TSchemaType, TChildOrChildren>
>): JSX.Element => {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const { t: globalT } = simpleT(locale);
  const { sorting } = field;

  const initialSort = sorting?.defaultSort?.[0];
  const [sortBy, setSortBy] = useState<string | null>(initialSort?.key ?? null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    initialSort?.direction ?? "asc",
  );

  // Resolve field definitions and rows via guards
  let fieldDefinitions: ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  > = {};
  let rows: Array<Record<string, WidgetData>> = [];

  if (hasChild(field)) {
    const child = field.child;
    if (
      typeof child === "object" &&
      child !== null &&
      "children" in child &&
      child.children &&
      typeof child.children === "object"
    ) {
      fieldDefinitions = child.children;
    }
    rows = field.value.filter(
      (row: WidgetData): row is Record<string, WidgetData> =>
        Boolean(row) && typeof row === "object" && !Array.isArray(row),
    );
  }

  if (!rows.length) {
    return (
      <Div className={cn("text-muted-foreground italic", field.className)}>
        {globalT(
          "app.api.system.unifiedInterface.react.widgets.dataTable.noData",
        )}
      </Div>
    );
  }

  const handleSort = (columnKey: string): void => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnKey);
      setSortOrder("asc");
    }
  };

  const sortedRows = sortBy
    ? [...rows].toSorted((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        const order = sortOrder === "asc" ? 1 : -1;

        if (aVal === bVal) {
          return 0;
        }
        if (aVal === null || aVal === undefined) {
          return order;
        }
        if (bVal === null || bVal === undefined) {
          return -order;
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
          return aVal.localeCompare(bVal) * order;
        }

        return (aVal < bVal ? -1 : 1) * order;
      })
    : rows;

  return (
    <Div className={cn("overflow-x-auto", field.className)}>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            {Object.entries(fieldDefinitions).map(([key, fieldDef]) => {
              const label = getFieldLabel(fieldDef, key, t);
              const isSortable = sorting?.enabled !== false;

              return (
                <TableHead
                  key={key}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400",
                    isSortable &&
                      "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                  )}
                  onClick={(): void => {
                    if (isSortable) {
                      handleSort(key);
                    }
                  }}
                  onKeyDown={(e): void => {
                    if (isSortable && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      handleSort(key);
                    }
                  }}
                  role={isSortable ? "button" : undefined}
                  tabIndex={isSortable ? 0 : undefined}
                  aria-sort={
                    isSortable && sortBy === key
                      ? sortOrder === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <Div className="flex items-center gap-2">
                    {label}
                    {isSortable && sortBy === key && (
                      <Span className="text-blue-500">
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
          <MultiWidgetRenderer
            childrenSchema={hasChild(field) ? field.child : undefined}
            value={sortedRows}
            fieldName={fieldName}
            renderItem={({ itemData, index }) => {
              const row = itemData as Record<string, WidgetData>;

              return (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {Object.entries(fieldDefinitions).map(([key, fieldDef]) => {
                    const cellValue = row[key];

                    return (
                      <TableCell
                        key={key}
                        className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                      >
                        {fieldDef ? (
                          <MultiWidgetRenderer
                            childrenSchema={{ [key]: fieldDef }}
                            value={row}
                            fieldName={undefined}
                          />
                        ) : (
                          <Span className="text-gray-600 dark:text-gray-400">
                            {`${cellValue ?? "—"}`}
                          </Span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            }}
          />
        </TableBody>
      </Table>
    </Div>
  );
};

DataTableWidget.displayName = "DataTableWidget";

export default DataTableWidget;
