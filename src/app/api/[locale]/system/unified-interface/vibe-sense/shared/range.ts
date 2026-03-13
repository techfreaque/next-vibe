/**
 * Vibe Sense — Range Arithmetic
 *
 * Handles time series range extension, trimming, and resolution scaling.
 */

import type { DataPoint, Resolution, TimeRange } from "./fields";
import { RESOLUTION_MS } from "./fields";

/**
 * Extend a range backward by N resolution periods.
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
 */
export function trimSeries(points: DataPoint[], range: TimeRange): DataPoint[] {
  return points.filter(
    (p) => p.timestamp >= range.from && p.timestamp <= range.to,
  );
}

/**
 * Scale up (coarsen) a series from a finer resolution to a coarser one.
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
    return points;
  }

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
 * Scale down (refine) a series from a coarser resolution to a finer one.
 * Uses forward-fill (step function).
 */
export function scaleDownSeries(
  points: DataPoint[],
  sourceResolution: Resolution,
  targetResolution: Resolution,
  range: TimeRange,
): DataPoint[] {
  const targetPeriod = RESOLUTION_MS[targetResolution];
  const sourcePeriod = RESOLUTION_MS[sourceResolution];

  if (targetPeriod >= sourcePeriod) {
    return points;
  }

  const alignedFrom =
    Math.floor(range.from.getTime() / targetPeriod) * targetPeriod;
  const alignedTo =
    Math.floor(range.to.getTime() / targetPeriod) * targetPeriod;

  const sorted = [...points].toSorted(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );

  const result: DataPoint[] = [];
  let sourceIdx = 0;
  let lastPoint: DataPoint | null = null;

  for (let ts = alignedFrom; ts <= alignedTo; ts += targetPeriod) {
    while (
      sourceIdx < sorted.length &&
      sorted[sourceIdx]!.timestamp.getTime() <= ts
    ) {
      lastPoint = sorted[sourceIdx]!;
      sourceIdx++;
    }

    if (lastPoint !== null) {
      result.push({ timestamp: new Date(ts), value: lastPoint.value });
    }
  }

  return result;
}

/**
 * Check if sourceResolution is finer than targetResolution.
 */
export function needsScaleUp(
  sourceResolution: Resolution,
  targetResolution: Resolution,
): boolean {
  return RESOLUTION_MS[sourceResolution] < RESOLUTION_MS[targetResolution];
}

/**
 * Check if sourceResolution is coarser than targetResolution.
 */
export function needsScaleDown(
  sourceResolution: Resolution,
  targetResolution: Resolution,
): boolean {
  return RESOLUTION_MS[sourceResolution] > RESOLUTION_MS[targetResolution];
}

/**
 * Fill gaps in a sparse time series with zero-valued datapoints.
 */
export function fillGaps(
  points: DataPoint[],
  range: TimeRange,
  resolution: Resolution,
): DataPoint[] {
  const periodMs = RESOLUTION_MS[resolution];
  const existing = new Map<number, DataPoint>();
  for (const p of points) {
    existing.set(p.timestamp.getTime(), p);
  }

  const alignedFrom = Math.floor(range.from.getTime() / periodMs) * periodMs;
  const alignedTo = Math.floor(range.to.getTime() / periodMs) * periodMs;

  const result: DataPoint[] = [];
  for (let ts = alignedFrom; ts <= alignedTo; ts += periodMs) {
    result.push(existing.get(ts) ?? { timestamp: new Date(ts), value: 0 });
  }

  return result;
}
