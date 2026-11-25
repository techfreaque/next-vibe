/**
 * Subscriptions Active - Repository
 * Server-only. DB access.
 * Snapshot: subscriptions running at the END of each bucket (created before,
 * not ended yet; past-due still counts until it ends). Same rule as the
 * Revenue report. Incomplete checkouts and admin accounts excluded.
 */

import "server-only";

import { sql } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";
import type { QueryResultRow } from "pg";

import {
  bucketEnds,
  bucketEndsValuesSql,
  COUNTED_SUBSCRIPTION_SQL,
  snapshotPoints,
  SUB_END_SQL,
} from "../../series-sql";

export class QuerySubscriptionsActiveRepository {
  static async querySubscriptionsActive(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const ends = bucketEnds(range, resolution);
    if (ends.length === 0) {
      return success({
        result: [],
        meta: { actualResolution: resolution, lookbackUsed: lookback ?? 0 },
      });
    }
    const result = await db.execute<
      QueryResultRow & { bucket: string; value: string | number | null }
    >(sql`
      SELECT v.bucket, count(s.id) AS value
      FROM ${bucketEndsValuesSql(ends)}
      LEFT JOIN subscriptions s
        ON ${COUNTED_SUBSCRIPTION_SQL}
        AND s.created_at < v.e
        AND (${SUB_END_SQL} IS NULL OR ${SUB_END_SQL} >= v.e)
      GROUP BY v.bucket`);

    return success({
      result: snapshotPoints(ends, result.rows),
      meta: {
        actualResolution: resolution,
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
