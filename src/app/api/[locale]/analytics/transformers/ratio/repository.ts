/**
 * Vibe Sense - Ratio Transformer Compute
 * Server-only pure computation. No DB access.
 * Divides series A by series B, aligned by timestamp.
 */

import "server-only";


import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { GraphResolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/enum";
import { GraphResolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/enum";
import { success } from "next-vibe/shared/types/response.schema";

import type {
  DataPoint,
  Resolution,
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

  static handle(data: {
    a: TimeSeries;
    b: TimeSeries;
    resolution?: Resolution | null;
    lookback?: number | null;
  }): ResponseType<{
    result: TimeSeries;
    meta: { actualResolution: Resolution; lookbackUsed: number };
  }> {
    const result = RatioTransformerRepository.computeRatio(data.a, data.b);
    return success({
      result,
      meta: {
        actualResolution: data.resolution ?? GraphResolution.ONE_DAY,
        lookbackUsed: data.lookback ?? 0,
      },
    });
  }
}
