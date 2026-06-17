/**
 * Vibe Sense - Window Minimum Compute
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

export class WindowMinIndicatorRepository {
  /**
   * Compute rolling window minimum over a fixed window size.
   */
  static computeWindowMin(points: TimeSeries, size: number): TimeSeries {
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

  static handle(data: {
    source: TimeSeries;
    size: number;
    resolution?: Resolution | null;
    lookback?: number | null;
  }): ResponseType<{
    result: TimeSeries;
    meta: { actualResolution: Resolution; lookbackUsed: number };
  }> {
    const result = WindowMinIndicatorRepository.computeWindowMin(
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
