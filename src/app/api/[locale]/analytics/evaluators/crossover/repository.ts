/**
 * Vibe Sense - Crossover Evaluator Pure Computation
 * Server-only.
 */

import "server-only";

import type {
  SignalEvent,
  TimeSeries,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class CrossoverEvaluatorRepository {
  static computeCrossover(
    seriesA: TimeSeries,
    seriesB: TimeSeries,
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
}
