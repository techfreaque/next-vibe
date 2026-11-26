/**
 * Payments Revenue - Repository
 * Server-only. DB access.
 * Collected payments per bucket in approx. USD (static FX, money-sql.ts):
 * succeeded or later-refunded rows, no setup checkouts, no admin accounts.
 * Same definitions as the admin Revenue report.
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

import {
  paidStatusSql,
  paymentKindSql,
  REPORTABLE_PAYMENT_SQL,
  reportingUserSql,
  usdSql,
  utcTs,
} from "../../analytics/money-sql";
import { CheckoutMode, PaymentProvider } from "../../enum";
import {
  RevenueSeriesKind,
  type RevenueSeriesKindValue,
  RevenueSeriesProvider,
  type RevenueSeriesProviderValue,
} from "./enum";

const KIND_SQL: Record<typeof RevenueSeriesKindValue, string[] | null> = {
  [RevenueSeriesKind.ALL]: null,
  [RevenueSeriesKind.PACK]: ["pack"],
  [RevenueSeriesKind.SUBSCRIPTION]: ["newSubscription", "renewal"],
  [RevenueSeriesKind.NEW_SUBSCRIPTION]: ["newSubscription"],
  [RevenueSeriesKind.RENEWAL]: ["renewal"],
};

const PROVIDER_SQL: Record<typeof RevenueSeriesProviderValue, string | null> = {
  [RevenueSeriesProvider.ALL]: null,
  [RevenueSeriesProvider.STRIPE]: PaymentProvider.STRIPE,
  [RevenueSeriesProvider.NOWPAYMENTS]: PaymentProvider.NOWPAYMENTS,
};

export class QueryPaymentsRevenueRepository {
  static async queryPaymentsRevenue(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    kind: typeof RevenueSeriesKindValue;
    provider: typeof RevenueSeriesProviderValue;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const kinds = KIND_SQL[data.kind];
    const provider = PROVIDER_SQL[data.provider];
    const result = await db.execute<
      QueryResultRow & { bucket: string; usd: string | null }
    >(sql`
      SELECT ${resolutionBucketExpr(resolution, sql`pt.created_at`)} AS bucket,
        sum(${usdSql("pt.amount", "pt.currency")}) AS usd
      FROM payment_transactions pt
      WHERE ${REPORTABLE_PAYMENT_SQL} AND ${paidStatusSql("pt")}
        AND pt.mode <> ${CheckoutMode.SETUP}
        AND ${reportingUserSql("pt.user_id")}
        AND pt.created_at >= ${utcTs(range.from)}
        AND pt.created_at <= ${utcTs(range.to)}
        ${
          kinds
            ? sql`AND ${paymentKindSql("pt")} IN (${sql.join(
                kinds.map((k) => sql`${k}`),
                sql`, `,
              )})`
            : sql``
        }
        ${provider ? sql`AND pt.provider = ${provider}` : sql``}
      GROUP BY 1 ORDER BY 1`);

    const raw = result.rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Math.round(Number(r.usd ?? 0) * 100) / 100,
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
