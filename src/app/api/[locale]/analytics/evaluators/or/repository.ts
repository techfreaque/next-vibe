/**
 * Vibe Sense — OR Evaluator Pure Computation
 * Server-only.
 */

import "server-only";

import type { SignalEvent } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export function computeOr(signals: SignalEvent[][]): SignalEvent[] {
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
