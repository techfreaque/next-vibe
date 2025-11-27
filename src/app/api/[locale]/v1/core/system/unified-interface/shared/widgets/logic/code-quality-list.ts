/**
 * Code Quality List Widget Logic
 * Shared data extraction and processing for CODE_QUALITY_LIST widget
 * Used by both React and CLI implementations
 */

import type { WidgetData } from "../types";

/**
 * Code quality issue item
 */
export interface CodeQualityItem {
  file: string;
  line?: number;
  column?: number;
  severity: "error" | "warning" | "info";
  message: string;
  rule?: string;
  [key: string]: WidgetData;
}

/**
 * Processed code quality list structure
 */
export interface ProcessedCodeQualityList {
  items: CodeQualityItem[];
  groupBy?: "file" | "severity" | "rule";
  showSummary: boolean;
}

/**
 * Extract and validate code quality list data from WidgetData
 */
export function extractCodeQualityListData(
  value: WidgetData,
): ProcessedCodeQualityList | null {
  // Handle array of issues directly
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }

    const items = value
      .map((item: unknown) => validateCodeQualityItem(item))
      .filter((item): item is CodeQualityItem => item !== null);

    if (items.length === 0) {
      return null;
    }

    return {
      items,
      showSummary: true,
    };
  }

  // Handle object with items array
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const items =
      "items" in value && Array.isArray(value.items) ? value.items : [];
    const groupBy =
      "groupBy" in value && typeof value.groupBy === "string"
        ? value.groupBy
        : undefined;
    const showSummary =
      "showSummary" in value && typeof value.showSummary === "boolean"
        ? value.showSummary
        : true;

    const validItems = items
      .map((item: unknown) => validateCodeQualityItem(item))
      .filter((item): item is CodeQualityItem => item !== null);

    if (validItems.length === 0) {
      return null;
    }

    return {
      items: validItems,
      groupBy:
        groupBy === "file" || groupBy === "severity" || groupBy === "rule"
          ? groupBy
          : undefined,
      showSummary,
    };
  }

  return null;
}

/**
 * Validate a single code quality item
 */
function validateCodeQualityItem(item: unknown): CodeQualityItem | null {
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    return null;
  }

  const file = "file" in item && typeof item.file === "string" ? item.file : "";
  const message =
    "message" in item && typeof item.message === "string" ? item.message : "";

  if (!file || !message) {
    return null;
  }

  const line =
    "line" in item && typeof item.line === "number" ? item.line : undefined;
  const column =
    "column" in item && typeof item.column === "number"
      ? item.column
      : undefined;
  const severity =
    "severity" in item && typeof item.severity === "string"
      ? item.severity
      : "info";
  const rule =
    "rule" in item && typeof item.rule === "string" ? item.rule : undefined;

  return {
    file,
    line,
    column,
    severity:
      severity === "error" || severity === "warning" || severity === "info"
        ? severity
        : "info",
    message,
    rule,
    ...item,
  } as CodeQualityItem;
}

/**
 * Group items by specified field
 */
export function groupCodeQualityItems(
  items: CodeQualityItem[],
  groupBy: "file" | "severity" | "rule",
): Map<string, CodeQualityItem[]> {
  const groups = new Map<string, CodeQualityItem[]>();

  for (const item of items) {
    const groupKey = item[groupBy] ?? "unknown";
    const key = String(groupKey);

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }

  return groups;
}

/**
 * Count items by severity
 */
export function countCodeQualityBySeverity(items: CodeQualityItem[]): {
  error: number;
  warning: number;
  info: number;
} {
  const counts = { error: 0, warning: 0, info: 0 };

  for (const item of items) {
    if (item.severity in counts) {
      counts[item.severity]++;
    }
  }

  return counts;
}

/**
 * Sort code quality items by severity (errors first, then warnings, then info)
 */
export function sortBySeverity(items: CodeQualityItem[]): CodeQualityItem[] {
  const severityOrder: Record<string, number> = {
    error: 0,
    warning: 1,
    info: 2,
  };
  return items.toSorted((a, b) => {
    const aOrder = severityOrder[a.severity] ?? 3;
    const bOrder = severityOrder[b.severity] ?? 3;
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    // Secondary sort by line number
    return (a.line || 0) - (b.line || 0);
  });
}
