/**
 * Payments Checkouts - Repository
 * Server-only. DB access.
 * Checkouts (pack and new-subscription purchases) started per bucket, by
 * outcome. A checkout row is created when the user opens checkout; Stripe
 * marks it failed when the session expires (24 h) or the charge is declined,
 * so "abandoned" is mostly people who left, not gateway errors. Renewals are
 * not checkouts and are excluded, as are setup sessions and admin accounts.
 * Checkouts from the last 24 h can still be pending (in "started" only).
 */

import "server-only";

import { type SQL, sql } from "drizzle-orm";
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

import {
  notInternalUserSql,
  paidStatusSql,
  paymentKindSql,
  utcTs,
} from "../../analytics/money-sql";
import { CheckoutMode, PaymentStatus } from "../../enum";
import { CheckoutOutcome, type CheckoutOutcomeValue } from "./enum";

const OUTCOME_SQL: Record<typeof CheckoutOutcomeValue, SQL> = {
  [CheckoutOutcome.STARTED]: sql`TRUE`,
  [CheckoutOutcome.PAID]: paidStatusSql("pt"),
  [CheckoutOutcome.ABANDONED]: sql`pt.status = ${PaymentStatus.FAILED}`,
};

export class QueryPaymentsCheckoutsRepository {
  static async queryPaymentsCheckouts(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    outcome: typeof CheckoutOutcomeValue;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const result = await db.execute<
      QueryResultRow & { bucket: string; checkouts: string | number }
    >(sql`
      SELECT ${resolutionBucketExpr(resolution, sql`pt.created_at`)} AS bucket,
        count(*) AS checkouts
      FROM payment_transactions pt
      WHERE pt.mode <> ${CheckoutMode.SETUP}
        AND ${paymentKindSql("pt")} <> 'renewal'
        AND ${notInternalUserSql("pt.user_id")}
        AND ${OUTCOME_SQL[data.outcome]}
        AND pt.created_at >= ${utcTs(range.from)}
        AND pt.created_at <= ${utcTs(range.to)}
      GROUP BY 1 ORDER BY 1`);

    const raw = result.rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.checkouts),
    }));
    return success({
      result: fillGaps(raw, range, resolution),
      meta: {
        actualResolution: resolution,
        lookbackUsed: lookback ?? 0,
      },
    });
  }
}
