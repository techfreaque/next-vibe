/**
 * Vibe Sense - Script Transformer Compute
 * Server-only pure computation. No DB access.
 * Executes a sandboxed user-supplied function over a time series.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { GraphResolution } from "next-vibe/dataflow/enum";
import type {
  DataPoint,
  Resolution,
  TimeSeries,
} from "next-vibe/dataflow/shared/fields";

export class ScriptTransformerRepository {
  /**
   * Execute a user-supplied script function over a time series.
   *
   * The fn string receives `points: TimeSeries` and must return
   * `{timestamp: Date | string, value: number}[]`.
   *
   * Returns empty array if the script throws or returns invalid data.
   */
  static computeScript(points: TimeSeries, fn: string): TimeSeries {
    try {
      // eslint-disable-next-line no-new-func
      const scriptFn = new Function(
        "points",
        `"use strict";
      const fn = ${fn};
      return fn(points);`,
      );
      const result: Array<{ timestamp: Date | string; value: number }> =
        scriptFn(points);
      if (!Array.isArray(result)) {
        return [];
      }
      return result
        .filter(
          (item): item is { timestamp: Date | string; value: number } =>
            item !== null &&
            typeof item === "object" &&
            "timestamp" in item &&
            "value" in item &&
            typeof item.value === "number",
        )
        .map((item): DataPoint => ({
          timestamp:
            item.timestamp instanceof Date
              ? item.timestamp
              : new Date(item.timestamp),
          value: item.value,
        }));
    } catch {
      return [];
    }
  }

  static handle(data: {
    source: TimeSeries;
    fn: string;
    resolution?: Resolution | null;
    lookback?: number | null;
  }): ResponseType<{
    result: TimeSeries;
    meta: { actualResolution: Resolution; lookbackUsed: number };
  }> {
    const result = ScriptTransformerRepository.computeScript(
      data.source,
      data.fn,
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
