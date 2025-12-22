/**
 * Code Output Widget Logic
 * Shared data extraction and processing for CODE_OUTPUT widget
 * Used by both React and CLI implementations
 */

import type { UnifiedField } from "../../types/endpoint";
import { WidgetType } from "../../types/enums";
import type { WidgetData } from "../types";

/**
 * Code output item interface (for linter/code quality output)
 */
export interface CodeOutputItem {
  [key: string]: WidgetData;
  line?: number;
  column?: number;
  severity?: string;
  message?: string;
  rule?: string;
  file?: string;
}

/**
 * Code output configuration
 */
export interface CodeOutputConfig {
  format: "eslint" | "generic" | "json" | "table";
  groupBy?: string;
  showSummary: boolean;
  showLineNumbers: boolean;
  colorScheme: "auto" | "light" | "dark";
  severityIcons: Record<string, string>;
  summaryTemplate?: string;
}

/**
 * Processed code output data structure (simple code display)
 */
export interface ProcessedCodeOutput {
  code: string;
  language: string;
  showLineNumbers: boolean;
  highlightLines: number[];
  theme: string;
}

/**
 * Extract code output configuration from field
 */
export function getCodeOutputConfig<TKey extends string>(
  field: UnifiedField<TKey>,
): CodeOutputConfig {
  const defaultConfig: CodeOutputConfig = {
    format: "generic",
    showSummary: true,
    showLineNumbers: false,
    colorScheme: "auto",
    severityIcons: {
      error: "✖ ",
      warning: "⚠ ",
      info: "ℹ ",
      success: "✓ ",
    },
  };

  if (field.ui.type !== WidgetType.CODE_OUTPUT) {
    return defaultConfig;
  }

  const config = field.ui;

  const formatValue = config.outputFormat || config.format;
  const format =
    typeof formatValue === "string" &&
    (formatValue === "eslint" ||
      formatValue === "generic" ||
      formatValue === "json" ||
      formatValue === "table")
      ? formatValue
      : "generic";

  const showSummary =
    typeof config.showSummary === "boolean" ? config.showSummary : true;

  const colorSchemeValue =
    "colorScheme" in config ? config.colorScheme : undefined;
  const colorScheme =
    typeof colorSchemeValue === "string" &&
    (colorSchemeValue === "auto" ||
      colorSchemeValue === "light" ||
      colorSchemeValue === "dark")
      ? colorSchemeValue
      : "auto";

  let severityIcons: Record<string, string> = {
    error: "✖ ",
    warning: "⚠ ",
    info: "ℹ ",
    success: "✓ ",
  };

  if (
    "severityIcons" in config &&
    typeof config.severityIcons === "object" &&
    config.severityIcons !== null &&
    !Array.isArray(config.severityIcons)
  ) {
    const icons: Record<string, string> = {};
    for (const [key, val] of Object.entries(config.severityIcons)) {
      if (typeof val === "string") {
        icons[key] = val;
      }
    }
    if (Object.keys(icons).length > 0) {
      severityIcons = icons;
    }
  }

  const groupBy =
    "groupBy" in config && typeof config.groupBy === "string"
      ? config.groupBy
      : undefined;

  const summaryTemplate =
    "summaryTemplate" in config && typeof config.summaryTemplate === "string"
      ? config.summaryTemplate
      : undefined;

  return {
    format,
    groupBy,
    showSummary,
    showLineNumbers: false,
    colorScheme,
    severityIcons,
    summaryTemplate,
  };
}

/**
 * Group code output data by specified field
 */
export function groupCodeOutputData(
  data: CodeOutputItem[],
  groupBy: string,
): Map<string, CodeOutputItem[]> {
  const groups = new Map<string, CodeOutputItem[]>();

  for (const item of data) {
    const groupValue = item[groupBy];
    let groupKey = "unknown";
    if (typeof groupValue === "string") {
      groupKey = groupValue;
    } else if (typeof groupValue === "number") {
      groupKey = String(groupValue);
    } else if (typeof groupValue === "boolean") {
      groupKey = groupValue ? "true" : "false";
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey)!.push(item);
  }

  return groups;
}

/**
 * Count items by severity
 */
export function countCodeOutputBySeverity(
  data: CodeOutputItem[],
): Record<string, number> {
  const counts = { error: 0, warning: 0, info: 0, success: 0 };

  for (const item of data) {
    const severityValue = item.severity;
    let severity = "info";
    if (typeof severityValue === "string") {
      severity = severityValue;
    }
    if (severity in counts) {
      counts[severity as keyof typeof counts]++;
    }
  }

  return counts;
}

/**
 * Build table data structure from code output items
 */
export function buildTableData(data: CodeOutputItem[]): {
  keys: string[];
  rows: Array<Record<string, string>>;
} {
  if (data.length === 0) {
    return { keys: [], rows: [] };
  }

  const keys = Object.keys(data[0]);
  const rows = data.map((item) => {
    const row: Record<string, string> = {};
    for (const key of keys) {
      const val = item[key];
      if (typeof val === "string") {
        row[key] = val;
      } else if (typeof val === "number") {
        row[key] = String(val);
      } else if (typeof val === "boolean") {
        row[key] = val ? "true" : "false";
      } else {
        row[key] = "";
      }
    }
    return row;
  });

  return { keys, rows };
}

/**
 * Extract and validate code output data from WidgetData
 * Handles both string (simple code) and object (full config) formats
 */
export function extractCodeOutputData(
  value: WidgetData,
  defaultTheme = "light",
): ProcessedCodeOutput | null {
  // Handle string value directly (simple code string)
  if (typeof value === "string") {
    return {
      code: value,
      language: "text",
      showLineNumbers: false,
      highlightLines: [],
      theme: defaultTheme,
    };
  }

  // Handle object value with code properties
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const code =
      "code" in value && typeof value.code === "string" ? value.code : "";
    const language =
      "language" in value && typeof value.language === "string"
        ? value.language
        : "text";
    const showLineNumbers =
      "showLineNumbers" in value && typeof value.showLineNumbers === "boolean"
        ? value.showLineNumbers
        : false;

    // Extract and validate highlightLines array
    const rawHighlightLines =
      "highlightLines" in value && Array.isArray(value.highlightLines)
        ? value.highlightLines
        : [];
    const highlightLines = rawHighlightLines.filter(
      (item): item is number => typeof item === "number",
    );

    const theme =
      "theme" in value && typeof value.theme === "string"
        ? value.theme
        : defaultTheme;

    if (!code) {
      return null;
    }

    return {
      code,
      language,
      showLineNumbers,
      highlightLines,
      theme,
    };
  }

  // Invalid type
  return null;
}

/**
 * Split code into lines for rendering
 */
export function splitCodeIntoLines(code: string): string[] {
  return code.split("\n");
}

/**
 * Check if a line should be highlighted
 */
export function isLineHighlighted(
  lineNumber: number,
  highlightLines: number[],
): boolean {
  return highlightLines.includes(lineNumber);
}
