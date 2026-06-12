/**
 * Vibe Sense - Delta Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import { GraphResolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/enum";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type {
  Resolution,
  TimeSeries,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

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

  static handle(data: {
    source: TimeSeries;
    resolution?: Resolution | null;
    lookback?: number | null;
  }): ResponseType<{
    result: TimeSeries;
    meta: { actualResolution: Resolution; lookbackUsed: number };
  }> {
    const result = DeltaIndicatorRepository.computeDelta(data.source);
    return success({
      result,
      meta: {
        actualResolution: data.resolution ?? GraphResolution.ONE_DAY,
        lookbackUsed: data.lookback ?? 0,
      },
    });
  }
}
