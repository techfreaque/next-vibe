/**
 * Vibe Sense — Delta Transformer
 * Period-over-period change (value[i] - value[i-1]).
 */

import type { DataPoint } from "../indicators/types";

export function deltaTransform(points: DataPoint[]): DataPoint[] {
  if (points.length < 2) {
    return [];
  }
  return points.slice(1).map((p, i) => ({
    timestamp: p.timestamp,
    value: p.value - points[i]!.value,
  }));
}
