/**
 * Share of measured first referral visits that led to a credited signup.
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
import { resolutionBucketExpr } from "next-vibe/dataflow/shared/query-utils";
import { fillGaps } from "next-vibe/dataflow/shared/range";
import type { QueryResultRow } from "pg";

export class QueryReferralsConversionRateRepository {
  static async queryReferralsConversionRate(data: {
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
    const { rows } = await db.execute<
      QueryResultRow & { bucket: string; value: number }
    >(sql`
      WITH first_visits AS (
        SELECT v.lead_id, c.id AS code_id, min(v.visited_at) AS first_visit
        FROM growth_visits v
        JOIN leads l ON l.id = v.lead_id AND l.is_bot = false
        JOIN referral_codes c ON c.code = v.ref_code
        WHERE v.visited_at <= ${range.to.toISOString()}::timestamp
        GROUP BY v.lead_id, c.id
      )
      SELECT ${resolutionBucketExpr(resolution, sql`first_visit`)} AS bucket,
        round(100.0 * avg((EXISTS (
          SELECT 1 FROM user_referrals ur
          LEFT JOIN growth_journeys j ON j.user_id = ur.referred_user_id
          LEFT JOIN user_lead_links ul ON ul.user_id = ur.referred_user_id
            AND ul.lead_id = v.lead_id AND ul.link_reason = 'signup'
          WHERE ur.referral_code_id = v.code_id AND ur.created_at >= v.first_visit
            AND coalesce(j.lead_id, ul.lead_id) = v.lead_id
        ))::int))::float8 AS value
      FROM first_visits v
      WHERE v.first_visit >= ${range.from.toISOString()}::timestamp
      GROUP BY 1 ORDER BY 1
    `);

    return success({
      result: fillGaps(
        rows.map(({ bucket, value }) => ({
          timestamp: new Date(bucket),
          value,
        })),
        range,
        resolution,
      ),
      meta: {
        actualResolution: resolution,
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
