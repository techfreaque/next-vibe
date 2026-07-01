/**
 * Vibe Sense - JSON Path Transformer Compute
 * Server-only pure computation. No DB access.
 *
 * NOTE: This transformer has been superseded. The new DataPoint type is
 * {timestamp: Date, value: number} with no meta field. Dot-notation path
 * extraction from meta is no longer possible. Returns an empty array for
 * backwards compatibility.
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { GraphResolution } from "next-vibe/core/utils/dataflow/enum";
import type {
  Resolution,
  TimeSeries,
} from "next-vibe/core/utils/dataflow/shared/fields";

export class JsonPathTransformerRepository {
  /**
   * @deprecated DataPoint no longer has a meta field. Returns empty array.
   */
  static computeJsonPath(points: TimeSeries, path: string): TimeSeries {
    void points;
    void path;
    // Superseded: DataPoint has no meta field in the new architecture.
    // Kept for backwards compatibility with existing graph definitions.
    return [];
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
