/**
 * Vibe Sense — Window Minimum Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import type { TimeSeries } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

/**
 * Compute rolling window minimum over a fixed window size.
 */
export function computeWindowMin(points: TimeSeries, size: number): TimeSeries {
  if (size <= 0 || points.length === 0) {
    return points;
  }
  return points.map((point, i) => {
    const start = Math.max(0, i - size + 1);
    const window = points.slice(start, i + 1).map((p) => p.value);
    return {
      timestamp: point.timestamp,
      value: Math.min(...window),
    };
  });
}
