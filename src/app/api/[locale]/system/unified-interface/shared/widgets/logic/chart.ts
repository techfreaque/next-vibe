/**
 * Chart Widget Shared Logic
 *
 * Provides type-safe extraction and validation for chart data.
 * Supports multiple chart formats:
 * - Single series: Array of data points
 * - Multiple series: Array of series objects or object with named series
 * - Pie/Donut: Array of data points with x/y values
 *
 * Pure business logic - no rendering or UI concerns.
 */

import type { WidgetData } from "../types";

/**
 * Represents a single data point in a chart
 */
export interface ChartDataPoint<TTranslationKey extends string = string> {
  /** X-axis value (label or category) */
  x: string;
  /** Y-axis numerical value */
  y: number;
  /** Optional translation key for the label */
  label?: TTranslationKey;
}

/**
 * Represents a series of data points with a name
 */
export interface ChartSeries<TTranslationKey extends string = string> {
  /** Series name/identifier */
  name: string;
  /** Array of data points in this series */
  data: ChartDataPoint<TTranslationKey>[];
  /** Optional color for this series */
  color?: string;
}

/**
 * Result of chart data extraction
 */
export interface ChartData<TTranslationKey extends string = string> {
  /** Chart display type */
  type: "single" | "series" | "pie";
  /** Array of series (single series for "single" type) */
  data: ChartSeries<TTranslationKey>[];
}

/**
 * Safely checks if a value has the structure of a chart data point
 */
function isChartDataPoint(
  item: WidgetData,
): item is Record<string, WidgetData> {
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    return false;
  }

  const obj = item as Record<string, WidgetData>;
  return "y" in obj && typeof obj.y === "number";
}

/**
 * Safely checks if a value has the structure of a chart series
 */
function isChartSeries(item: WidgetData): item is Record<string, WidgetData> {
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    return false;
  }

  const obj = item as Record<string, WidgetData>;
  return (
    "name" in obj &&
    typeof obj.name === "string" &&
    "data" in obj &&
    Array.isArray(obj.data)
  );
}

/**
 * Safely converts a validated object to a ChartDataPoint
 */
function toChartDataPoint<TTranslationKey extends string>(
  item: Record<string, WidgetData>,
): ChartDataPoint<TTranslationKey> | null {
  if (!("y" in item) || typeof item.y !== "number") {
    return null;
  }

  const x = "x" in item ? String(item.x) : "";
  const label =
    "label" in item && item.label !== undefined
      ? (String(item.label) as TTranslationKey)
      : undefined;

  return { x, y: item.y, label };
}

/**
 * Safely converts a validated object to a ChartSeries
 */
function toChartSeries<TTranslationKey extends string>(
  item: Record<string, WidgetData>,
): ChartSeries<TTranslationKey> | null {
  if (
    !("name" in item) ||
    typeof item.name !== "string" ||
    !("data" in item) ||
    !Array.isArray(item.data)
  ) {
    return null;
  }

  const dataPoints: ChartDataPoint<TTranslationKey>[] = [];
  for (const point of item.data) {
    if (isChartDataPoint(point)) {
      const converted = toChartDataPoint<TTranslationKey>(point);
      if (converted) {
        dataPoints.push(converted);
      }
    }
  }

  if (dataPoints.length === 0) {
    return null;
  }

  return {
    name: item.name,
    data: dataPoints,
    color:
      "color" in item && typeof item.color === "string"
        ? item.color
        : undefined,
  };
}

/**
 * Extract and validate chart data from various input formats
 *
 * Supports:
 * - Array of data points: `[{x: "Jan", y: 100}, {x: "Feb", y: 200}]`
 * - Array of series: `[{name: "Series 1", data: [...]}, {name: "Series 2", data: [...]}]`
 * - Object with named series: `{series1: [{x, y}], series2: [{x, y}]}`
 *
 * @param value - Raw widget data to extract chart information from
 * @returns Structured chart data or null if invalid
 */
export function extractChartData<TTranslationKey extends string = string>(
  value: WidgetData,
): ChartData<TTranslationKey> | null {
  if (!value) {
    return null;
  }

  // Array of data points or series
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }

    // Check if it's an array of series
    if (isChartSeries(value[0])) {
      const validSeries: ChartSeries<TTranslationKey>[] = [];
      for (const item of value) {
        if (isChartSeries(item)) {
          const converted = toChartSeries<TTranslationKey>(item);
          if (converted) {
            validSeries.push(converted);
          }
        }
      }

      if (validSeries.length > 0) {
        return { type: "series", data: validSeries };
      }
    }

    // Single series of data points
    const validPoints: ChartDataPoint<TTranslationKey>[] = [];
    for (const item of value) {
      if (isChartDataPoint(item)) {
        const converted = toChartDataPoint<TTranslationKey>(item);
        if (converted) {
          validPoints.push(converted);
        }
      }
    }

    if (validPoints.length > 0) {
      return {
        type: "single",
        data: [{ name: "Value", data: validPoints }],
      };
    }
  }

  // Object with named series: {series1: [...], series2: [...]}
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, WidgetData>;
    const series: ChartSeries<TTranslationKey>[] = [];

    for (const [key, val] of Object.entries(obj)) {
      if (Array.isArray(val)) {
        const validPoints: ChartDataPoint<TTranslationKey>[] = [];
        for (const item of val) {
          if (isChartDataPoint(item)) {
            const converted = toChartDataPoint<TTranslationKey>(item);
            if (converted) {
              validPoints.push(converted);
            }
          }
        }

        if (validPoints.length > 0) {
          series.push({ name: key, data: validPoints });
        }
      }
    }

    if (series.length > 0) {
      return { type: "series", data: series };
    }
  }

  return null;
}
