/**
 * Vibe Sense — Merge Transformer Compute
 * Server-only pure computation. No DB access.
 * Sums two time series aligned by timestamp.
 */

import "server-only";

import type { TimeSeries } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

/**
 * Compute merged (summed) time series from two inputs aligned by timestamp.
 * Points with matching timestamps are summed; non-matching timestamps are included independently.
 */
export function computeMerge(a: TimeSeries, b: TimeSeries): TimeSeries {
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
