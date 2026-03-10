/**
 * Vibe Sense — Range Arithmetic
 *
 * The engine owns all range decisions. Indicators are passive — they always
 * receive an explicit TimeRange. This module handles:
 * - Lookback accumulation through derived node chains
 * - Range extension upstream
 * - Trimming computed output back to requested range
 */

import type { DataPoint, Resolution, TimeRange } from "./types";
import { RESOLUTION_MS } from "./types";

/**
 * Extend a range backward by N resolution periods.
 * Used to fetch enough upstream data to satisfy a derived node's lookback.
 *
 * Example: range [2024-01-08, 2024-01-31], lookback 7, resolution "1d"
 * → extended range [2024-01-01, 2024-01-31]
 */
export function extendRangeByLookback(
  range: TimeRange,
  lookback: number,
  resolution: Resolution,
): TimeRange {
  if (lookback <= 0) {
    return range;
  }
  const periodMs = RESOLUTION_MS[resolution];
  return {
    from: new Date(range.from.getTime() - lookback * periodMs),
    to: range.to,
  };
}

/**
 * Trim a series to only include points within the requested range (inclusive).
 * Called after derived computation to strip the lookback prefix.
 */
export function trimSeries(points: DataPoint[], range: TimeRange): DataPoint[] {
  return points.filter(
    (p) => p.timestamp >= range.from && p.timestamp <= range.to,
  );
}

/**
 * Scale up (coarsen) a series from a finer resolution to a coarser one.
 * Aggregates points into target resolution buckets using the given function.
 * Value within each bucket is the aggregate of all source points in that bucket.
 *
 * Scaling down (fine → coarse) is the only direction allowed.
 * Callers must ensure sourceResolution is finer than targetResolution.
 */
export function scaleUpSeries(
  points: DataPoint[],
  sourceResolution: Resolution,
  targetResolution: Resolution,
  fn: "avg" | "sum" | "min" | "max" | "last" | "first" = "avg",
): DataPoint[] {
  const sourcePeriod = RESOLUTION_MS[sourceResolution];
  const targetPeriod = RESOLUTION_MS[targetResolution];

  if (targetPeriod <= sourcePeriod) {
    // Already at target resolution or finer — return as-is
    return points;
  }

  // Group points into target-resolution buckets
  const buckets = new Map<number, number[]>();

  for (const point of points) {
    const bucketKey =
      Math.floor(point.timestamp.getTime() / targetPeriod) * targetPeriod;
    const existing = buckets.get(bucketKey);
    if (existing) {
      existing.push(point.value);
    } else {
      buckets.set(bucketKey, [point.value]);
    }
  }

  // Aggregate each bucket
  const result: DataPoint[] = [];
  for (const [bucketTs, values] of buckets) {
    if (values.length === 0) {
      continue;
    }
    let value: number;
    switch (fn) {
      case "sum":
        value = values.reduce((a, b) => a + b, 0);
        break;
      case "min":
        value = Math.min(...values);
        break;
      case "max":
        value = Math.max(...values);
        break;
      case "last":
        value = values[values.length - 1]!;
        break;
      case "first":
        value = values[0]!;
        break;
      case "avg":
      default:
        value = values.reduce((a, b) => a + b, 0) / values.length;
        break;
    }
    result.push({ timestamp: new Date(bucketTs), value });
  }

  return result.toSorted(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );
}

/**
 * Check if sourceResolution is finer (smaller period) than targetResolution.
 * Returns true if scaling up is needed.
 */
export function needsScaleUp(
  sourceResolution: Resolution,
  targetResolution: Resolution,
): boolean {
  return RESOLUTION_MS[sourceResolution] < RESOLUTION_MS[targetResolution];
}

/**
 * Check if a resolution is valid as input to a derived node with target resolution.
 * Derived nodes cannot have finer resolution than their inputs.
 */
export function isResolutionCompatible(
  inputResolution: Resolution,
  derivedResolution: Resolution,
): boolean {
  return RESOLUTION_MS[derivedResolution] >= RESOLUTION_MS[inputResolution];
}

/**
 * Accumulate total lookback periods needed for a node chain.
 * Walks upstream through derived nodes, summing lookbacks at each step.
 * Returns the total number of periods to extend the fetch range by.
 *
 * Used by the engine to determine how far back to fetch source data.
 */
export function accumulateLookback(
  nodeIds: string[],
  getLookback: (nodeId: string) => number,
  getInputs: (nodeId: string) => string[],
  visited: Set<string> = new Set(),
): number {
  let total = 0;
  for (const nodeId of nodeIds) {
    if (visited.has(nodeId)) {
      continue;
    }
    visited.add(nodeId);
    const own = getLookback(nodeId);
    const inputIds = getInputs(nodeId);
    const upstreamLookback = accumulateLookback(
      inputIds,
      getLookback,
      getInputs,
      visited,
    );
    total = Math.max(total, own + upstreamLookback);
  }
  return total;
}
