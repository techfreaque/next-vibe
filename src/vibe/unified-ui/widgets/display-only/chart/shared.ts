/**
 * Chart Widget Shared Logic
 *
 * Provides type-safe extraction for chart data.
 * Supports multiple chart formats:
 * - Single series: Array of data points
 * - Multiple series: Array of series objects or object with named series
 * - Pie/Donut: Array of data points with x/y values
 *
 * Pure business logic - no rendering or UI concerns.
 */

import type { z } from "zod";

import type {
  ChartDataPointSchema,
  ChartSeriesSchema,
  ChartWidgetSchema,
} from "./types";

/**
 * Represents a single data point in a chart
 */
export type ChartDataPoint = z.output<typeof ChartDataPointSchema>;

/**
 * Represents a series of data points with a name
 */
export type ChartSeries = z.output<typeof ChartSeriesSchema>;

/**
 * Result of chart data extraction
 */
export interface ChartData {
  /** Chart display type */
  type: "single" | "series" | "pie";
  /** Array of series (single series for "single" type) */
  data: ChartSeries[];
}

function isSeriesArray(
  value: ChartDataPoint[] | ChartSeries[],
): value is ChartSeries[] {
  return value.length > 0 && "data" in value[0];
}

/**
 * Extract chart data from schema-validated input
 *
 * Supports:
 * - Array of data points: `[{x: "Jan", y: 100}, {x: "Feb", y: 200}]`
 * - Array of series: `[{name: "Series 1", data: [...]}, {name: "Series 2", data: [...]}]`
 * - Record of named series: `{series1: [{x, y}], series2: [{x, y}]}`
 *
 * @param value - Schema-validated chart data
 * @returns Structured chart data or null if empty
 */
export function extractChartData(
  value: z.output<ChartWidgetSchema> | undefined,
): ChartData | null {
  if (!value) {
    return null;
  }

  // Array format
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null;
    }

    // Check if it's an array of series
    if (isSeriesArray(value)) {
      return {
        type: "series",
        data: value,
      };
    }

    return {
      type: "single",
      data: [
        {
          name: "Value",
          data: value,
        },
      ],
    };
  }

  // Record format: {series1: [...], series2: [...]}
  const series: ChartSeries[] = Object.entries(value).map(
    ([key, dataPoints]) => ({
      name: key,
      data: dataPoints,
    }),
  );

  return series.length > 0 ? { type: "series", data: series } : null;
}
