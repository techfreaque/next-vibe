/**
 * Metric Card Widget Logic
 * Shared data extraction and processing for METRIC_CARD widget
 * Used by both React and CLI implementations
 */

import type { IconKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";

import type { WidgetData } from "../../../../shared/widgets/widget-data";

/**
 * Processed metric card data structure
 */
interface ProcessedMetricCard {
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
  const label = typeof value.label === "string" ? value.label : "";

  if (!label) {
    return null;
  }

  // Extract optional properties
  const description =
    typeof value.description === "string" ? value.description : undefined;

  // Type assertion for icon: widget configuration is trusted to provide valid IconKey strings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icon =
    typeof value.icon === "string" ? (value.icon as IconKey) : undefined;

  const color = typeof value.color === "string" ? value.color : undefined;

  // Extract trend if present
  let trend: ProcessedMetricCard["trend"];
  if (
    "trend" in value &&
    typeof value.trend === "object" &&
    value.trend !== null &&
    !Array.isArray(value.trend)
  ) {
    const trendValue =
      typeof value.trend.value === "number" ? value.trend.value : null;
    const trendDirection =
      typeof value.trend.direction === "string" ? value.trend.direction : null;

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
