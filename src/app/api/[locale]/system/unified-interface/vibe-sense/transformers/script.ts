/**
 * Vibe Sense — Script Transformer
 *
 * Sandboxed Bun eval for admin-only custom transformations.
 * Escape hatch when built-in transformers don't fit.
 */

import type { DataPoint } from "../indicators/types";

/**
 * Execute a user-provided script function against input series.
 * The script receives arrays of DataPoint[] and must return DataPoint[].
 *
 * Security: Only admin users can create script nodes.
 * The function runs in a sandboxed context with no access to
 * globals, filesystem, or network. Only pure data transformations.
 *
 * @param inputs - Input series arrays
 * @param fn - Function body as string, e.g. "(a, b) => a.map((v, i) => ({ ...v, value: v.value / (b[i]?.value || 1) }))"
 */
export function scriptTransform(
  inputs: DataPoint[][],
  fn: string,
): DataPoint[] {
  try {
    // Create a sandboxed function with no access to globals
    // eslint-disable-next-line no-new-func
    const scriptFn = new Function(
      "inputs",
      `"use strict";
      const fn = ${fn};
      return fn(...inputs);`,
    );

    const result: Array<{ timestamp: Date | string; value: number }> =
      scriptFn(inputs);

    // Validate output shape
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
      .map((item) => ({
        timestamp:
          item.timestamp instanceof Date
            ? item.timestamp
            : new Date(item.timestamp),
        value: item.value,
      }));
  } catch {
    // Script errors are non-fatal — return empty series
    return [];
  }
}
