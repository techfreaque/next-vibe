/**
 * Vibe Sense - Delta Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import type { TimeSeries } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class DeltaIndicatorRepository {
  /**
   * Compute the difference between consecutive values.
   * Returns a series of length n-1 (first point is consumed).
   */
  static computeDelta(points: TimeSeries): TimeSeries {
    if (points.length < 2) {
      return [];
    }
    return points.slice(1).map((p, i): TimeSeries[number] => ({
      timestamp: p.timestamp,
      value: p.value - points[i]!.value,
    }));
  }
}
