/**
 * Vibe Sense - Drop Evaluator Pure Computation
 * Server-only.
 *
 * Fires on a bar whose value is more than `dropPct` below the average of the
 * `window` bars before it. Needs a full window and a baseline of at least
 * `minBaseline` (and above zero) - quiet periods never fire.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import type { SignalEvent, TimeSeries } from "next-vibe/dataflow/shared/fields";

export class DropEvaluatorRepository {
  static computeDrop(
    series: TimeSeries,
    window: number,
    dropPct: number,
    minBaseline: number,
  ): SignalEvent[] {
    const signals: SignalEvent[] = [];
    for (let i = window; i < series.length; i++) {
      const point = series[i];
      if (!point) {
        continue;
      }
      let sum = 0;
      for (let j = i - window; j < i; j++) {
        sum += series[j]?.value ?? 0;
      }
      const baseline = sum / window;
      const usable = baseline > 0 && baseline >= minBaseline;
      const change = usable ? (point.value - baseline) / baseline : 0;
      signals.push({
        timestamp: point.timestamp,
        fired: usable && point.value < baseline * (1 - dropPct),
        meta: {
          baseline: Math.round(baseline * 10_000) / 10_000,
          actual: point.value,
          change: Math.round(change * 100) / 100,
        },
      });
    }
    return signals;
  }

  static handle(data: {
    source: TimeSeries;
    window: number;
    dropPct: number;
    minBaseline: number;
  }): ResponseType<{ signals: SignalEvent[] }> {
    return success({
      signals: DropEvaluatorRepository.computeDrop(
        data.source,
        data.window,
        data.dropPct,
        data.minBaseline,
      ),
    });
  }
}
