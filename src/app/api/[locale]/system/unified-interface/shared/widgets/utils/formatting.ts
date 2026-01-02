/**
 * Data Formatter
 * Shared formatting utilities for all platforms
 * Eliminates duplication across CLI, Web, and other output formatters
 * Pure logic - no server dependencies
 */

import type { CountryLanguage } from "@/i18n/core/config";

import type { WidgetData } from "../types";

/**
 * Text formatting options
 */
export interface TextFormatOptions {
  maxLength?: number;
  ellipsis?: string;
  truncateMiddle?: boolean;
}

/**
 * Number formatting options
 */
export interface NumberFormatOptions {
  precision?: number;
  unit?: string;
  locale: CountryLanguage;
  style?: "decimal" | "currency" | "percent";
  currency?: string;
}

/**
 * Array formatting options
 */
export interface ArrayFormatOptions {
  separator?: string;
  maxItems?: number;
  showCount?: boolean;
}

/**
 * Duration formatting options
 */
export interface DurationFormatOptions {
  unit?: "ms" | "s" | "m" | "h";
  precision?: number;
}

/**
 * Base Data Formatter
 * Provides common formatting utilities for all platforms
 */
export class BaseDataFormatter {
  /**
   * Format text with truncation
   */
  formatText(value: string, options: TextFormatOptions = {}): string {
    const { maxLength, ellipsis = "...", truncateMiddle = false } = options;

    if (!maxLength || value.length <= maxLength) {
      return value;
    }

    if (truncateMiddle) {
      const halfLength = Math.floor((maxLength - ellipsis.length) / 2);
      return `${value.slice(0, halfLength)}${ellipsis}${value.slice(value.length - halfLength)}`;
    }

    return `${value.slice(0, maxLength - ellipsis.length)}${ellipsis}`;
  }

  /**
   * Format number with precision and unit
   */
  formatNumber(value: number, options: NumberFormatOptions): string {
    const { precision = 2, unit, locale, style = "decimal", currency } = options;

    let formatted: string;

    if (style === "currency" && currency) {
      formatted = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);
    } else if (style === "percent") {
      formatted = new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);
    } else {
      formatted = value.toFixed(precision);
    }

    return unit ? `${formatted} ${unit}` : formatted;
  }

  /**
   * Format boolean as symbol or text
   */
  formatBoolean(value: boolean, options: { style?: "symbol" | "text" | "emoji" } = {}): string {
    const { style = "emoji" } = options;

    if (style === "emoji") {
      // Use colored emojis for better visual feedback
      return value ? "✅" : "❌";
    }

    if (style === "symbol") {
      const checkmark = "\u2713";
      const cross = "\u2717";
      return value ? checkmark : cross;
    }

    return value ? "true" : "false";
  }

  /**
   * Format duration in milliseconds
   */
  formatDuration(milliseconds: number, options: DurationFormatOptions = {}): string {
    const { unit = "s", precision = 2 } = options;

    switch (unit) {
      case "ms":
        return `${milliseconds.toFixed(precision)}ms`;
      case "s":
        return `${(milliseconds / 1000).toFixed(precision)}s`;
      case "m":
        return `${(milliseconds / 60000).toFixed(precision)}m`;
      case "h":
        return `${(milliseconds / 3600000).toFixed(precision)}h`;
      default:
        return `${milliseconds.toFixed(precision)}ms`;
    }
  }

  /**
   * Format date/timestamp
   */
  formatDate(
    value: Date | string | number,
    locale: CountryLanguage,
    options: {
      format?: "short" | "long" | "iso";
    },
  ): string {
    const { format = "short" } = options;
    const date = value instanceof Date ? value : new Date(value);

    if (format === "iso") {
      return date.toISOString();
    }

    if (format === "long") {
      return new Intl.DateTimeFormat(locale, {
        dateStyle: "full",
        timeStyle: "long",
      }).format(date);
    }

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  }

  /**
   * Format array with separator and truncation
   */
  formatArray(value: WidgetData[], options: ArrayFormatOptions = {}): string {
    const { separator = ", ", maxItems = 10, showCount = true } = options;

    const items = value.slice(0, maxItems);
    const formatted = items.map((item) => this.safeToString(item)).join(separator);

    if (value.length > maxItems && showCount) {
      const remaining = value.length - maxItems;
      return `${formatted}... (+${remaining} more)`;
    }

    return formatted;
  }

  /**
   * Format object as JSON
   */
  formatObject(
    value: Record<string, WidgetData>,
    options: { pretty?: boolean; maxDepth?: number } = {},
  ): string {
    const { pretty = true, maxDepth = 10 } = options;

    try {
      if (pretty) {
        return JSON.stringify(value, this.createReplacer(maxDepth), 2);
      }
      return JSON.stringify(value, this.createReplacer(maxDepth));
    } catch {
      return "{}";
    }
  }

  /**
   * Format file size in bytes
   */
  formatFileSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Format percentage
   */
  formatPercentage(value: number, options: { precision?: number } = {}): string {
    const { precision = 1 } = options;
    return `${(value * 100).toFixed(precision)}%`;
  }

  /**
   * Safe conversion to string
   */
  protected safeToString(value: WidgetData): string {
    if (value === null) {
      return "null";
    }
    if (value === undefined) {
      return "undefined";
    }
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (Array.isArray(value)) {
      return this.formatArray(value);
    }
    if (typeof value === "object") {
      return this.formatObject(value as Record<string, WidgetData>);
    }
    return String(value);
  }

  /**
   * Create JSON replacer with max depth
   */
  private createReplacer(
    maxDepth: number,
  ): (propertyKey: string, propertyValue: WidgetData) => WidgetData {
    const seen = new WeakSet();
    let depth = 0;

    return function replacer(this: WidgetData, propertyKey: string, value: WidgetData): WidgetData {
      if (depth > maxDepth) {
        return propertyKey ? `[Max Depth: ${propertyKey}]` : "[Max Depth Reached]";
      }

      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return propertyKey ? `[Circular: ${propertyKey}]` : "[Circular]";
        }
        seen.add(value);
        depth++;
      }

      return value;
    };
  }
}

/**
 * Singleton instance
 */
let formatterInstance: BaseDataFormatter | null = null;

/**
 * Get base formatter instance
 */
export function getBaseFormatter(): BaseDataFormatter {
  if (!formatterInstance) {
    formatterInstance = new BaseDataFormatter();
  }
  return formatterInstance;
}

/**
 * Format location as line:column
 * Used by: code-output, data-cards, code-quality-list, grouped-list
 */
export function formatLocation(line?: number, column?: number): string {
  if (typeof line === "number" && typeof column === "number") {
    return `${line}:${column}`;
  }
  if (typeof line === "number") {
    return `${line}:0`;
  }
  return "0:0";
}

/**
 * Format camelCase string to Title Case
 * Used by: container, stats-grid
 */
export function formatCamelCaseLabel(key: string): string {
  const spaced = key.replaceAll(/([A-Z])/g, (match) => ` ${match}`);
  return spaced.replace(/^./, (str) => str.toUpperCase()).trim();
}

/**
 * Format bytes to human-readable size
 * Used by: metric
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Format file path for display (remove leading ./ and normalize)
 * Used by: code-quality-list, grouped-list
 */
export function formatFilePath(path: string): string {
  return path.replace(/^\.\//, "").replace(/^src\//, "src/");
}

/**
 * Format value for display (handles all WidgetData types)
 * Used by: data-cards, grouped-list, stats-grid
 */
export function formatDisplayValue(value: WidgetData): string {
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

/**
 * Format stat value based on type
 * Used by: stats-grid
 */
export function formatStatValue(value: WidgetData): string {
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "boolean") {
    return value ? "✓" : "✗";
  }
  if (Array.isArray(value)) {
    return `${value.length} items`;
  }
  if (typeof value === "object" && value !== null) {
    return `${Object.keys(value).length} properties`;
  }
  return "—";
}

/**
 * Format number with locale
 * Used by: metric-card
 */
export function formatNumberWithLocale(value: number, locale: string): string {
  return value.toLocaleString(locale);
}

/**
 * Process template with variable substitution
 * Used by: code-output, data-cards
 */
export function processSummaryTemplate(
  template: string,
  variables: Record<string, string | number>,
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(`{${key}}`, String(value));
  }
  return result;
}
