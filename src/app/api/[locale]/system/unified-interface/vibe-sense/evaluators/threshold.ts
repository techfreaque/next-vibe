/**
 * Vibe Sense — Threshold Evaluator
 * Fires when series value crosses a fixed threshold.
 */

import type { DataPoint } from "../indicators/types";
import type { SignalEvent } from "../store/signals";

export type ThresholdOp = ">" | "<" | ">=" | "<=" | "==";

/**
 * Evaluate a threshold condition against a series.
 * Returns a signal event for each data point.
 */
export function thresholdEvaluate(
  points: DataPoint[],
  op: ThresholdOp,
  value: number,
): SignalEvent[] {
  return points.map((p) => {
    let fired: boolean;
    switch (op) {
      case ">":
        fired = p.value > value;
        break;
      case "<":
        fired = p.value < value;
        break;
      case ">=":
        fired = p.value >= value;
        break;
      case "<=":
        fired = p.value <= value;
        break;
      case "==":
        fired = p.value === value;
        break;
      default:
        fired = false;
    }
    return {
      timestamp: p.timestamp,
      fired,
      meta: { op, threshold: value, actual: p.value },
    };
  });
}
