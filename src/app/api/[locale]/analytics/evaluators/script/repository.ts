/**
 * Vibe Sense — Script Evaluator Pure Computation
 * Server-only. Admin-only sandboxed custom evaluation.
 */

import "server-only";

import type {
  SignalEvent,
  TimeSeries,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export function computeScript(source: TimeSeries, fn: string): SignalEvent[] {
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
      .map(
        (item): SignalEvent => ({
          timestamp:
            item.timestamp instanceof Date
              ? item.timestamp
              : new Date(item.timestamp),
          fired: item.fired,
        }),
      );
  } catch {
    return [];
  }
}
