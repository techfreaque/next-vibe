/**
 * Vibe Sense - Script Evaluator Pure Computation
 * Server-only. Admin-only sandboxed custom evaluation.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import type { SignalEvent, TimeSeries } from "next-vibe/dataflow/shared/fields";

export class ScriptEvaluatorRepository {
  static computeScript(source: TimeSeries, fn: string): SignalEvent[] {
    try {
      // eslint-disable-next-line no-new-func
      const scriptFn = new Function(
        "inputs",
        `"use strict";
      const fn = ${fn};
      return fn(inputs);`,
      );
      const result: Array<{ timestamp: Date | string; fired: boolean }> =
        scriptFn(source);
      if (!Array.isArray(result)) {
        return [];
      }
      return result
        .filter(
          (item): item is { timestamp: Date | string; fired: boolean } =>
            item !== null &&
            typeof item === "object" &&
            "timestamp" in item &&
            "fired" in item &&
            typeof item.fired === "boolean",
        )
        .map((item): SignalEvent => ({
          timestamp:
            item.timestamp instanceof Date
              ? item.timestamp
              : new Date(item.timestamp),
          fired: item.fired,
        }));
    } catch {
      return [];
    }
  }

  static handle(data: {
    source: TimeSeries;
    fn: string;
  }): ResponseType<{ signals: SignalEvent[] }> {
    const signals = ScriptEvaluatorRepository.computeScript(
      data.source,
      data.fn,
    );
    return success({ signals });
  }
}
