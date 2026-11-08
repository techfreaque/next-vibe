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
  sql,
  type SQL,
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

export class FinanceSeriesRepository {
  static async query(data: {
    resolution: Resolution;
    range: TimeRange;
    lookback?: number;
    metric: typeof FinanceMetricValue;
    provider: typeof ProviderFilterValue;
  }): Promise<
    ResponseType<{
      result: DataPoint[];
      meta: { actualResolution: Resolution; lookbackUsed: number };
    }>
  > {
    const { resolution, range, lookback } = data;
    const rows = await FinanceSeriesRepository.rows(data);
    const raw = rows.map((r): DataPoint => ({
      timestamp: new Date(r.bucket),
      value: Number(r.value ?? 0),
    }));
    return success({
      result: fillGaps(raw, range, resolution),
      meta: { actualResolution: resolution, lookbackUsed: lookback ?? 0 },
    });
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
        return db
          .select({
            bucket: providerBucket.as("bucket"),
            value: sql<number>`coalesce(sum(${financeProviderSnapshots.balanceUsd}), 0)`,
          })
          .from(financeProviderSnapshots)
          .where(
            and(
              ...providerWhere,
              isNotNull(financeProviderSnapshots.balanceUsd),
            ),
          )
          .groupBy(sql`1`)
          .orderBy(sql`1`);
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
