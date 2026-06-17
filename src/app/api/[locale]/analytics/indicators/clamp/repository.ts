/**
 * Vibe Sense - Clamp Compute
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

export class ClampIndicatorRepository {
  /**
   * Clamp each value in the series to [min, max].
   */
  static computeClamp(
    points: TimeSeries,
    min: number,
    max: number,
  ): TimeSeries {
    return points.map((p) => ({
      timestamp: p.timestamp,
      value: Math.min(max, Math.max(min, p.value)),
    }));
  }

  static handle(data: {
    source: TimeSeries;
    min: number;
    max: number;
    resolution?: Resolution | null;
    lookback?: number | null;
  }): ResponseType<{
    result: TimeSeries;
    meta: { actualResolution: Resolution; lookbackUsed: number };
  }> {
    const result = ClampIndicatorRepository.computeClamp(
      data.source,
      data.min,
      data.max,
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
