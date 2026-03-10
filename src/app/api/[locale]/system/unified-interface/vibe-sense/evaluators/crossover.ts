/**
 * Vibe Sense — Crossover Evaluator
 * Fires when series A crosses above series B (A goes from below to above B).
 */

import type { DataPoint } from "../indicators/types";
import type { SignalEvent } from "../store/signals";

/**
 * Detect crossover events — series A crosses above series B.
 * Both series must be aligned by timestamp.
 */
export function crossoverEvaluate(
  seriesA: DataPoint[],
  seriesB: DataPoint[],
): SignalEvent[] {
  const bMap = new Map<number, number>();
  for (const p of seriesB) {
    bMap.set(p.timestamp.getTime(), p.value);
  }

  const signals: SignalEvent[] = [];
  let prevAAboveB: boolean | null = null;

  for (const p of seriesA) {
    const bVal = bMap.get(p.timestamp.getTime());
    if (bVal === undefined) {
      continue;
    }
    const aAboveB = p.value > bVal;
    // Crossover fires on transition from below to above
    const fired = prevAAboveB === false && aAboveB;
    signals.push({
      timestamp: p.timestamp,
      fired,
      meta: { a: p.value, b: bVal },
    });
    prevAAboveB = aAboveB;
  }

  return signals;
}
