/**
 * Vibe Sense - AND Evaluator Pure Computation
 * Server-only.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import type { SignalEvent } from "next-vibe/core/utils/dataflow/shared/fields";

export class AndEvaluatorRepository {
  static computeAnd(signals: SignalEvent[][]): SignalEvent[] {
    if (signals.length === 0) {
      return [];
    }
    const tsMap = new Map<number, boolean[]>();
    for (const series of signals) {
      for (const p of series) {
        const ts = p.timestamp.getTime();
        const existing = tsMap.get(ts) ?? [];
        existing.push(p.fired);
        tsMap.set(ts, existing);
      }
    }
    return [...tsMap.entries()]
      .toSorted(([a], [b]) => a - b)
      .map(([ts, firedStates]) => ({
        timestamp: new Date(ts),
        fired:
          firedStates.length === signals.length && firedStates.every(Boolean),
      }));
  }

  static handle(data: {
    signals: SignalEvent[][];
  }): ResponseType<{ result: SignalEvent[] }> {
    const result = AndEvaluatorRepository.computeAnd(data.signals);
    return success({ result });
  }
}
