/**
 * Data Table Widget Logic
 * Shared data extraction and processing for DATA_TABLE widget
 * Used by both React and CLI implementations
 */

import type { CountryLanguage } from "@/i18n/core/config";

import type { UnifiedField } from "../../types/endpoint";
import { FieldDataType, WidgetType } from "../../types/enums";
import type { WidgetData } from "../types";

/**
 * Table row type
 */
export interface TableRow {
  [key: string]: WidgetData;
}

/**
 * Table column definition
 */
export interface TableColumn<TKey extends string> {
  key: string;
  label: NoInfer<TKey>;
  type?: FieldDataType;
  width?: string;
  align?: "left" | "center" | "right";
  formatter?: (value: WidgetData) => string;
}

/**
 * Table rendering configuration
 */
export interface TableRenderConfig<TKey extends string> {
  columns: TableColumn<TKey>[];
  pagination: { enabled: boolean; pageSize: number };
  sorting: {
    enabled: boolean;
    defaultSort?: { key: string; direction: "asc" | "desc" };
  };
  filtering: { enabled: boolean };
}

/**
 * Processed data table structure
 */
export interface ProcessedDataTable<TKey extends string> {
  rows: TableRow[];
  columns: TableColumn<TKey>[];
}

/**
 * Extract and validate data table from WidgetData
 */
export function extractDataTableData<TKey extends string>(
  value: WidgetData,
): ProcessedDataTable<TKey> | null {
  // Handle array of objects (auto-detect columns)
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }

    // Auto-detect columns from first row
    const firstRow = value[0];
    if (typeof firstRow === "object" && firstRow !== null && !Array.isArray(firstRow)) {
      const columns: TableColumn<TKey>[] = Object.keys(firstRow).map((key) => ({
        key,
        label: key as TKey,
      }));

      const rows = value.filter(
        (item): item is TableRow =>
          item !== undefined && typeof item === "object" && item !== null && !Array.isArray(item),
      ) as TableRow[];

      return {
        rows,
        columns,
      };
    }

    return null;
  }

  // Handle object with rows and columns
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const rows = "rows" in value && Array.isArray(value.rows) ? value.rows : [];
    const columns = "columns" in value && Array.isArray(value.columns) ? value.columns : [];

    // Validate rows
    const validRows = rows.filter(
      (item): item is TableRow => typeof item === "object" && item !== null && !Array.isArray(item),
    );

    // Validate columns
    const validColumns = columns
      .map((col: WidgetData) => {
        if (typeof col !== "object" || col === null || Array.isArray(col)) {
          return null;
        }

        const key = "key" in col && typeof col.key === "string" ? col.key : "";
        const label = "label" in col && typeof col.label === "string" ? col.label : key;

        if (!key) {
          return null;
        }

        return { key, label };
      })
      .filter((col): col is TableColumn<TKey> => col !== null);

    if (validRows.length === 0) {
      return null;
    }

    // If no columns provided, auto-detect from first row
    if (validColumns.length === 0 && validRows.length > 0) {
      const firstRow = validRows[0];
      const autoColumns: TableColumn<TKey>[] = Object.keys(firstRow).map((key) => ({
        key,
        label: key as TKey,
      }));
      return {
        rows: validRows,
        columns: autoColumns,
      };
    }

    return {
      rows: validRows,
      columns: validColumns,
    };
  }

  return null;
}

/**
 * Get cell value from row
 */
export function getCellValue(row: TableRow, columnKey: string): WidgetData {
  return row[columnKey];
}

/**
 * Get table configuration from field
 */
export function getTableConfig<TKey extends string>(
  field: UnifiedField<TKey>,
): TableRenderConfig<TKey> {
  const defaultConfig: TableRenderConfig<TKey> = {
    columns: [],
    pagination: { enabled: false, pageSize: 50 },
    sorting: { enabled: false },
    filtering: { enabled: false },
  };

  if (field.ui.type !== WidgetType.DATA_TABLE) {
    return defaultConfig;
  }

  const config = field.ui;

  const columns: TableColumn<TKey>[] =
    config.columns?.map((col) => ({
      key: col.key,
      label: col.label,
      type: FieldDataType.TEXT,
      width: typeof col.width === "string" ? col.width : undefined,
      align: col.align || ("left" as const),
    })) || [];

  // Extract and type-check pagination config
  const paginationValue = config.pagination;
  let pagination: { enabled: boolean; pageSize: number } = {
    enabled: false,
    pageSize: 50,
  };
  if (
    typeof paginationValue === "object" &&
    paginationValue !== null &&
    !Array.isArray(paginationValue)
  ) {
    const paginationObj = paginationValue;
    if ("enabled" in paginationObj && "pageSize" in paginationObj) {
      const enabledVal = paginationObj.enabled;
      const pageSizeVal = paginationObj.pageSize;
      if (typeof enabledVal === "boolean" && typeof pageSizeVal === "number") {
        pagination = { enabled: enabledVal, pageSize: pageSizeVal };
      }
    }
  }

  // Extract and type-check sorting config
  const sortingValue = config.sorting;
  let sorting: {
    enabled: boolean;
    defaultSort?: { key: string; direction: "asc" | "desc" };
  } = {
    enabled: false,
  };
  if (typeof sortingValue === "object" && sortingValue !== null && !Array.isArray(sortingValue)) {
    const sortingObj = sortingValue;
    if ("enabled" in sortingObj) {
      const enabledVal = sortingObj.enabled;
      if (typeof enabledVal === "boolean") {
        sorting.enabled = enabledVal;
      }
    }
  }

  // Extract and type-check filtering config
  const filteringValue = config.filtering;
  let filtering: { enabled: boolean } = { enabled: false };
  if (
    typeof filteringValue === "object" &&
    filteringValue !== null &&
    !Array.isArray(filteringValue)
  ) {
    const filteringObj = filteringValue;
    if ("enabled" in filteringObj) {
      const enabledVal = filteringObj.enabled;
      if (typeof enabledVal === "boolean") {
        filtering = { enabled: enabledVal };
      }
    }
  }

  return {
    columns,
    pagination,
    sorting,
    filtering,
  };
}

/**
 * Detect field data type from value
 */
export function detectFieldType(value: WidgetData): FieldDataType {
  if (typeof value === "number") {
    return FieldDataType.NUMBER;
  }
  if (typeof value === "boolean") {
    return FieldDataType.BOOLEAN;
  }
  if (Array.isArray(value)) {
    return FieldDataType.ARRAY;
  }
  if (value && typeof value === "object") {
    return FieldDataType.OBJECT;
  }
  if (typeof value === "string" && !isNaN(Date.parse(value))) {
    return FieldDataType.DATE;
  }
  return FieldDataType.TEXT;
}

/**
 * Calculate column widths based on content
 */
export function calculateColumnWidths<TKey extends string>(
  data: TableRow[],
  config: TableRenderConfig<TKey>,
  maxWidth: number,
): number[] {
  const availableWidth = maxWidth - (config.columns.length - 1) * 3; // Account for separators

  return config.columns.map((col: TableColumn<TKey>) => {
    if (col.width?.endsWith("%")) {
      const percentage = parseInt(col.width.replace("%", ""), 10) / 100;
      return Math.floor(availableWidth * percentage);
    }

    // Auto-calculate based on content
    const headerWidth = col.label.length;
    const maxContentWidth = Math.max(
      ...data.slice(0, 10).map((row) => {
        const value = row[col.key];
        const formatted = formatCellValue(value);
        return formatted.length;
      }),
    );

    return Math.min(Math.max(headerWidth, maxContentWidth), 50);
  });
}

/**
 * Get column formatter based on field type
 */
export function getColumnFormatter(
  type: FieldDataType,
  locale: CountryLanguage,
): (value: WidgetData) => string {
  switch (type) {
    case FieldDataType.NUMBER:
      return (value) => {
        if (typeof value === "number") {
          return value.toLocaleString(locale);
        }
        return formatCellValue(value);
      };
    case FieldDataType.BOOLEAN:
      return (value) => {
        if (typeof value === "boolean") {
          return value ? "✓" : "✗";
        }
        return formatCellValue(value);
      };
    case FieldDataType.DATE:
      return (value) => {
        if (typeof value === "string" || value instanceof Date) {
          const date = value instanceof Date ? value : new Date(value);
          return date.toLocaleDateString(locale);
        }
        return formatCellValue(value);
      };
    case FieldDataType.ARRAY:
      return (value) => {
        if (Array.isArray(value)) {
          return `[${value.length} items]`;
        }
        return formatCellValue(value);
      };
    case FieldDataType.OBJECT:
      return (value) => {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          return `{${Object.keys(value).length} properties}`;
        }
        return formatCellValue(value);
      };
    default:
      return (value) => {
        const str = formatCellValue(value);
        return str.length > 50 ? `${str.slice(0, 47)}...` : str;
      };
  }
}

/**
 * Format cell value as string for display
 */
export function formatCellValue(value: WidgetData): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return "";
}
