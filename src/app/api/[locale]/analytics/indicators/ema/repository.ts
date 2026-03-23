/**
 * Vibe Sense - EMA Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import type { TimeSeries } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class EmaIndicatorRepository {
  /**
   * Compute Exponential Moving Average.
   * Weights recent prices more heavily using multiplier k = 2 / (period + 1).
   */
  static computeEma(points: TimeSeries, period: number): TimeSeries {
    if (points.length === 0) {
      return [];
    }

    const k = 2 / (period + 1);
    const result: TimeSeries = [];

    let ema: number | undefined;

    for (const p of points) {
      if (ema === undefined) {
        ema = p.value;
      } else {
        ema = p.value * k + ema * (1 - k);
      }
      result.push({ timestamp: p.timestamp, value: ema });
    }

    return result;
  }
}
