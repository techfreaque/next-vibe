/**
 * Vibe Sense — AND Evaluator Pure Computation
 * Server-only.
 */

import "server-only";

import type { SignalEvent } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export function computeAnd(signals: SignalEvent[][]): SignalEvent[] {
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
