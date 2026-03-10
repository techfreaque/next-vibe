/**
 * Vibe Sense — Field Pick Transformer
 * Extracts a specific field from a MultiValueTimeSeries as a single TimeSeries.
 */

import type {
  DataPoint,
  MultiValueTimeSeries,
  TimeSeries,
} from "../indicators/types";

/**
 * Pick a named output from a multi-value series result.
 * Returns the DataPoint array for that field.
 */
export function fieldPickTransform(
  series: MultiValueTimeSeries,
  field: string,
): DataPoint[] {
  const picked = series[field];
  if (!picked) {
    return [];
  }
  return picked.points;
}

/**
 * Pick a field and wrap it as a TimeSeries.
 */
export function fieldPickAsSeries(
  series: MultiValueTimeSeries,
  field: string,
  nodeId: string,
): TimeSeries | null {
  const picked = series[field];
  if (!picked) {
    return null;
  }
  return { ...picked, nodeId };
}
