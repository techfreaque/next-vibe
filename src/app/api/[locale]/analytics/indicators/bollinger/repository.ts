/**
 * Vibe Sense — Bollinger Bands Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import type { TimeSeries } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

/**
 * Compute Bollinger Bands.
 * Returns upper, middle (SMA), and lower bands using standard deviation.
 */
export function computeBollinger(
  points: TimeSeries,
  period: number,
  stdDev: number,
): { upper: TimeSeries; middle: TimeSeries; lower: TimeSeries } {
  const upper: TimeSeries = [];
  const middle: TimeSeries = [];
  const lower: TimeSeries = [];

  for (let i = period - 1; i < points.length; i++) {
    const window = points.slice(i - period + 1, i + 1);
    const p = points[i];
    if (!p) {
      continue;
    }

    const sum = window.reduce((s, w) => s + w.value, 0);
    const sma = sum / period;
    const variance =
      window.reduce((s, w) => s + (w.value - sma) ** 2, 0) / period;
    const sigma = Math.sqrt(variance);

    upper.push({ timestamp: p.timestamp, value: sma + stdDev * sigma });
    middle.push({ timestamp: p.timestamp, value: sma });
    lower.push({ timestamp: p.timestamp, value: sma - stdDev * sigma });
  }

  return { upper, middle, lower };
}
