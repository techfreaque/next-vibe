/**
 * Vibe Sense - Window Average Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import type { TimeSeries } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class WindowAvgIndicatorRepository {
  /**
   * Compute rolling window average over a fixed window size.
   */
  static computeWindowAvg(points: TimeSeries, size: number): TimeSeries {
    if (size <= 0 || points.length === 0) {
      return points;
    }
    return points.map((point, i) => {
      const start = Math.max(0, i - size + 1);
      const window = points.slice(start, i + 1).map((p) => p.value);
      const value = window.reduce((a, b) => a + b, 0) / window.length;
      return { timestamp: point.timestamp, value };
    });
  }
}
