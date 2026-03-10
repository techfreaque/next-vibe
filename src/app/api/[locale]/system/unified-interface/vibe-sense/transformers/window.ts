/**
 * Vibe Sense — Window Transformer
 * Rolling window aggregation over a time series.
 */

import type { DataPoint } from "../indicators/types";

export type WindowFn = "avg" | "sum" | "min" | "max";

/**
 * Apply a rolling window of N periods to a series.
 * Output has same length as input — first N-1 points use a partial window.
 */
export function windowTransform(
  points: DataPoint[],
  size: number,
  fn: WindowFn = "avg",
): DataPoint[] {
  if (size <= 0 || points.length === 0) {
    return points;
  }

  return points.map((point, i) => {
    const start = Math.max(0, i - size + 1);
    const window = points.slice(start, i + 1).map((p) => p.value);
    let value: number;
    switch (fn) {
      case "sum":
        value = window.reduce((a, b) => a + b, 0);
        break;
      case "min":
        value = Math.min(...window);
        break;
      case "max":
        value = Math.max(...window);
        break;
      case "avg":
      default:
        value = window.reduce((a, b) => a + b, 0) / window.length;
        break;
    }
    return { timestamp: point.timestamp, value, meta: point.meta };
  });
}
