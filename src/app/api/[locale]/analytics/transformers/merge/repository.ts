/**
 * Vibe Sense - Merge Transformer Compute
 * Server-only pure computation. No DB access.
 * Sums two time series aligned by timestamp.
 */

import "server-only";

import { GraphResolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/enum";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type {
  Resolution,
  TimeSeries,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class MergeTransformerRepository {
  /**
   * Compute merged (summed) time series from two inputs aligned by timestamp.
   * Points with matching timestamps are summed; non-matching timestamps are included independently.
   */
  static computeMerge(a: TimeSeries, b: TimeSeries): TimeSeries {
    const merged = new Map<number, number>();

    for (const p of a) {
      merged.set(
        p.timestamp.getTime(),
        (merged.get(p.timestamp.getTime()) ?? 0) + p.value,
      );
    }
    for (const p of b) {
      merged.set(
        p.timestamp.getTime(),
        (merged.get(p.timestamp.getTime()) ?? 0) + p.value,
      );
    }

    return [...merged.entries()]
      .toSorted(([tsA], [tsB]) => tsA - tsB)
      .map(([ts, value]) => ({ timestamp: new Date(ts), value }));
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
    const result = MergeTransformerRepository.computeMerge(data.a, data.b);
    return success({
      result,
      meta: {
        actualResolution: data.resolution ?? GraphResolution.ONE_DAY,
        lookbackUsed: data.lookback ?? 0,
      },
    });
  }
}
