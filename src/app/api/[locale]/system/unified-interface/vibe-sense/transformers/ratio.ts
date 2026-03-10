/**
 * Vibe Sense — Ratio Transformer
 * Computes ratio of series A / series B, time-aligned by timestamp.
 */

import type { DataPoint } from "../indicators/types";

export function ratioTransform(a: DataPoint[], b: DataPoint[]): DataPoint[] {
  const bMap = new Map<number, number>();
  for (const p of b) {
    bMap.set(p.timestamp.getTime(), p.value);
  }

  return a
    .map((p) => {
      const bVal = bMap.get(p.timestamp.getTime());
      if (bVal === undefined || bVal === 0) {
        return null;
      }
      return { timestamp: p.timestamp, value: p.value / bVal };
    })
    .filter((p): p is DataPoint => p !== null);
}
