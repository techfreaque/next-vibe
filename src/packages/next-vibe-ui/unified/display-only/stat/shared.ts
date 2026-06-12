/**
 * Stat Widget Logic
 * Shared data extraction and processing for STAT widget
 * Used by both React and CLI implementations
 */

import type { StatFormat, StatVariant } from "./types";

/**
 * Format stat value based on format type and locale
 * Provides consistent number formatting across platforms
 *
 * @param value - Numeric value to format
 * @param format - Format type (number, percentage, currency, compact)
 * @param locale - Locale string for formatting
 * @returns Formatted string representation
 */
export function formatStatValue(
  value: number,
  format: StatFormat | undefined,
  locale: string,
): string {
  if (format === "percentage") {
    // Assume value is 0-1 range, convert to percentage
    return new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }

  if (format === "currency") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (format === "compact") {
    return new Intl.NumberFormat(locale, {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  }

  // Default number formatting with locale
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Get color name for stat variant (used in CLI rendering)
 */
export function getStatVariantColor(
  variant: StatVariant,
): "blue" | "dim" | "green" | "yellow" | "red" | "default" {
  switch (variant) {
    case "success":
      return "green";
    case "warning":
      return "yellow";
    case "danger":
      return "red";
    case "info":
      return "blue";
    case "muted":
      return "dim";
    default:
      return "default";
  }
}
