/**
 * Vibe Sense — RSI Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import type { TimeSeries } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class RsiIndicatorRepository {
  /**
   * Compute Relative Strength Index using Wilder smoothing.
   * Returns values starting from index `period` (lookback = period bars).
   */
  static computeRsi(points: TimeSeries, period: number): TimeSeries {
    if (points.length < 2) {
      return [];
    }

    const result: TimeSeries = [];

    let avgGain = 0;
    let avgLoss = 0;

    // Seed with first `period` changes
    for (let i = 1; i <= period && i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      if (!prev || !curr) {
        continue;
      }
      const change = curr.value - prev.value;
      if (change >= 0) {
        avgGain += change / period;
      } else {
        avgLoss += -change / period;
      }
    }

    // Emit RSI starting from index `period`
    for (let i = period; i < points.length; i++) {
      const p = points[i];
      if (!p) {
        continue;
      }

      if (i > period) {
        const prev = points[i - 1];
        if (!prev) {
          continue;
        }
        const change = p.value - prev.value;
        const gain = change >= 0 ? change : 0;
        const loss = change < 0 ? -change : 0;
        // Wilder smoothing
        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
      }

      const rs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
      const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
      result.push({ timestamp: p.timestamp, value: rsi });
    }

    return result;
  }
}
