/**
 * Vibe Sense — Merge Transformer
 * Merges two time series by timestamp, summing values at matching timestamps.
 * Missing timestamps in one series are filled with 0.
 */

import type { DataPoint } from "../indicators/types";

export function mergeTransform(a: DataPoint[], b: DataPoint[]): DataPoint[] {
  const merged = new Map<number, number>();

  for (const p of a) {
    merged.set(
      p.timestamp.getTime(),
      (merged.get(p.timestamp.getTime()) ?? 0) + p.value,
    );
  }
  for (const p of b) {
    merged.set(
      p.timestamp.getTime(),
      (merged.get(p.timestamp.getTime()) ?? 0) + p.value,
    );
  }

  return [...merged.entries()]
    .toSorted(([tsA], [tsB]) => tsA - tsB)
    .map(([ts, value]) => ({ timestamp: new Date(ts), value }));
}
