/**
 * Vibe Sense - Threshold Evaluator Pure Computation
 * Server-only.
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type {
  SignalEvent,
  TimeSeries,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class ThresholdEvaluatorRepository {
  static computeThreshold(
    series: TimeSeries,
    op: string,
    value: number,
  ): SignalEvent[] {
    return series.map((p) => {
      let fired: boolean;
      if (op === ">") {
        fired = p.value > value;
      } else if (op === "<") {
        fired = p.value < value;
      } else if (op === ">=") {
        fired = p.value >= value;
      } else if (op === "<=") {
        fired = p.value <= value;
      } else if (op === "==") {
        fired = p.value === value;
      } else {
        fired = false;
      }
      return {
        timestamp: p.timestamp,
        fired,
        meta: { op, threshold: value, actual: p.value },
      };
    });
  }

  static handle(data: {
    source: TimeSeries;
    op: string;
    value: number;
  }): ResponseType<{ signals: SignalEvent[] }> {
    const signals = ThresholdEvaluatorRepository.computeThreshold(
      data.source,
      data.op,
      data.value,
    );
    return success({ signals });
  }
}
