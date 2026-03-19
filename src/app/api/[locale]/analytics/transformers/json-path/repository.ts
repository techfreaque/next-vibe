/**
 * Vibe Sense — JSON Path Transformer Compute
 * Server-only pure computation. No DB access.
 *
 * NOTE: This transformer has been superseded. The new DataPoint type is
 * {timestamp: Date, value: number} with no meta field. Dot-notation path
 * extraction from meta is no longer possible. Returns an empty array for
 * backwards compatibility.
 */

import "server-only";

import type { TimeSeries } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";

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
}
