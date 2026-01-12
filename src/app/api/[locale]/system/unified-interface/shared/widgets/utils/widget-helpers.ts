/**
 * Widget Helper Utilities
 * Shared business logic utilities for React widgets
 * Pure functions with no side effects - can be used in any environment
 */

import type { WidgetData } from "../types";

/**
 * Layout Configuration Types
 */
export interface LayoutConfig {
  type: "grid" | "flex" | "stack";
  gap: string;
  columns?: number;
}

/**
 * Grid Column Configuration
 */
export interface GridConfig {
  columns: 1 | 2 | 3 | 4;
}

/**
 * Severity types for code quality
 */
export type SeverityType = "error" | "warning" | "info";

/**
 * Badge variant types (React component specific)
 */
export type BadgeVariant = "destructive" | "default" | "secondary";

/**
 * Trend direction types
 */
export type TrendDirection = "up" | "down" | "neutral";

/**
 * Extract layout configuration from widget value
 * Used by: ContainerWidget
 */
export function extractLayoutConfig(value: WidgetData): LayoutConfig {
  const isObject =
    typeof value === "object" && value !== null && !Array.isArray(value);

  if (!isObject) {
    return { type: "stack", gap: "4" };
  }

  const layoutRaw =
    "layout" in value &&
    typeof value.layout === "object" &&
    value.layout !== null
      ? value.layout
      : null;

  const layoutType =
    layoutRaw && "type" in layoutRaw && typeof layoutRaw.type === "string"
      ? layoutRaw.type
      : "stack";

  const layoutGap =
    layoutRaw && "gap" in layoutRaw && typeof layoutRaw.gap === "string"
      ? layoutRaw.gap
      : "4";

  const layoutColumns =
    layoutRaw && "columns" in layoutRaw && typeof layoutRaw.columns === "number"
      ? layoutRaw.columns
      : undefined;

  return {
    type:
      layoutType === "grid" || layoutType === "flex" || layoutType === "stack"
        ? layoutType
        : "stack",
    gap: layoutGap,
    columns: layoutColumns,
  };
}

/**
 * Get layout class name from layout config
 * Used by: ContainerWidget
 */
export function getLayoutClassName(config: LayoutConfig): string {
  const { type, gap, columns } = config;

  // JIT-safe gap classes mapping
  const gapClassMap: Record<string, string> = {
    "0": "gap-0",
    "1": "gap-1",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "5": "gap-5",
    "6": "gap-6",
    "7": "gap-7",
    "8": "gap-8",
    "9": "gap-9",
    "10": "gap-10",
    "11": "gap-11",
    "12": "gap-12",
  };

  // JIT-safe grid-cols classes mapping
  const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
  };

  const gapClass = gapClassMap[gap] ?? "gap-4";

  switch (type) {
    case "grid": {
      const gridColsClass = columns
        ? (gridColsMap[columns] ?? "grid-cols-1")
        : "grid-cols-1";
      return `grid ${gapClass} ${gridColsClass}`;
    }
    case "flex":
      return `flex items-center ${gapClass}`;
    case "stack":
    default:
      return `flex flex-col ${gapClass}`;
  }
}

/**
 * Get grid class name based on column count
 * Used by: DataCardsWidget, LinkListWidget
 */
export function getGridClassName(columns: 1 | 2 | 3 | 4): string {
  const gridClassMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return gridClassMap[columns] ?? "grid-cols-1";
}

/**
 * Check if URL is external (starts with http:// or https://)
 * Used by: LinkWidget, LinkCardWidget
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Extract additional LinkCard properties not in shared logic
 * Used by: LinkCardWidget
 */
export interface LinkCardExtras {
  snippet?: string;
  age?: string;
  source?: string;
  thumbnail?: string;
  openInNewTab: boolean;
}

export function extractLinkCardExtras(value: WidgetData): LinkCardExtras {
  const isObject =
    typeof value === "object" && value !== null && !Array.isArray(value);

  if (!isObject) {
    return { openInNewTab: true };
  }

  return {
    snippet:
      "snippet" in value && typeof value.snippet === "string"
        ? value.snippet
        : undefined,
    age:
      "age" in value && typeof value.age === "string" ? value.age : undefined,
    source:
      "source" in value && typeof value.source === "string"
        ? value.source
        : undefined,
    thumbnail:
      "thumbnail" in value && typeof value.thumbnail === "string"
        ? value.thumbnail
        : undefined,
    openInNewTab:
      "openInNewTab" in value && typeof value.openInNewTab === "boolean"
        ? value.openInNewTab
        : true,
  };
}

/**
 * Extract unit from metric value
 * Used by: MetricCardWidget
 */
export function extractMetricUnit(value: WidgetData): string | undefined {
  const isObject =
    typeof value === "object" && value !== null && !Array.isArray(value);

  if (!isObject) {
    return undefined;
  }

  return "unit" in value && typeof value.unit === "string"
    ? value.unit
    : undefined;
}

/**
 * Get trend color class name
 * Used by: MetricCardWidget
 */
export function getTrendColorClassName(direction?: TrendDirection): string {
  switch (direction) {
    case "up":
      return "text-green-600 dark:text-green-400";
    case "down":
      return "text-red-600 dark:text-red-400";
    case "neutral":
    default:
      return "text-muted-foreground";
  }
}

/**
 * Get severity badge variant
 * Used by: CodeQualityListWidget
 */
export function getSeverityVariant(severity: SeverityType): BadgeVariant {
  switch (severity) {
    case "error":
      return "destructive";
    case "warning":
      return "default";
    case "info":
      return "secondary";
  }
}

/**
 * Extract column configuration from data table value
 * Used by: DataTableWidget
 */
export interface ColumnConfig {
  align: "text-left" | "text-center" | "text-right";
  sortable: boolean;
  width?: string | number;
  format?: (value: WidgetData) => WidgetData;
}

export function extractColumnConfig(
  value: WidgetData,
  columnKey: string,
): ColumnConfig {
  const defaultConfig: ColumnConfig = {
    align: "text-left",
    sortable: false,
  };

  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value) ||
    !("columns" in value) ||
    !Array.isArray(value.columns)
  ) {
    return defaultConfig;
  }

  const rawColumn = value.columns.find(
    (c: WidgetData) =>
      typeof c === "object" && c !== null && "key" in c && c.key === columnKey,
  );

  if (!rawColumn || typeof rawColumn !== "object" || rawColumn === null) {
    return defaultConfig;
  }

  const align =
    "align" in rawColumn && typeof rawColumn.align === "string"
      ? (rawColumn.align as "text-left" | "text-center" | "text-right")
      : "text-left";

  const sortable =
    "sortable" in rawColumn && typeof rawColumn.sortable === "boolean"
      ? rawColumn.sortable
      : false;

  const width =
    "width" in rawColumn &&
    (typeof rawColumn.width === "string" || typeof rawColumn.width === "number")
      ? rawColumn.width
      : undefined;

  const format =
    "format" in rawColumn && typeof rawColumn.format === "function"
      ? (rawColumn.format as (value: WidgetData) => WidgetData)
      : undefined;

  return {
    align,
    sortable,
    width,
    format,
  };
}

/**
 * Sort table rows by column
 * Used by: DataTableWidget
 */
export function sortTableRows<T extends Record<string, WidgetData>>(
  rows: T[],
  sortBy: string | null,
  sortOrder: "asc" | "desc",
): T[] {
  if (!sortBy) {
    return rows;
  }

  return rows.toSorted((a, b) => {
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
}

/**
 * Extract table sort configuration from value
 * Used by: DataTableWidget
 */
export interface TableSortConfig {
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  totalRows?: number;
}

export function extractTableSortConfig(value: WidgetData): TableSortConfig {
  const isObject =
    typeof value === "object" && value !== null && !Array.isArray(value);

  if (!isObject) {
    return { sortBy: null, sortOrder: "asc" };
  }

  const totalRows =
    "totalRows" in value && typeof value.totalRows === "number"
      ? value.totalRows
      : undefined;

  const sortBy =
    "sortBy" in value && typeof value.sortBy === "string" ? value.sortBy : null;

  const sortOrder =
    "sortOrder" in value &&
    (value.sortOrder === "asc" || value.sortOrder === "desc")
      ? value.sortOrder
      : "asc";

  return {
    totalRows,
    sortBy,
    sortOrder,
  };
}

/**
 * Determine if textarea should be used for text field
 * Used by: TextWidget
 */
export function isTextareaField(field: {
  ui: { type?: string; fieldType?: string; multiline?: boolean };
}): boolean {
  return (
    field.ui.type === "FORM_FIELD" &&
    "fieldType" in field.ui &&
    field.ui.fieldType === "TEXT" &&
    "multiline" in field.ui &&
    field.ui.multiline === true
  );
}

/**
 * Get placeholder from field UI config
 * Used by: TextWidget
 */
export function getFieldPlaceholder(field: {
  ui: { placeholder?: string };
}): string | undefined {
  return "placeholder" in field.ui && typeof field.ui.placeholder === "string"
    ? field.ui.placeholder
    : undefined;
}

/**
 * Extract field name from field structure
 * Used by: TextWidget
 */
export function getFieldName(field: { name?: string }): string {
  if ("name" in field && typeof field.name === "string") {
    return field.name;
  }
  return "value";
}

/**
 * Get format class name for text display
 * Used by: TextWidget
 */
export function getTextFormatClassName(
  format: "code" | "pre" | "normal" | undefined,
): string {
  switch (format) {
    case "code":
      return "font-mono text-sm bg-muted px-1 py-0.5 rounded";
    case "pre":
      return "font-mono text-sm whitespace-pre";
    case "normal":
    default:
      return "text-foreground";
  }
}

/**
 * Extract description from container value
 * Used by: ContainerWidget
 */
export function extractContainerDescription(value: WidgetData): string {
  const isObject =
    typeof value === "object" && value !== null && !Array.isArray(value);

  if (!isObject) {
    return "";
  }

  return "description" in value && typeof value.description === "string"
    ? value.description
    : "";
}
