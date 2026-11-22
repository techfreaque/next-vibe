/**
 * Finance Series - Data Source Repository
 * Server-only. Buckets the finance tables for Vibe Sense graph nodes.
 */

import "server-only";

import {
  and,
  count,
  eq,
  gte,
  isNotNull,
  lte,
  type SQL,
  sql,
} from "drizzle-orm";
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

import type { ConsumptionBucket } from "../../consumption";
import { ConsumptionRepository } from "../../consumption-repository";
import { UNATTRIBUTED_PROVIDER } from "../../cost-providers";
import {
  financeAlerts,
  financeDailyRollups,
  financeProviderSnapshots,
  financeRevenueSnapshots,
} from "../../db";
import {
  FinanceMetric,
  type FinanceMetricValue,
  FinanceSource,
  ProviderFilter,
  type ProviderFilterValue,
} from "../../enum";

interface BucketRow {
  bucket: string;
  value: number | string | null;
}

/** Consumption-ledger metrics and the bucket field each one charts. */
type LedgerMetric =
  | typeof FinanceMetric.PROVIDER_COST
  | typeof FinanceMetric.COST_TOTAL
  | typeof FinanceMetric.COST_PAID
  | typeof FinanceMetric.COST_FREE
  | typeof FinanceMetric.CONSUMED_LIST
  | typeof FinanceMetric.EARNED
  | typeof FinanceMetric.FREE_LIST
  | typeof FinanceMetric.AI_MARGIN_USD
  | typeof FinanceMetric.AI_MARGIN_PCT
  | typeof FinanceMetric.PAID_MARGIN_USD
  | typeof FinanceMetric.PAID_MARGIN_PCT;

function isLedgerMetric(
  metric: typeof FinanceMetricValue,
): metric is LedgerMetric {
  return (
    metric === FinanceMetric.PROVIDER_COST ||
    metric === FinanceMetric.COST_TOTAL ||
    metric === FinanceMetric.COST_PAID ||
    metric === FinanceMetric.COST_FREE ||
    metric === FinanceMetric.CONSUMED_LIST ||
    metric === FinanceMetric.EARNED ||
    metric === FinanceMetric.FREE_LIST ||
    metric === FinanceMetric.AI_MARGIN_USD ||
    metric === FinanceMetric.AI_MARGIN_PCT ||
    metric === FinanceMetric.PAID_MARGIN_USD ||
    metric === FinanceMetric.PAID_MARGIN_PCT
  );
}

/** One ledger metric's value for a bucket; null = no value (left out, not 0). */
export function ledgerMetricValue(
  metric: LedgerMetric,
  bucket: ConsumptionBucket,
  costProvider: string | undefined,
): number | null {
  switch (metric) {
    case FinanceMetric.PROVIDER_COST:
      return bucket.costByProvider[costProvider ?? UNATTRIBUTED_PROVIDER] ?? 0;
    case FinanceMetric.COST_TOTAL:
      return bucket.costTotalUsd;
    case FinanceMetric.COST_PAID:
      return bucket.costPaidUsd;
    case FinanceMetric.COST_FREE:
      return bucket.costFreeUsd;
    case FinanceMetric.CONSUMED_LIST:
      return bucket.consumedListUsd;
    case FinanceMetric.EARNED:
      return bucket.earnedUsd;
    case FinanceMetric.FREE_LIST:
      return bucket.freeListUsd;
    case FinanceMetric.AI_MARGIN_USD:
      return bucket.aiMarginUsd;
    case FinanceMetric.AI_MARGIN_PCT:
      return bucket.aiMarginPct;
    case FinanceMetric.PAID_MARGIN_USD:
      return bucket.paidMarginUsd;
    case FinanceMetric.PAID_MARGIN_PCT:
      return bucket.paidMarginPct;
  }
}

export class FinanceSeriesRepository {
  static async query(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    metric: typeof FinanceMetricValue;
    provider: typeof ProviderFilterValue;
    costProvider?: string;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const meta = { actualResolution: resolution, lookbackUsed: lookback ?? 0 };
    const metric = data.metric;
    if (isLedgerMetric(metric)) {
      const buckets = await ConsumptionRepository.valued(resolution, range);
      const points = buckets.flatMap((b): DataPoint[] => {
        const value = ledgerMetricValue(metric, b, data.costProvider);
        return value === null ? [] : [{ timestamp: new Date(b.bucket), value }];
      });
      const isPct =
        metric === FinanceMetric.AI_MARGIN_PCT ||
        metric === FinanceMetric.PAID_MARGIN_PCT;
      // A percentage of nothing earned is no value: keep the gap, never 0.
      return success({
        result: isPct ? points : fillGaps(points, range, resolution),
        meta,
      });
    }
    const rows = await FinanceSeriesRepository.rows(data);
    const raw = rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.value ?? 0),
    }));
    // A missing percentage or balance reading is a gap, never a 0.
    if (
      data.metric === FinanceMetric.GROSS_MARGIN_PCT ||
      data.metric === FinanceMetric.PROVIDER_BALANCE ||
      data.metric === FinanceMetric.PROVIDER_BALANCE_NATIVE
    ) {
      return success({ result: raw, meta });
    }
    return success({ result: fillGaps(raw, range, resolution), meta });
  }

  private static rollupSeries(
    column:
      | typeof financeDailyRollups.netRevenueUsd
      | typeof financeDailyRollups.refundsUsd
      | typeof financeDailyRollups.upstreamCostUsd
      | typeof financeDailyRollups.internalBilledUsd
      | typeof financeDailyRollups.grossMarginUsd
      | typeof financeDailyRollups.grossMarginPct,
    resolution: Resolution,
    range: TimeRange,
    extra: SQL[] = [],
  ): Promise<BucketRow[]> {
    return db
      .select({
        bucket: resolutionBucketExpr(resolution, financeDailyRollups.day).as(
          "bucket",
        ),
        value: sql<number>`coalesce(sum(${column}), 0)`,
      })
      .from(financeDailyRollups)
      .where(
        and(
          gte(financeDailyRollups.day, range.from),
          lte(financeDailyRollups.day, range.to),
          ...extra,
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);
  }

  private static sourceRevenue(
    source: typeof FinanceSource.STRIPE | typeof FinanceSource.NOWPAYMENTS,
    resolution: Resolution,
    range: TimeRange,
  ): Promise<BucketRow[]> {
    return db
      .select({
        bucket: resolutionBucketExpr(
          resolution,
          financeRevenueSnapshots.day,
        ).as("bucket"),
        value: sql<number>`coalesce(sum(${financeRevenueSnapshots.grossUsd}), 0)`,
      })
      .from(financeRevenueSnapshots)
      .where(
        and(
          eq(financeRevenueSnapshots.source, source),
          gte(financeRevenueSnapshots.day, range.from),
          lte(financeRevenueSnapshots.day, range.to),
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);
  }

  /**
   * Balance at the END of each bucket: the last reading per provider in the
   * bucket, summed across providers. Summing every hourly reading (the old
   * query) reported ~24x the real balance on a daily chart.
   */
  private static async latestBalance(
    column:
      | typeof financeProviderSnapshots.balanceUsd
      | typeof financeProviderSnapshots.balanceNative,
    resolution: Resolution,
    range: TimeRange,
    provider: typeof ProviderFilterValue,
  ): Promise<BucketRow[]> {
    const bucket = resolutionBucketExpr(
      resolution,
      financeProviderSnapshots.bucketAt,
    );
    const providerFilter =
      provider === ProviderFilter.ALL
        ? sql``
        : sql`AND ${financeProviderSnapshots.provider} = ${provider}`;
    const result = await db.execute<
      QueryResultRow & { bucket: string; value: number | string | null }
    >(sql`
      SELECT latest.bucket, sum(latest.value) AS value FROM (
        SELECT DISTINCT ON (1, ${financeProviderSnapshots.provider})
          ${bucket} AS bucket, ${column} AS value
        FROM ${financeProviderSnapshots}
        WHERE ${financeProviderSnapshots.bucketAt} >= (${range.from.toISOString()}::timestamptz AT TIME ZONE 'UTC')
          AND ${financeProviderSnapshots.bucketAt} <= (${range.to.toISOString()}::timestamptz AT TIME ZONE 'UTC')
          AND ${column} IS NOT NULL
          ${providerFilter}
        ORDER BY 1, ${financeProviderSnapshots.provider}, ${financeProviderSnapshots.bucketAt} DESC
      ) latest
      GROUP BY latest.bucket
      ORDER BY latest.bucket
    `);
    return result.rows.map((r) => ({ bucket: r.bucket, value: r.value }));
  }

  private static rows(data: {
    resolution: Resolution;
    range: TimeRange;
    metric: typeof FinanceMetricValue;
    provider: typeof ProviderFilterValue;
  }): Promise<BucketRow[]> {
    const { resolution, range } = data;
    const providerWhere: SQL[] = [
      gte(financeProviderSnapshots.bucketAt, range.from),
      lte(financeProviderSnapshots.bucketAt, range.to),
    ];
    if (data.provider !== ProviderFilter.ALL) {
      providerWhere.push(eq(financeProviderSnapshots.provider, data.provider));
    }
    const providerBucket = resolutionBucketExpr(
      resolution,
      financeProviderSnapshots.bucketAt,
    );

    switch (data.metric) {
      case FinanceMetric.STRIPE_REVENUE:
        return FinanceSeriesRepository.sourceRevenue(
          FinanceSource.STRIPE,
          resolution,
          range,
        );
      case FinanceMetric.NOWPAYMENTS_REVENUE:
        return FinanceSeriesRepository.sourceRevenue(
          FinanceSource.NOWPAYMENTS,
          resolution,
          range,
        );
      case FinanceMetric.NET_REVENUE:
        return FinanceSeriesRepository.rollupSeries(
          financeDailyRollups.netRevenueUsd,
          resolution,
          range,
        );
      case FinanceMetric.REFUNDS:
        return FinanceSeriesRepository.rollupSeries(
          financeDailyRollups.refundsUsd,
          resolution,
          range,
        );
      case FinanceMetric.UPSTREAM_COST:
        return FinanceSeriesRepository.rollupSeries(
          financeDailyRollups.upstreamCostUsd,
          resolution,
          range,
        );
      case FinanceMetric.INTERNAL_BILLED:
        return FinanceSeriesRepository.rollupSeries(
          financeDailyRollups.internalBilledUsd,
          resolution,
          range,
        );
      case FinanceMetric.GROSS_MARGIN_USD:
        return FinanceSeriesRepository.rollupSeries(
          financeDailyRollups.grossMarginUsd,
          resolution,
          range,
        );
      case FinanceMetric.GROSS_MARGIN_PCT:
        // Days without revenue have no percentage: leave them out, not 0.
        return FinanceSeriesRepository.rollupSeries(
          financeDailyRollups.grossMarginPct,
          resolution,
          range,
          [isNotNull(financeDailyRollups.grossMarginPct)],
        );
      case FinanceMetric.PROVIDER_SPEND:
        return db
          .select({
            bucket: providerBucket.as("bucket"),
            value: sql<number>`coalesce(sum(${financeProviderSnapshots.spendUsd}), 0)`,
          })
          .from(financeProviderSnapshots)
          .where(and(...providerWhere))
          .groupBy(sql`1`)
          .orderBy(sql`1`);
      case FinanceMetric.PROVIDER_BALANCE:
        return FinanceSeriesRepository.latestBalance(
          financeProviderSnapshots.balanceUsd,
          resolution,
          range,
          data.provider,
        );
      case FinanceMetric.PROVIDER_BALANCE_NATIVE:
        return FinanceSeriesRepository.latestBalance(
          financeProviderSnapshots.balanceNative,
          resolution,
          range,
          data.provider,
        );
      // Ledger metrics are answered in query() before rows() is reached.
      case FinanceMetric.PROVIDER_COST:
      case FinanceMetric.COST_TOTAL:
      case FinanceMetric.COST_PAID:
      case FinanceMetric.COST_FREE:
      case FinanceMetric.CONSUMED_LIST:
      case FinanceMetric.EARNED:
      case FinanceMetric.FREE_LIST:
      case FinanceMetric.AI_MARGIN_USD:
      case FinanceMetric.AI_MARGIN_PCT:
      case FinanceMetric.PAID_MARGIN_USD:
      case FinanceMetric.PAID_MARGIN_PCT:
        return Promise.resolve([]);
      case FinanceMetric.ALERTS:
        return db
          .select({
            bucket: resolutionBucketExpr(
              resolution,
              financeAlerts.createdAt,
            ).as("bucket"),
            value: count(),
          })
          .from(financeAlerts)
          .where(
            and(
              gte(financeAlerts.createdAt, range.from),
              lte(financeAlerts.createdAt, range.to),
            ),
          )
          .groupBy(sql`1`)
          .orderBy(sql`1`);
    }
  }
}
