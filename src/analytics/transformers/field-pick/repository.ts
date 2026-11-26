/**
 * Vibe Sense - Field Pick Transformer Compute
 * Server-only pure computation. No DB access.
 *
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { GraphResolution } from "next-vibe/dataflow/enum";
import type { Resolution, TimeSeries } from "next-vibe/dataflow/shared/fields";

export class FieldPickTransformerRepository {
  static computeFieldPick(points: TimeSeries, field: string): TimeSeries {
    return points.flatMap((point) => {
      const value = point.meta?.[field];
      return typeof value === "number" && Number.isFinite(value)
        ? [{ timestamp: point.timestamp, value }]
        : [];
    });
  }

  static handle(data: {
    source: TimeSeries;
    field: string;
    resolution?: Resolution | null;
    lookback?: number | null;
  }): ResponseType<{
    result: TimeSeries;
    meta: { actualResolution: Resolution; lookbackUsed: number };
  }> {
    const result = FieldPickTransformerRepository.computeFieldPick(
      data.source,
      data.field,
    );
    return success({
      result,
      meta: {
        actualResolution: data.resolution ?? GraphResolution.ONE_DAY,
        lookbackUsed: data.lookback ?? 0,
      },
    });
  }
}
