/**
 * Revenue Report repository.
 *
 * Definitions (the widget hints repeat them):
 * - Paid payment: payment_transactions with status SUCCEEDED or REFUNDED (a
 *   refunded payment was collected first; the refund is subtracted in net).
 * - Kind: checkout mode PAYMENT = credit pack; SUBSCRIPTION with
 *   metadata.type = subscription_renewal = renewal; other SUBSCRIPTION = new.
 * - Gross = paid amounts; net = gross minus succeeded refunds dated in the win.
 * - All money is approx. USD at static FX rates (money-sql.ts).
 * - Active subscription at T: created before T, not incomplete, and not ended
 *   (ended_at, or canceled_at for canceled rows) before T.
 * - MRR at T: active subscriptions priced by the user's latest paid
 *   subscription payment before T, yearly plans divided by 12.
 * - Churned: subscriptions that ended inside the win.
 * - Subscription KPIs follow the provider/plan filters only (kind and currency
 *   describe payments, not subscriptions).
 * - Admin (internal) accounts are excluded unless includeInternal is set.
 */

import "server-only";

import { type SQL, sql } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { BreakdownRow, Kpi } from "next-vibe/unified-ui/analytics/schema";
import {
  type AnalyticsWindow,
  fillBuckets,
  resolveAnalyticsWindow,
  serializeWindow,
} from "next-vibe/unified-ui/analytics/window";
import { bucketSql } from "next-vibe/unified-ui/analytics/window-sql";
import type { QueryResultRow } from "pg";

import { BillingInterval, SubscriptionStatus } from "@/subscription/enum";

import {
  CheckoutMode,
  PaymentProvider,
  PaymentStatus,
  RefundStatus,
} from "../../enum";
import { REVENUE_FX_RATES, usdSql, utcTs } from "../money-sql";
import {
  recentPaymentSchema,
  type RevenueReportRequestOutput,
  type RevenueReportResponseOutput,
} from "./definition";
import { RevenueKind } from "./enum";
import type { RevenueReportT } from "./i18n";

type NumLike = string | number | null;

const RECENT_LIMIT = 25;
const BREAKDOWN_LIMIT = 25;

function num(value: NumLike | undefined): number {
  return value === null || value === undefined ? 0 : Number(value);
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function kpi(value: number, previous: number | null): Kpi {
  return {
    value: round(value),
    previous: previous === null ? null : round(previous),
  };
}

/** SQL kind label stored per payment row. */
const KIND_SQL: Record<string, string> = {
  [RevenueKind.PACK]: "pack",
  [RevenueKind.NEW_SUBSCRIPTION]: "newSubscription",
  [RevenueKind.RENEWAL]: "renewal",
};

const KIND_FROM_SQL: Record<
  string,
  RevenueReportResponseOutput["recentPayments"][number]["kind"]
> = {
  pack: RevenueKind.PACK,
  newSubscription: RevenueKind.NEW_SUBSCRIPTION,
  renewal: RevenueKind.RENEWAL,
};

export interface RevenueFilters {
  kind: RevenueReportRequestOutput["kind"];
  provider?: RevenueReportRequestOutput["provider"];
  currency?: RevenueReportRequestOutput["currency"];
  plan?: RevenueReportRequestOutput["plan"];
  includeInternal: boolean;
}

function internalUserFilter(column: string, includeInternal: boolean): SQL {
  return includeInternal
    ? sql``
    : sql`AND ${sql.raw(column)} NOT IN (SELECT user_id FROM user_roles WHERE role = ${UserPermissionRole.ADMIN})`;
}

/**
 * `WITH pa AS (...)`: every non-setup payment (any date) with kind, plan,
 * approx. USD amount and the payment filters applied.
 */
function paymentsCte(filters: RevenueFilters): SQL {
  const kindSql = KIND_SQL[filters.kind];
  return sql`
    WITH pa AS (
      SELECT * FROM (
        SELECT
          pt.id, pt.user_id, pt.amount::numeric AS amount, pt.currency,
          pt.status, pt.provider, pt.mode, pt.created_at AS at,
          ${usdSql("pt.amount", "pt.currency")} AS usd,
          CASE
            WHEN pt.mode = ${CheckoutMode.PAYMENT} THEN 'pack'
            WHEN pt.metadata->>'type' = 'subscription_renewal' THEN 'renewal'
            ELSE 'newSubscription'
          END AS kind,
          COALESCE(NULLIF(pt.metadata->>'planId', ''), s.plan_id) AS plan,
          NULLIF(pt.metadata->>'productId', '') AS product,
          s.id AS sub_id,
          pt.status IN (${PaymentStatus.SUCCEEDED}, ${PaymentStatus.REFUNDED}) AS paid
        FROM payment_transactions pt
        LEFT JOIN subscriptions s
          ON s.provider_subscription_id = pt.metadata->>'subscriptionId'
        WHERE pt.mode <> ${CheckoutMode.SETUP}
          ${internalUserFilter("pt.user_id", filters.includeInternal)}
          ${filters.provider ? sql`AND pt.provider = ${filters.provider}` : sql``}
          ${filters.currency ? sql`AND pt.currency = ${filters.currency}` : sql``}
      ) x
      WHERE TRUE
        ${kindSql ? sql`AND x.kind = ${kindSql}` : sql``}
        ${filters.plan ? sql`AND x.plan = ${filters.plan}` : sql``}
    )`;
}

/** Subscription rows matching the subscription-level filters. */
function subsFilter(filters: RevenueFilters): SQL {
  return sql`s.status NOT IN (${SubscriptionStatus.INCOMPLETE}, ${SubscriptionStatus.INCOMPLETE_EXPIRED})
    ${internalUserFilter("s.user_id", filters.includeInternal)}
    ${filters.provider ? sql`AND s.provider = ${filters.provider}` : sql``}
    ${filters.plan ? sql`AND s.plan_id = ${filters.plan}` : sql``}`;
}

/** When a subscription stopped counting (null = still running). */
const SUB_END = sql.raw(
  `COALESCE(s.ended_at, CASE WHEN s.status = '${SubscriptionStatus.CANCELED}' THEN COALESCE(s.canceled_at, s.updated_at) END)`,
);

function tz(date: Date): SQL {
  return sql`${date.toISOString()}::timestamptz`;
}

interface PaymentTotals {
  gross: number;
  paying: number;
  renewals: number;
  firstPayments: number;
  packs: number;
  failed: number;
  refunds: number;
  disputes: number;
}

function net(p: PaymentTotals): number {
  return p.gross - p.refunds;
}

interface SubTotals {
  active: number;
  mrr: number;
  created: number;
  churned: number;
}

export class RevenueReportRepository {
  static async getReport(
    data: RevenueReportRequestOutput,
    logger: EndpointLogger,
    t: RevenueReportT,
  ): Promise<ResponseType<RevenueReportResponseOutput>> {
    try {
      const win = resolveAnalyticsWindow(
        data,
        new Date(),
        await RevenueReportRepository.dataFloor(),
      );
      return success(
        await RevenueReportRepository.build(win, {
          kind: data.kind,
          provider: data.provider,
          currency: data.currency,
          plan: data.plan,
          includeInternal: data.includeInternal,
        }),
      );
    } catch (error) {
      logger.error("Failed to build revenue report", parseError(error));
      return fail({
        message: t("get.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Earliest payment or subscription (bounds all-time windows). */
  static async dataFloor(): Promise<Date | null> {
    const result = await db.execute<QueryResultRow & { first: string | null }>(
      sql`SELECT to_char(LEAST(
            (SELECT min(created_at) FROM payment_transactions),
            (SELECT min(created_at AT TIME ZONE 'UTC') FROM subscriptions)
          ), 'YYYY-MM-DD') AS first`,
    );
    const first = result.rows[0]?.first;
    return first ? new Date(`${first}T00:00:00.000Z`) : null;
  }

  static async paymentTotals(
    filters: RevenueFilters,
    start: Date,
    end: Date,
  ): Promise<PaymentTotals> {
    const cte = paymentsCte(filters);
    const result = await db.execute<
      QueryResultRow & {
        gross: NumLike;
        paying: NumLike;
        renewals: NumLike;
        first: NumLike;
        packs: NumLike;
        failed: NumLike;
        refunds: NumLike;
        disputes: NumLike;
      }
    >(sql`${cte}
      SELECT
        (SELECT sum(usd) FROM pa WHERE paid AND at >= ${utcTs(start)} AND at < ${utcTs(end)}) AS gross,
        (SELECT count(DISTINCT user_id) FROM pa WHERE paid AND at >= ${utcTs(start)} AND at < ${utcTs(end)}) AS paying,
        (SELECT count(*) FROM pa WHERE paid AND kind = 'renewal' AND at >= ${utcTs(start)} AND at < ${utcTs(end)}) AS renewals,
        (SELECT count(*) FROM pa WHERE paid AND kind = 'newSubscription' AND at >= ${utcTs(start)} AND at < ${utcTs(end)}) AS first,
        (SELECT count(*) FROM pa WHERE paid AND kind = 'pack' AND at >= ${utcTs(start)} AND at < ${utcTs(end)}) AS packs,
        (SELECT count(*) FROM pa WHERE status = ${PaymentStatus.FAILED} AND at >= ${utcTs(start)} AND at < ${utcTs(end)}) AS failed,
        (SELECT sum(${usdSql("r.amount", "r.currency")}) FROM payment_refunds r JOIN pa ON pa.id = r.transaction_id
          WHERE r.status = ${RefundStatus.SUCCEEDED} AND r.created_at >= ${utcTs(start)} AND r.created_at < ${utcTs(end)}) AS refunds,
        (SELECT count(*) FROM payment_disputes d JOIN pa ON pa.id = d.transaction_id
          WHERE d.created_at >= ${utcTs(start)} AND d.created_at < ${utcTs(end)}) AS disputes`);
    const row = result.rows[0];
    return {
      gross: num(row?.gross),
      paying: num(row?.paying),
      renewals: num(row?.renewals),
      firstPayments: num(row?.first),
      packs: num(row?.packs),
      failed: num(row?.failed),
      refunds: num(row?.refunds),
      disputes: num(row?.disputes),
    };
  }

  /** Active count and MRR at `at`, created/churned inside [start, at). */
  static async subscriptionTotals(
    filters: RevenueFilters,
    start: Date,
    at: Date,
  ): Promise<SubTotals> {
    const result = await db.execute<
      QueryResultRow & {
        active: NumLike;
        mrr: NumLike;
        created: NumLike;
        churned: NumLike;
      }
    >(sql`
      SELECT
        count(*) FILTER (WHERE s.created_at < ${tz(at)} AND (${SUB_END} IS NULL OR ${SUB_END} >= ${tz(at)})) AS active,
        sum(CASE WHEN s.billing_interval = ${BillingInterval.YEARLY} OR s.interval = 'year' THEN lp.usd / 12 ELSE lp.usd END)
          FILTER (WHERE s.created_at < ${tz(at)} AND (${SUB_END} IS NULL OR ${SUB_END} >= ${tz(at)})) AS mrr,
        count(*) FILTER (WHERE s.created_at >= ${tz(start)} AND s.created_at < ${tz(at)}) AS created,
        count(*) FILTER (WHERE ${SUB_END} >= ${tz(start)} AND ${SUB_END} < ${tz(at)}) AS churned
      FROM subscriptions s
      LEFT JOIN LATERAL (
        SELECT ${usdSql("pt.amount", "pt.currency")} AS usd
        FROM payment_transactions pt
        WHERE pt.user_id = s.user_id
          AND pt.mode = ${CheckoutMode.SUBSCRIPTION}
          AND pt.status IN (${PaymentStatus.SUCCEEDED}, ${PaymentStatus.REFUNDED})
          AND pt.created_at < ${utcTs(at)}
        ORDER BY pt.created_at DESC
        LIMIT 1
      ) lp ON true
      WHERE ${subsFilter(filters)}`);
    const row = result.rows[0];
    return {
      active: num(row?.active),
      mrr: num(row?.mrr),
      created: num(row?.created),
      churned: num(row?.churned),
    };
  }

  /** Active subscriptions and MRR at the end of every bucket (capped at now). */
  static async subscriptionTrend(
    win: AnalyticsWindow,
    filters: RevenueFilters,
  ): Promise<{ active: number[]; mrr: number[]; churn30: number[] }> {
    if (win.buckets.length === 0) {
      return { active: [], mrr: [], churn30: [] };
    }
    const now = Date.now();
    const ends = win.buckets.map((bucket, index) => {
      const next = win.buckets[index + 1];
      const end = next ? new Date(`${next}T00:00:00.000Z`) : win.to;
      return sql`(${bucket}::text, ${new Date(Math.min(end.getTime(), now)).toISOString()}::timestamptz)`;
    });
    const result = await db.execute<
      QueryResultRow & {
        bucket: string;
        active: NumLike;
        mrr: NumLike;
        churned30: NumLike;
        active30: NumLike;
      }
    >(sql`
      SELECT v.bucket,
        count(s.id) FILTER (WHERE s.created_at < v.e AND (${SUB_END} IS NULL OR ${SUB_END} >= v.e)) AS active,
        count(s.id) FILTER (WHERE ${SUB_END} >= v.e - interval '30 days' AND ${SUB_END} < v.e) AS churned30,
        count(s.id) FILTER (WHERE s.created_at < v.e - interval '30 days'
          AND (${SUB_END} IS NULL OR ${SUB_END} >= v.e - interval '30 days')) AS active30,
        sum(CASE WHEN s.billing_interval = ${BillingInterval.YEARLY} OR s.interval = 'year' THEN lp.usd / 12 ELSE lp.usd END)
          FILTER (WHERE s.created_at < v.e AND (${SUB_END} IS NULL OR ${SUB_END} >= v.e)) AS mrr
      FROM (VALUES ${sql.join(ends, sql`, `)}) AS v(bucket, e)
      LEFT JOIN subscriptions s
        ON ${subsFilter(filters)}
        AND s.created_at < v.e
        AND (${SUB_END} IS NULL OR ${SUB_END} >= v.e - interval '30 days')
      LEFT JOIN LATERAL (
        SELECT ${usdSql("pt.amount", "pt.currency")} AS usd
        FROM payment_transactions pt
        WHERE s.id IS NOT NULL
          AND pt.user_id = s.user_id
          AND pt.mode = ${CheckoutMode.SUBSCRIPTION}
          AND pt.status IN (${PaymentStatus.SUCCEEDED}, ${PaymentStatus.REFUNDED})
          AND pt.created_at < (v.e AT TIME ZONE 'UTC')
        ORDER BY pt.created_at DESC
        LIMIT 1
      ) lp ON true
      GROUP BY v.bucket`);
    const rows = result.rows;
    return {
      active: fillBuckets(
        win.buckets,
        rows.map((r) => ({ bucket: r.bucket, value: num(r.active) })),
      ),
      mrr: fillBuckets(
        win.buckets,
        rows.map((r) => ({ bucket: r.bucket, value: round(num(r.mrr)) })),
      ),
      churn30: fillBuckets(
        win.buckets,
        rows.map((r) => ({
          bucket: r.bucket,
          value:
            num(r.active30) > 0
              ? round(num(r.churned30) / num(r.active30), 4)
              : 0,
        })),
      ),
    };
  }

  static async build(
    win: AnalyticsWindow,
    filters: RevenueFilters,
  ): Promise<RevenueReportResponseOutput> {
    const cte = paymentsCte(filters);
    const from = utcTs(win.from);
    const to = utcTs(win.to);
    const bucket = bucketSql(sql.raw("at"), win.bucket);
    const subBucketCreated = bucketSql(sql.raw("s.created_at"), win.bucket);
    const subBucketEnded = bucketSql(SUB_END, win.bucket);
    const prevFrom = win.previousFrom;
    const prevTo = win.previousTo;

    type BreakdownSqlRow = QueryResultRow & {
      key: string | null;
      usd: NumLike;
      amount: NumLike;
      payments: NumLike;
      customers: NumLike;
      failed: NumLike;
      refunds: NumLike;
    };
    const breakdown = (dimension: string): SQL => sql`${cte},
      d AS (SELECT pa.*, ${sql.raw(dimension)} AS dim FROM pa)
      SELECT d.dim AS key,
        sum(d.usd) FILTER (WHERE d.paid AND d.at >= ${from} AND d.at < ${to}) AS usd,
        sum(d.amount) FILTER (WHERE d.paid AND d.at >= ${from} AND d.at < ${to}) AS amount,
        count(*) FILTER (WHERE d.paid AND d.at >= ${from} AND d.at < ${to}) AS payments,
        count(DISTINCT d.user_id) FILTER (WHERE d.paid AND d.at >= ${from} AND d.at < ${to}) AS customers,
        count(*) FILTER (WHERE d.status = ${PaymentStatus.FAILED} AND d.at >= ${from} AND d.at < ${to}) AS failed,
        sum(r.refund) AS refunds
      FROM d
      LEFT JOIN LATERAL (
        SELECT sum(${usdSql("pr.amount", "pr.currency")}) AS refund
        FROM payment_refunds pr
        WHERE pr.transaction_id = d.id
          AND pr.status = ${RefundStatus.SUCCEEDED}
          AND pr.created_at >= ${from} AND pr.created_at < ${to}
      ) r ON true
      WHERE (d.at >= ${from} AND d.at < ${to}) OR r.refund IS NOT NULL
      GROUP BY d.dim
      ORDER BY 2 DESC NULLS LAST
      LIMIT ${BREAKDOWN_LIMIT}`;

    const [
      current,
      previous,
      subsNow,
      subsPrev,
      series,
      subSeries,
      byPlan,
      byCurrency,
      byProcessor,
      recent,
      trend,
    ] = await Promise.all([
      RevenueReportRepository.paymentTotals(filters, win.from, win.to),
      prevFrom && prevTo
        ? RevenueReportRepository.paymentTotals(filters, prevFrom, prevTo)
        : Promise.resolve(null),
      RevenueReportRepository.subscriptionTotals(
        filters,
        win.from,
        new Date(Math.min(win.to.getTime(), Date.now())),
      ),
      prevFrom && prevTo
        ? RevenueReportRepository.subscriptionTotals(filters, prevFrom, prevTo)
        : Promise.resolve(null),
      db.execute<
        QueryResultRow & {
          bucket: string;
          kind: string;
          provider: string;
          usd: NumLike;
        }
      >(sql`${cte}
        SELECT ${bucket} AS bucket, kind, provider, sum(usd) AS usd
        FROM pa WHERE paid AND at >= ${from} AND at < ${to}
        GROUP BY 1, 2, 3`),
      db.execute<
        QueryResultRow & { bucket: string; created: NumLike; churned: NumLike }
      >(sql`
        SELECT bucket, sum(created) AS created, sum(churned) AS churned FROM (
          SELECT ${subBucketCreated} AS bucket, 1 AS created, 0 AS churned
          FROM subscriptions s
          WHERE ${subsFilter(filters)} AND s.created_at >= ${tz(win.from)} AND s.created_at < ${tz(win.to)}
          UNION ALL
          SELECT ${subBucketEnded}, 0, 1
          FROM subscriptions s
          WHERE ${subsFilter(filters)} AND ${SUB_END} >= ${tz(win.from)} AND ${SUB_END} < ${tz(win.to)}
        ) x GROUP BY 1`),
      db.execute<BreakdownSqlRow>(breakdown("COALESCE(plan, product, kind)")),
      db.execute<BreakdownSqlRow>(breakdown("currency")),
      db.execute<BreakdownSqlRow>(breakdown("provider")),
      db.execute<
        QueryResultRow & {
          id: string;
          user_id: string;
          email: string | null;
          amount: NumLike;
          currency: string;
          usd: NumLike;
          status: string;
          provider: string;
          mode: string;
          kind: string;
          plan: string | null;
          sub_id: string | null;
          at: string;
        }
      >(sql`${cte}
        SELECT pa.id::text AS id, pa.user_id::text AS user_id, u.email,
          pa.amount, pa.currency, pa.usd, pa.status, pa.provider, pa.mode,
          pa.kind, COALESCE(pa.plan, pa.product) AS plan, pa.sub_id::text AS sub_id,
          to_char(pa.at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS at
        FROM pa LEFT JOIN users u ON u.id = pa.user_id
        WHERE pa.at >= ${from} AND pa.at < ${to}
        ORDER BY pa.at DESC
        LIMIT ${RECENT_LIMIT}`),
      RevenueReportRepository.subscriptionTrend(win, filters),
    ]);

    const seriesFor = (column: "kind" | "provider", key: string): number[] =>
      fillBuckets(
        win.buckets,
        series.rows
          .filter((r) => r[column] === key)
          .map((r) => ({ bucket: r.bucket, value: round(num(r.usd)) })),
      );

    const toBreakdown = (
      rows: BreakdownSqlRow[],
      withAmount: boolean,
    ): BreakdownRow[] =>
      rows.map((r) => ({
        key: r.key,
        metrics: {
          revenueUsd: round(num(r.usd)),
          ...(withAmount ? { amount: round(num(r.amount)) } : {}),
          payments: num(r.payments),
          customers: num(r.customers),
          failed: num(r.failed),
          refundsUsd: round(num(r.refunds)),
        },
      }));

    const recentPayments = recent.rows.flatMap((r) => {
      const parsed = recentPaymentSchema.safeParse({
        id: r.id,
        userId: r.user_id,
        email: r.email,
        amount: round(num(r.amount)),
        currency: r.currency,
        usd: round(num(r.usd)),
        status: r.status,
        provider: r.provider,
        mode: r.mode,
        kind: KIND_FROM_SQL[r.kind] ?? RevenueKind.PACK,
        plan: r.plan,
        subscriptionId: r.sub_id,
        createdAt: r.at,
      });
      return parsed.success ? [parsed.data] : [];
    });

    const providers = filters.provider
      ? [filters.provider]
      : [
          ...new Set<string>([
            PaymentProvider.STRIPE,
            PaymentProvider.NOWPAYMENTS,
            ...series.rows.map((r) => r.provider),
          ]),
        ];

    return {
      window: serializeWindow(win),
      appliedFilters: {
        kind: filters.kind,
        provider: filters.provider ?? null,
        currency: filters.currency ?? null,
        plan: filters.plan ?? null,
        includeInternal: filters.includeInternal,
      },
      kpis: {
        grossRevenueUsd: kpi(current.gross, previous?.gross ?? null),
        netRevenueUsd: kpi(net(current), previous ? net(previous) : null),
        refundsUsd: kpi(current.refunds, previous?.refunds ?? null),
        mrrUsd: kpi(subsNow.mrr, subsPrev?.mrr ?? null),
        payingCustomers: kpi(current.paying, previous?.paying ?? null),
        activeSubscriptions: kpi(subsNow.active, subsPrev?.active ?? null),
        newSubscriptions: kpi(subsNow.created, subsPrev?.created ?? null),
        churnedSubscriptions: kpi(subsNow.churned, subsPrev?.churned ?? null),
        renewals: kpi(current.renewals, previous?.renewals ?? null),
        firstPayments: kpi(
          current.firstPayments,
          previous?.firstPayments ?? null,
        ),
        packPurchases: kpi(current.packs, previous?.packs ?? null),
        disputes: kpi(current.disputes, previous?.disputes ?? null),
        failedPayments: kpi(current.failed, previous?.failed ?? null),
      },
      revenueByKind: {
        buckets: win.buckets,
        series: (KIND_SQL[filters.kind]
          ? [KIND_SQL[filters.kind] ?? ""]
          : ["pack", "newSubscription", "renewal"]
        ).map((key) => ({
          key,
          values: seriesFor("kind", key),
        })),
      },
      revenueByProcessor: {
        buckets: win.buckets,
        series: providers.map((key) => ({
          key,
          values: seriesFor("provider", key),
        })),
      },
      subscriptionFlow: {
        buckets: win.buckets,
        series: [
          {
            key: "new",
            values: fillBuckets(
              win.buckets,
              subSeries.rows.map((r) => ({
                bucket: r.bucket,
                value: num(r.created),
              })),
            ),
          },
          {
            key: "churned",
            values: fillBuckets(
              win.buckets,
              subSeries.rows.map((r) => ({
                bucket: r.bucket,
                value: num(r.churned),
              })),
            ),
          },
        ],
      },
      mrrTrend: {
        buckets: win.buckets,
        series: [
          { key: "mrrUsd", values: trend.mrr },
          { key: "activeSubscriptions", values: trend.active },
          { key: "churnRate", values: trend.churn30 },
        ],
      },
      byPlan: toBreakdown(byPlan.rows, false),
      byCurrency: toBreakdown(byCurrency.rows, true),
      byProcessor: toBreakdown(byProcessor.rows, false),
      recentPayments,
      fxRates: REVENUE_FX_RATES.flatMap((rate) =>
        rate.currency === "USD" ? [] : [rate],
      ),
    };
  }
}
