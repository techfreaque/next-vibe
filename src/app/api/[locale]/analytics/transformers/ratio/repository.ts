/**
 * Vibe Sense - Ratio Transformer Compute
 * Server-only pure computation. No DB access.
 * Divides series A by series B, aligned by timestamp.
 */

import "server-only";

import type {
  DataPoint,
  TimeSeries,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class RatioTransformerRepository {
  /**
   * Compute ratio time series: A / B, aligned by timestamp.
   * Points where B is zero or missing are excluded from the result.
   */
  static computeRatio(a: TimeSeries, b: TimeSeries): TimeSeries {
    const bMap = new Map<number, number>();
    for (const p of b) {
      bMap.set(p.timestamp.getTime(), p.value);
    }

    return a.map((p): DataPoint => {
      const bVal = bMap.get(p.timestamp.getTime());
      if (bVal === undefined || bVal === 0) {
        return { timestamp: p.timestamp, value: 0 };
      }
      return { timestamp: p.timestamp, value: p.value / bVal };
    });
  }
}
