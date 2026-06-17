/**
 * Vibe Sense - Window Sum Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { GraphResolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/enum";
import type {
  Resolution,
  TimeSeries,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

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
      const window = points.slice(start, i + 1).map((p) => p.value);
      const value = window.reduce((a, b) => a + b, 0);
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
