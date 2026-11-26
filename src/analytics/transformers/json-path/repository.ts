/**
 * Vibe Sense - JSON Path Transformer Compute
 * Server-only pure computation. No DB access.
 *
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { GraphResolution } from "next-vibe/dataflow/enum";
import type { Resolution, TimeSeries } from "next-vibe/dataflow/shared/fields";

import { FieldPickTransformerRepository } from "../field-pick/repository";

export class JsonPathTransformerRepository {
  static computeJsonPath(points: TimeSeries, path: string): TimeSeries {
    if (path === "value") {
      return points.map(({ timestamp, value }) => ({ timestamp, value }));
    }
    const key = path.startsWith("meta.") ? path.slice(5) : path;
    return FieldPickTransformerRepository.computeFieldPick(points, key);
  }

  static handle(data: {
    source: TimeSeries;
    path: string;
    resolution?: Resolution | null;
    lookback?: number | null;
  }): ResponseType<{
    result: TimeSeries;
    meta: { actualResolution: Resolution; lookbackUsed: number };
  }> {
    const result = JsonPathTransformerRepository.computeJsonPath(
      data.source,
      data.path,
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
