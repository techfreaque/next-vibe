/**
 * Vibe Sense — Clamp Transformer
 * Clamps series values to [min, max] range.
 */

import type { DataPoint } from "../indicators/types";

export function clampTransform(
  points: DataPoint[],
  min: number,
  max: number,
): DataPoint[] {
  return points.map((p) => ({
    ...p,
    value: Math.min(max, Math.max(min, p.value)),
  }));
}
