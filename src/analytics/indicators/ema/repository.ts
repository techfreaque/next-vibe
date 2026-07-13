/**
 * Vibe Sense - EMA Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { GraphResolution } from "next-vibe/dataflow/enum";
import type { Resolution, TimeSeries } from "next-vibe/dataflow/shared/fields";

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

  static handle(data: {
    source: TimeSeries;
    period: number;
    resolution?: Resolution | null;
    lookback?: number | null;
  }): ResponseType<{
    result: TimeSeries;
    meta: { actualResolution: Resolution; lookbackUsed: number };
  }> {
    const result = EmaIndicatorRepository.computeEma(data.source, data.period);
    return success({
      result,
      meta: {
        actualResolution: data.resolution ?? GraphResolution.ONE_DAY,
        lookbackUsed: data.lookback ?? 0,
      },
    });
  }
}
