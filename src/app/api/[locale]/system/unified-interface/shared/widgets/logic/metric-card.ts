/**
 * Metric Card Widget Logic
 * Shared data extraction and processing for METRIC_CARD widget
 * Used by both React and CLI implementations
 */

import type { IconKey } from "../../../react/icons";
import type { UnifiedField } from "../../types/endpoint";
import { WidgetType } from "../../types/enums";
import type { WidgetData } from "../types";
import { formatBytes } from "../utils/formatting";

/**
 * Metric configuration
 */
export interface MetricConfig {
  format: "bytes" | "currency" | "number" | "percentage";
  precision: number;
  icon?: IconKey;
  unit?: string;
  threshold?: {
    warning?: number;
    error?: number;
  };
}

/**
 * Processed metric card data structure
 */
export interface ProcessedMetricCard {
  value: string | number;
  label: string;
  description?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
  };
  icon?: IconKey;
  color?: string;
}

/**
 * Extract and validate metric card data from WidgetData
 */
export function extractMetricCardData(
  value: WidgetData,
): ProcessedMetricCard | null {
  // Narrow to object type first
  const isObject =
    typeof value === "object" && value !== null && !Array.isArray(value);

  if (!isObject) {
    return null;
  }

  // Extract required value
  const metricValue =
    "value" in value &&
    (typeof value.value === "string" || typeof value.value === "number")
      ? value.value
      : null;

  if (metricValue === null) {
    return null;
  }

  // Extract required label
  const label =
    "label" in value && typeof value.label === "string" ? value.label : "";

  if (!label) {
    return null;
  }

  // Extract optional properties
  const description =
    "description" in value && typeof value.description === "string"
      ? value.description
      : undefined;

  // Type assertion for icon: widget configuration is trusted to provide valid IconKey strings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icon =
    "icon" in value && typeof value.icon === "string"
      ? (value.icon as IconKey)
      : undefined;

  const color =
    "color" in value && typeof value.color === "string"
      ? value.color
      : undefined;

  // Extract trend if present
  let trend: ProcessedMetricCard["trend"];
  if (
    "trend" in value &&
    typeof value.trend === "object" &&
    value.trend !== null &&
    !Array.isArray(value.trend)
  ) {
    const trendValue =
      "value" in value.trend && typeof value.trend.value === "number"
        ? value.trend.value
        : null;
    const trendDirection =
      "direction" in value.trend && typeof value.trend.direction === "string"
        ? value.trend.direction
        : null;

    if (
      trendValue !== null &&
      (trendDirection === "up" ||
        trendDirection === "down" ||
        trendDirection === "neutral")
    ) {
      trend = {
        value: trendValue,
        direction: trendDirection,
      };
    }
  }

  return {
    value: metricValue,
    label,
    description,
    trend,
    icon,
    color,
  };
}

/**
 * Format metric value for display
 */
export function formatMetricValue(value: string | number): string {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US").format(value);
  }
  return value;
}

/**
 * Get trend display (e.g., "+5%", "-3%")
 */
export function formatTrendValue(trendValue: number): string {
  const sign = trendValue > 0 ? "+" : "";
  return `${sign}${trendValue}%`;
}

/**
 * Get metric configuration from field
 */
export function getMetricConfig<TKey extends string>(
  field: UnifiedField<TKey>,
): MetricConfig {
  const defaultConfig: MetricConfig = {
    format: "number",
    precision: 2,
  };

  if (field.ui.type !== WidgetType.METRIC_CARD) {
    return defaultConfig;
  }

  const config = field.ui;

  const formatValue =
    typeof config.format === "string" ? config.format : "number";
  const validFormats = ["bytes", "currency", "number", "percentage"] as const;
  const format: "bytes" | "currency" | "number" | "percentage" =
    validFormats.includes(formatValue as (typeof validFormats)[number])
      ? (formatValue as (typeof validFormats)[number])
      : "number";

  return {
    icon: typeof config.icon === "string" ? config.icon : undefined,
    unit: typeof config.unit === "string" ? config.unit : undefined,
    precision: typeof config.precision === "number" ? config.precision : 2,
    threshold:
      config.threshold && typeof config.threshold === "object"
        ? (config.threshold as { warning?: number; error?: number })
        : undefined,
    format,
  };
}

/**
 * Format metric value with configuration
 */
export function formatMetricValueWithConfig(
  value: WidgetData,
  config: MetricConfig,
): string {
  if (typeof value !== "number") {
    return String(value);
  }

  let formatted: string;

  switch (config.format) {
    case "percentage":
      formatted = `${(value * 100).toFixed(config.precision)}%`;
      break;
    case "currency":
      formatted = `$${value.toFixed(config.precision)}`;
      break;
    case "bytes":
      formatted = formatBytes(value);
      break;
    default:
      // For integer values (like counts), don't show decimal places
      if (Number.isInteger(value) && config.precision === 2) {
        formatted = value.toString();
      } else {
        formatted = value.toFixed(config.precision);
      }
      if (config.unit) {
        formatted += ` ${config.unit}`;
      }
  }

  return formatted;
}

/**
 * Process lint summary data (special case for code quality)
 */
export function processLintSummary(summary: Record<string, WidgetData>): {
  errors: number;
  warnings: number;
  info: number;
  hasIssues: boolean;
} {
  const errors = Number(summary.errors || 0);
  const warnings = Number(summary.warnings || 0);
  const info = Number(summary.info || 0);
  const hasIssues = Boolean(summary.hasIssues);

  return {
    errors,
    warnings,
    info,
    hasIssues,
  };
}
