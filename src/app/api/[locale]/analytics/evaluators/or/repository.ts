/**
 * Vibe Sense - OR Evaluator Pure Computation
 * Server-only.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type { SignalEvent } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class OrEvaluatorRepository {
  static computeOr(signals: SignalEvent[][]): SignalEvent[] {
    if (signals.length === 0) {
      return [];
    }
    const tsMap = new Map<number, boolean>();
    for (const series of signals) {
      for (const p of series) {
        const ts = p.timestamp.getTime();
        tsMap.set(ts, (tsMap.get(ts) ?? false) || p.fired);
      }
    }
    return [...tsMap.entries()]
      .toSorted(([a], [b]) => a - b)
      .map(([ts, fired]) => ({ timestamp: new Date(ts), fired }));
  }

  static handle(data: {
    signals: SignalEvent[][];
  }): ResponseType<{ result: SignalEvent[] }> {
    const result = OrEvaluatorRepository.computeOr(data.signals);
    return success({ result });
  }
}
