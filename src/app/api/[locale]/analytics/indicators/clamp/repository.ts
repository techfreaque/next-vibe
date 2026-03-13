/**
 * Vibe Sense — Clamp Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import type { TimeSeries } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

/**
 * Clamp each value in the series to [min, max].
 */
export function computeClamp(
  points: TimeSeries,
  min: number,
  max: number,
): TimeSeries {
  return points.map((p) => ({
    timestamp: p.timestamp,
    value: Math.min(max, Math.max(min, p.value)),
  }));
}
