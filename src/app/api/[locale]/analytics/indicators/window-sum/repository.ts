/**
 * Vibe Sense - Window Sum Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { GraphResolution } from "next-vibe/core/utils/dataflow/enum";
import type {
  Resolution,
  TimeSeries,
} from "next-vibe/core/utils/dataflow/shared/fields";

export class WindowSumIndicatorRepository {
  /**
   * Compute rolling window sum over a fixed window size.
   */
  static computeWindowSum(points: TimeSeries, size: number): TimeSeries {
    if (size <= 0 || points.length === 0) {
      return points;
    }
    return points.map((point, i) => {
      const start = Math.max(0, i - size + 1);
      const dataWindow = points.slice(start, i + 1).map((p) => p.value);
      const value = dataWindow.reduce((a, b) => a + b, 0);
      return { timestamp: point.timestamp, value };
    });
  }

  static handle(data: {
    source: TimeSeries;
    size: number;
    resolution?: Resolution | null;
    lookback?: number | null;
  }): ResponseType<{
    result: TimeSeries;
    meta: { actualResolution: Resolution; lookbackUsed: number };
  }> {
    const result = WindowSumIndicatorRepository.computeWindowSum(
      data.source,
      data.size,
    );
    return success({
      result,
      meta: {
        actualResolution: data.resolution ?? GraphResolution.ONE_DAY,
        lookbackUsed: data.lookback ?? 0,
      },
    });
  }
}
