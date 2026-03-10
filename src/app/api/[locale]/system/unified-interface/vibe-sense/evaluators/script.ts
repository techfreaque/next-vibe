/**
 * Vibe Sense — Script Evaluator
 *
 * Sandboxed Bun eval for admin-only custom evaluations.
 * Takes variadic series inputs, produces boolean signals.
 */

import type { DataPoint } from "../indicators/types";
import type { SignalEvent } from "../store/signals";

/**
 * Execute a user-provided evaluator script.
 * The script receives arrays of DataPoint[] and must return SignalEvent[].
 *
 * Security: Only admin users can create script nodes.
 *
 * @param inputs - Input series arrays
 * @param fn - Function body, e.g. "(series) => series[0].map(p => ({ timestamp: p.timestamp, fired: p.value < series[1][0]?.value }))"
 */
export function scriptEvaluate(
  inputs: DataPoint[][],
  fn: string,
): SignalEvent[] {
  try {
    // Create a sandboxed function
    // eslint-disable-next-line no-new-func
    const scriptFn = new Function(
      "inputs",
      `"use strict";
      const fn = ${fn};
      return fn(inputs);`,
    );

    const result: Array<{ timestamp: Date | string; fired: boolean }> =
      scriptFn(inputs);

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
      .map((item) => ({
        timestamp:
          item.timestamp instanceof Date
            ? item.timestamp
            : new Date(item.timestamp),
        fired: item.fired,
      }));
  } catch {
    // Script errors are non-fatal — return empty signals
    return [];
  }
}
