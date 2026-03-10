/**
 * Vibe Sense — JSON Path Transformer
 *
 * Deep field extraction from any JSON structure using dot-notation paths.
 * Key glue between endpoint responses and downstream numeric series.
 */

import type { DataPoint } from "../indicators/types";

/**
 * Extract a value from a structured object using a dot-notation path.
 * Returns a single-point series with the extracted numeric value.
 *
 * @param data - Source data (typically an endpoint response stored as DataPoint meta)
 * @param path - Dot-notation path (e.g. "data.stats.total", "items.0.count")
 */
export function jsonPathTransform(
  series: DataPoint[],
  path: string,
): DataPoint[] {
  const parts = path.split(".");

  return series
    .map((point) => {
      // The structured data lives in the meta field (flat Record)
      const meta = point.meta;
      if (!meta) {
        // Fall back to treating value as the extraction target
        return point;
      }

      // For flat meta, use the full path as a key first
      const flatKey = parts.join(".");
      const directValue = meta[flatKey];
      if (directValue !== undefined) {
        if (typeof directValue === "number") {
          return { timestamp: point.timestamp, value: directValue };
        }
        if (typeof directValue === "string") {
          const parsed = parseFloat(directValue);
          if (!isNaN(parsed)) {
            return { timestamp: point.timestamp, value: parsed };
          }
        }
        return null;
      }

      // For single-part paths, do a direct lookup
      if (parts.length === 1) {
        const val = meta[parts[0] ?? ""];
        if (typeof val === "number") {
          return { timestamp: point.timestamp, value: val };
        }
        if (typeof val === "string") {
          const parsed = parseFloat(val);
          if (!isNaN(parsed)) {
            return { timestamp: point.timestamp, value: parsed };
          }
        }
      }

      return null;
    })
    .filter((p): p is DataPoint => p !== null);
}
