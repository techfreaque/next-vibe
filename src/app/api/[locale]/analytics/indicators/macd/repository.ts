/**
 * Vibe Sense - MACD Compute
 * Server-only pure computation. No DB access.
 */

import "server-only";

import type { TimeSeries } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class MacdIndicatorRepository {
  private static computeEmaInternal(
    points: TimeSeries,
    period: number,
  ): TimeSeries {
    if (points.length === 0) {
      return [];
    }
    const k = 2 / (period + 1);
    const result: TimeSeries = [];
    let ema: number | undefined;
    for (const p of points) {
      ema = ema === undefined ? p.value : p.value * k + ema * (1 - k);
      result.push({ timestamp: p.timestamp, value: ema });
    }
    return result;
  }

  /**
   * Compute MACD (Moving Average Convergence Divergence).
   * Returns the MACD line, signal line, and histogram.
   */
  static computeMacd(
    points: TimeSeries,
    fastPeriod: number,
    slowPeriod: number,
    signalPeriod: number,
  ): { macd: TimeSeries; signal: TimeSeries; histogram: TimeSeries } {
    const fastEma = MacdIndicatorRepository.computeEmaInternal(
      points,
      fastPeriod,
    );
    const slowEma = MacdIndicatorRepository.computeEmaInternal(
      points,
      slowPeriod,
    );

    const slowMap = new Map<number, number>();
    for (const p of slowEma) {
      slowMap.set(p.timestamp.getTime(), p.value);
    }

    const macdLine: TimeSeries = [];
    for (const p of fastEma) {
      const slowVal = slowMap.get(p.timestamp.getTime());
      if (slowVal !== undefined) {
        macdLine.push({ timestamp: p.timestamp, value: p.value - slowVal });
      }
    }

    const signalLine = MacdIndicatorRepository.computeEmaInternal(
      macdLine,
      signalPeriod,
    );

    const signalMap = new Map<number, number>();
    for (const p of signalLine) {
      signalMap.set(p.timestamp.getTime(), p.value);
    }

    const macd: TimeSeries = [];
    const signal: TimeSeries = [];
    const histogram: TimeSeries = [];

    for (const p of macdLine) {
      const sigVal = signalMap.get(p.timestamp.getTime());
      if (sigVal !== undefined) {
        macd.push({ timestamp: p.timestamp, value: p.value });
        signal.push({ timestamp: p.timestamp, value: sigVal });
        histogram.push({ timestamp: p.timestamp, value: p.value - sigVal });
      }
    }

    return { macd, signal, histogram };
  }
}
