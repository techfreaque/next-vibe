/**
 * Vibe Sense - Field Pick Transformer Compute
 * Server-only pure computation. No DB access.
 *
 * NOTE: This transformer has been superseded. The new DataPoint type is
 * {timestamp: Date, value: number} with no meta field. Field extraction
 * from meta is no longer possible. Returns an empty array for backwards
 * compatibility.
 */

import "server-only";

import { GraphResolution } from "@/app/api/[locale]/system/unified-interface/vibe-sense/enum";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import type {
  Resolution,
  TimeSeries,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

export class FieldPickTransformerRepository {
  /**
   * @deprecated DataPoint no longer has a meta field. Returns empty array.
   */
  static computeFieldPick(points: TimeSeries, field: string): TimeSeries {
    void points;
    void field;
    // Superseded: DataPoint has no meta field in the new architecture.
    // Kept for backwards compatibility with existing graph definitions.
    return [];
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
