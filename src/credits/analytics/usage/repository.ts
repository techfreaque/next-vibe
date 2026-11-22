/**
 * Credit Usage Report repository.
 *
 * Definitions (the widget hints repeat them):
 * - Usage = credit_transactions of type USAGE (amount < 0), minus signup
 *   carryover rows (they mirror guest spend already counted on the guest wallet).
 * - Account vs guest: a row is account spend when the wallet belongs to a user,
 *   or the spending lead (metadata.actorLeadId, else the wallet lead) was linked
 *   to a user at the time of the spend. Everything else is guest spend.
 * - Funding: credit_transactions.funding_type, stamped at write time by the
 *   deduction walk (free allowance, signup/newsletter bonus, referral,
 *   purchased pack, subscription, admin grant). Historical rows were
 *   backfilled where exact; the rest is free_unknown / pack_unknown. Rows
 *   without a stamp fall back to the pack join (origin missing when gone).
 * - Spend USD = credits x CREDIT_VALUE_USD (list value, not cash received).
 * - Upstream cost = metadata.upstreamCostUsd + fallbackCostUsd, only on rows
 *   that recorded it. Margin is computed over those rows only; costCoverage is
 *   the share of spend that has cost data.
 * - Admin (internal) accounts are excluded unless includeInternal is set.
 */

import "server-only";

import { type SQL, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
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

import { CREDIT_VALUE_USD } from "@/products/constants";

import {
  CreditFundingType,
  CreditPackType,
  CreditTransactionType,
} from "../../enum";
import {
  creditFeatureLabels,
  LEGACY_FEATURE_IDS,
  normalizeCreditFeature,
} from "../../feature-label";
import { notSignupCarryoverRaw } from "../../usage-filter";
import type {
  CreditUsageReportRequestOutput,
  CreditUsageReportResponseOutput,
} from "./definition";
import { UsageActor, UsageCreditKind } from "./enum";
import type { CreditUsageReportT } from "./i18n";

type NumLike = string | number | null;

const BREAKDOWN_LIMIT = 25;

/** Funding series key -> credit_transactions.funding_type value. */
const FUNDING_TYPE = {
  allowance: CreditFundingType.FREE_ALLOWANCE,
  freeBonus: CreditFundingType.FREE_BONUS,
  freeUnknown: CreditFundingType.FREE_UNKNOWN,
  purchased: CreditFundingType.PURCHASED,
  subscription: CreditFundingType.SUBSCRIPTION,
  referral: CreditFundingType.REFERRAL,
  adminGrant: CreditFundingType.ADMIN_GRANT,
  packUnknown: CreditFundingType.PACK_UNKNOWN,
} as const;

type FundingKey = keyof typeof FUNDING_TYPE;

const FREE_FUNDING: readonly FundingKey[] = [
  "allowance",
  "freeBonus",
  "freeUnknown",
];
const GRANT_FUNDING: readonly FundingKey[] = ["referral", "adminGrant"];
const PACK_FUNDING: readonly FundingKey[] = [
  "purchased",
  "subscription",
  ...GRANT_FUNDING,
  "packUnknown",
];

const FUNDING_KEYS: readonly FundingKey[] = [...FREE_FUNDING, ...PACK_FUNDING];

/** Funding series relevant to each credit-kind filter (no always-zero rows). */
const FUNDING_SERIES: Record<
  CreditUsageReportRequestOutput["creditKind"],
  readonly FundingKey[]
> = {
  [UsageCreditKind.ALL]: [...FREE_FUNDING, ...PACK_FUNDING],
  [UsageCreditKind.FREE]: FREE_FUNDING,
  [UsageCreditKind.PACK]: PACK_FUNDING,
  [UsageCreditKind.PURCHASED]: ["purchased"],
  [UsageCreditKind.SUBSCRIPTION]: ["subscription"],
  [UsageCreditKind.GRANTS]: GRANT_FUNDING,
};

function fundingList(keys: readonly FundingKey[]): SQL {
  return sql.join(
    keys.map((key) => sql`${FUNDING_TYPE[key]}`),
    sql`, `,
  );
}

/** sum(c) of the rows whose funding bucket is one of `keys`. */
function fundingSum(keys: readonly FundingKey[], prefix = ""): SQL {
  return sql`sum(${sql.raw(`${prefix}c`)}) FILTER (WHERE ${sql.raw(`${prefix}bucket`)} IN (${fundingList(keys)}))`;
}
const TOP_SPENDER_LIMIT = 25;

/** Model breakdown key of a charge without a model (media, tools). */
const FEATURE_KEY_PREFIX = "feature:";
/** Feature of model charges without a ledger feature (translated in the widget). */
const CHAT_FEATURE = "chat";

function num(value: NumLike | undefined): number {
  return value === null || value === undefined ? 0 : Number(value);
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/** Whole credits from 10 up, one decimal below (small tool charges). */
function roundCredits(value: number): number {
  return Math.abs(value) >= 10 ? Math.round(value) : round(value, 1);
}

function ratio(part: number, whole: number): number {
  return whole > 0 ? part / whole : 0;
}

/** Timestamp literal comparable with UTC timestamp-without-time-zone columns. */
function ts(date: Date): SQL {
  return sql`(${date.toISOString()}::timestamptz AT TIME ZONE 'UTC')`;
}

/** Credits of a base row when its funding bucket is one of `keys`. */
function fundedPart(keys: readonly FundingKey[]): SQL {
  return sql`(CASE WHEN b.bucket IN (${fundingList(keys)}) THEN b.credits ELSE 0 END)`;
}

/**
 * Ledger feature id: legacy rows stored a localized label, folded onto the
 * stable id here so one feature is one row (credits/feature-label.ts).
 */
function featureIdSql(feature: SQL): SQL {
  return sql`(CASE ${feature} ${sql.join(
    Object.entries(LEGACY_FEATURE_IDS).map(
      ([legacy, id]) => sql`WHEN ${legacy} THEN ${id}`,
    ),
    sql` `,
  )} ELSE ${feature} END)`;
}

export interface CreditUsageFilters {
  actor: CreditUsageReportRequestOutput["actor"];
  creditKind: CreditUsageReportRequestOutput["creditKind"];
  model?: string;
  feature?: string;
  provider?: string;
  includeInternal: boolean;
}

/**
 * `WITH base AS (...), f AS (...)` covering [start, end): one row per usage
 * transaction with the classified spender, the credits of the selected kind
 * (`c`), their free part (`fc`), cost (`cost`) and whether cost was recorded.
 */
export function creditUsageCte(
  start: Date,
  end: Date,
  filters: CreditUsageFilters,
): SQL {
  const usage = CreditTransactionType.USAGE;
  const realUsage = sql.raw(notSignupCarryoverRaw("t"));
  const credits: SQL =
    filters.creditKind === UsageCreditKind.ALL
      ? sql.raw("b.credits")
      : fundedPart(FUNDING_SERIES[filters.creditKind]);
  const freePart =
    filters.creditKind === UsageCreditKind.ALL ||
    filters.creditKind === UsageCreditKind.FREE
      ? sql.raw("b.free_credits")
      : sql.raw("0");
  const actorFilter =
    filters.actor === UsageActor.GUESTS
      ? sql`AND b.user_id IS NULL`
      : filters.actor === UsageActor.USERS
        ? sql`AND b.user_id IS NOT NULL`
        : sql``;
  const internalFilter = filters.includeInternal
    ? sql``
    : sql`AND (b.user_id IS NULL OR b.user_id NOT IN (SELECT user_id FROM user_roles WHERE role = ${UserPermissionRole.ADMIN}))`;
  const modelFilter = filters.model
    ? sql`AND b.model = ${filters.model}`
    : sql``;
  const featureFilter = filters.feature
    ? sql`AND b.feature = ${filters.feature}`
    : sql``;
  const providerFilter = filters.provider
    ? sql`AND b.provider = ${filters.provider}`
    : sql``;

  return sql`
    WITH base AS (
      SELECT
        t.created_at AS at,
        (-t.amount)::numeric AS credits,
        CASE WHEN fund.bucket IN (${fundingList(FREE_FUNDING)})
          THEN -t.amount ELSE 0 END::numeric AS free_credits,
        fund.bucket,
        t.model_id AS model,
        COALESCE(NULLIF(${featureIdSql(sql`t.feature`)}, ''), CASE WHEN t.model_id IS NOT NULL THEN 'chat' END) AS feature,
        NULLIF(t.metadata->>'upstreamProvider', '') AS provider,
        (t.metadata ? 'upstreamCostUsd' OR t.metadata ? 'fallbackCostUsd') AS has_cost,
        (COALESCE((t.metadata->>'upstreamCostUsd')::numeric, 0)
          + COALESCE((t.metadata->>'fallbackCostUsd')::numeric, 0)) AS cost_usd,
        COALESCE(w.user_id, link.user_id) AS user_id,
        CASE WHEN COALESCE(w.user_id, link.user_id) IS NULL
          THEN COALESCE(actor.lead_id, w.lead_id) END AS lead_id
      FROM credit_transactions t
      JOIN credit_wallets w ON w.id = t.wallet_id
      LEFT JOIN credit_packs pk ON pk.id = t.pack_id
      LEFT JOIN LATERAL (
        -- Unstamped rows (written by a build before funding_type existed).
        SELECT COALESCE(t.funding_type, CASE
          WHEN pk.type = ${CreditPackType.SUBSCRIPTION} THEN ${CreditFundingType.SUBSCRIPTION}
          WHEN pk.type = ${CreditPackType.PERMANENT} THEN ${CreditFundingType.PURCHASED}
          WHEN pk.type = ${CreditPackType.EARNED} THEN ${CreditFundingType.REFERRAL}
          WHEN pk.type = ${CreditPackType.BONUS} THEN ${CreditFundingType.ADMIN_GRANT}
          WHEN w.lead_id IS NOT NULL
            AND COALESCE((t.metadata->>'packCreditsUsed')::numeric, 0) = 0
            THEN ${CreditFundingType.FREE_UNKNOWN}
          ELSE ${CreditFundingType.PACK_UNKNOWN} END) AS bucket
      ) fund ON true
      LEFT JOIN LATERAL (
        SELECT CASE WHEN t.metadata->>'actorLeadId' ~ '^[0-9a-fA-F-]{36}$'
          THEN (t.metadata->>'actorLeadId')::uuid END AS lead_id
      ) actor ON true
      LEFT JOIN LATERAL (
        SELECT l.user_id FROM user_lead_links l
        WHERE w.user_id IS NULL
          AND l.lead_id = COALESCE(actor.lead_id, w.lead_id)
          AND l.linked_at <= t.created_at
        ORDER BY l.linked_at
        LIMIT 1
      ) link ON true
      WHERE t.type = ${usage}
        AND t.amount < 0
        AND ${realUsage}
        AND t.created_at >= ${ts(start)}
        AND t.created_at < ${ts(end)}
    ),
    f AS (
      SELECT
        b.at, b.model, b.feature, b.provider, b.has_cost, b.user_id, b.lead_id, b.bucket,
        ${credits} AS c,
        LEAST(${credits}, ${freePart}) AS fc,
        CASE WHEN b.credits > 0 THEN b.cost_usd * ${credits} / b.credits ELSE 0 END AS cost
      FROM base b
      WHERE ${credits} > 0
        ${actorFilter} ${internalFilter} ${modelFilter} ${featureFilter} ${providerFilter}
    )`;
}

interface UsageTotals {
  credits: number;
  guestCredits: number;
  freeCredits: number;
  costUsd: number;
  costedCredits: number;
  /** Provider cost of the free-allowance part of spend (rows with cost data). */
  freeCostUsd: number;
  /** Credits drawn from purchased or subscription packs. */
  paidCredits: number;
  /** Pack-funded credits whose pack reference is gone. */
  unknownCredits: number;
  /** Free-allowance credits on rows with recorded cost. */
  freeCostedCredits: number;
  spenders: number;
}

function marginUsd(totals: UsageTotals): number {
  return totals.costedCredits * CREDIT_VALUE_USD - totals.costUsd;
}

function kpi(value: number, previous: number | null, digits = 2): Kpi {
  return {
    value: round(value, digits),
    previous: previous === null ? null : round(previous, digits),
  };
}

export class CreditUsageReportRepository {
  static async getReport(
    data: CreditUsageReportRequestOutput,
    logger: EndpointLogger,
    t: CreditUsageReportT,
    locale: CountryLanguage,
  ): Promise<ResponseType<CreditUsageReportResponseOutput>> {
    try {
      const floor = await db.execute<QueryResultRow & { first: string | null }>(
        sql`SELECT min(created_at)::text AS first FROM credit_transactions WHERE type = ${CreditTransactionType.USAGE}`,
      );
      const firstRaw = floor.rows[0]?.first;
      const dataFloor = firstRaw
        ? new Date(`${firstRaw.replace(" ", "T")}Z`)
        : null;
      const win = resolveAnalyticsWindow(data, new Date(), dataFloor);
      const filters: CreditUsageFilters = {
        actor: data.actor,
        creditKind: data.creditKind,
        model: data.model || undefined,
        feature: data.feature
          ? normalizeCreditFeature(data.feature)
          : undefined,
        provider: data.provider || undefined,
        includeInternal: data.includeInternal,
      };
      const report = await CreditUsageReportRepository.build(win, filters);
      // Feature ids -> labels in the viewer's locale (display time).
      const featureIds = [
        ...report.byFeature.map((row) => row.key),
        ...report.byModel.map((row) =>
          row.key?.startsWith(FEATURE_KEY_PREFIX)
            ? row.key.slice(FEATURE_KEY_PREFIX.length)
            : null,
        ),
        ...report.topSpenders.map((row) => row.topModel),
        filters.feature ?? null,
      ].filter((id): id is string => id !== null && id !== CHAT_FEATURE);
      return success({
        ...report,
        featureLabels: await creditFeatureLabels(featureIds, locale),
      });
    } catch (error) {
      logger.error("Failed to build credit usage report", parseError(error));
      return fail({
        message: t("get.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Totals for the current and previous win (null previous = all-time). */
  static async totals(
    win: AnalyticsWindow,
    filters: CreditUsageFilters,
  ): Promise<{ current: UsageTotals; previous: UsageTotals | null }> {
    const start = win.previousFrom ?? win.from;
    const cte = creditUsageCte(start, win.to, filters);
    const from = ts(win.from);
    const result = await db.execute<
      QueryResultRow & {
        period: string;
        credits: NumLike;
        guest: NumLike;
        free: NumLike;
        cost: NumLike;
        costed: NumLike;
        free_cost: NumLike;
        paid: NumLike;
        unknown: NumLike;
        free_costed: NumLike;
        spenders: NumLike;
      }
    >(sql`${cte}
      SELECT
        CASE WHEN at >= ${from} THEN 'current' ELSE 'previous' END AS period,
        sum(c) AS credits,
        sum(c) FILTER (WHERE user_id IS NULL) AS guest,
        sum(fc) AS free,
        sum(cost) FILTER (WHERE has_cost) AS cost,
        sum(c) FILTER (WHERE has_cost) AS costed,
        sum(CASE WHEN c > 0 THEN cost * fc / c ELSE 0 END) FILTER (WHERE has_cost) AS free_cost,
        ${fundingSum(["purchased", "subscription"])} AS paid,
        ${fundingSum(["packUnknown"])} AS unknown,
        sum(fc) FILTER (WHERE has_cost) AS free_costed,
        count(DISTINCT COALESCE(user_id::text, 'lead:' || lead_id::text)) AS spenders
      FROM f
      GROUP BY 1`);
    const pick = (period: string): UsageTotals => {
      const row = result.rows.find((r) => r.period === period);
      return {
        credits: num(row?.credits),
        guestCredits: num(row?.guest),
        freeCredits: num(row?.free),
        costUsd: num(row?.cost),
        costedCredits: num(row?.costed),
        freeCostUsd: num(row?.free_cost),
        paidCredits: num(row?.paid),
        unknownCredits: num(row?.unknown),
        freeCostedCredits: num(row?.free_costed),
        spenders: num(row?.spenders),
      };
    };
    return {
      current: pick("current"),
      previous: win.previousFrom ? pick("previous") : null,
    };
  }

  static async build(
    win: AnalyticsWindow,
    filters: CreditUsageFilters,
  ): Promise<Omit<CreditUsageReportResponseOutput, "featureLabels">> {
    const cte = creditUsageCte(win.from, win.to, filters);
    const bucket = bucketSql(sql.raw("at"), win.bucket);

    const wideCte = creditUsageCte(
      win.previousFrom ?? win.from,
      win.to,
      filters,
    );
    const inCurrent = sql`at >= ${ts(win.from)}`;
    const breakdown = (dimension: string): SQL => sql`${wideCte}
      SELECT ${sql.raw(dimension)} AS key,
        sum(c) FILTER (WHERE ${inCurrent}) AS credits,
        sum(c) FILTER (WHERE NOT (${inCurrent})) AS prev,
        sum(cost) FILTER (WHERE has_cost AND ${inCurrent}) AS cost,
        sum(c) FILTER (WHERE has_cost AND ${inCurrent}) AS costed,
        sum(c) FILTER (WHERE user_id IS NULL AND ${inCurrent}) AS guest,
        count(DISTINCT COALESCE(user_id::text, 'lead:' || lead_id::text)) FILTER (WHERE ${inCurrent}) AS spenders
      FROM f GROUP BY 1
      HAVING COALESCE(sum(c), 0) > 0
      ORDER BY COALESCE(sum(c) FILTER (WHERE ${inCurrent}), 0) DESC, 3 DESC NULLS LAST
      LIMIT ${BREAKDOWN_LIMIT}`;

    type BreakdownSqlRow = QueryResultRow & {
      key: string | null;
      credits: NumLike;
      prev: NumLike;
      cost: NumLike;
      costed: NumLike;
      guest: NumLike;
      spenders: NumLike;
    };

    const [totals, series, byModel, byFeature, byProvider, spenders] =
      await Promise.all([
        CreditUsageReportRepository.totals(win, filters),
        db.execute<
          QueryResultRow & {
            bucket: string;
            users: NumLike;
            guests: NumLike;
            free: NumLike;
            pack: NumLike;
            spend: NumLike;
            costed: NumLike;
            cost: NumLike;
          } & Record<`fund_${FundingKey}`, NumLike>
        >(sql`${cte}
          SELECT ${bucket} AS bucket,
            sum(c) FILTER (WHERE user_id IS NOT NULL) AS users,
            sum(c) FILTER (WHERE user_id IS NULL) AS guests,
            sum(fc) AS free,
            sum(c - fc) AS pack,
            ${sql.join(
              FUNDING_KEYS.map(
                (key) =>
                  sql`${fundingSum([key])} AS ${sql.identifier(`fund_${key}`)}`,
              ),
              sql`, `,
            )},
            sum(c) AS spend,
            sum(c) FILTER (WHERE has_cost) AS costed,
            sum(cost) FILTER (WHERE has_cost) AS cost
          FROM f GROUP BY 1`),
        db.execute<BreakdownSqlRow>(
          breakdown("COALESCE(model, 'feature:' || feature)"),
        ),
        db.execute<BreakdownSqlRow>(breakdown("feature")),
        db.execute<BreakdownSqlRow>(breakdown("provider")),
        db.execute<
          QueryResultRow & {
            user_id: string | null;
            lead_id: string | null;
            email: string | null;
            credits: NumLike;
            free: NumLike;
            tx: NumLike;
            cost: NumLike;
            costed: NumLike;
            purchased: NumLike;
            subscription: NumLike;
            grants: NumLike;
            pack_unknown: NumLike;
            top_model: string | null;
            last: string;
          }
        >(sql`${cte}
          SELECT f.user_id::text AS user_id, f.lead_id::text AS lead_id, u.email,
            sum(f.c) AS credits, sum(f.fc) AS free, count(*) AS tx,
            sum(f.cost) FILTER (WHERE f.has_cost) AS cost,
            sum(f.c) FILTER (WHERE f.has_cost) AS costed,
            ${fundingSum(["purchased"], "f.")} AS purchased,
            ${fundingSum(["subscription"], "f.")} AS subscription,
            ${fundingSum(GRANT_FUNDING, "f.")} AS grants,
            ${fundingSum(["packUnknown"], "f.")} AS pack_unknown,
            mode() WITHIN GROUP (ORDER BY COALESCE(f.model, f.feature)) AS top_model,
            to_char(max(f.at), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS last
          FROM f LEFT JOIN users u ON u.id = f.user_id
          GROUP BY f.user_id, f.lead_id, u.email
          ORDER BY 4 DESC, max(f.at) DESC, 1, 2
          LIMIT ${TOP_SPENDER_LIMIT}`),
      ]);

    const pickSeries = (
      key:
        | "users"
        | "guests"
        | "free"
        | "pack"
        | "spend"
        | "costed"
        | "cost"
        | `fund_${FundingKey}`,
      factor = 1,
    ): number[] =>
      fillBuckets(
        win.buckets,
        series.rows.map((r) => ({
          bucket: r.bucket,
          value:
            factor === 1 && key !== "cost"
              ? roundCredits(num(r[key]))
              : round(num(r[key]) * factor, 4),
        })),
      );

    const toBreakdown = (rows: BreakdownSqlRow[]): BreakdownRow[] =>
      rows.map((r) => {
        const credits = num(r.credits);
        const costed = num(r.costed);
        // Rows with previous spend but none now show as -100% declines.
        const cost = num(r.cost);
        const costedUsd = costed * CREDIT_VALUE_USD;
        return {
          key: r.key,
          metrics: {
            credits: roundCredits(credits),
            usd: round(credits * CREDIT_VALUE_USD),
            ...(costed > 0 ? { costUsd: round(cost, 4) } : {}),
            costCoverage: round(ratio(costed, credits), 4),
            ...(win.previousFrom && num(r.prev) > 0
              ? { change: round((credits - num(r.prev)) / num(r.prev), 4) }
              : {}),
            ...(costed > 0
              ? { marginPct: round(ratio(costedUsd - cost, costedUsd), 4) }
              : {}),
            spenders: num(r.spenders),
            guestShare: round(ratio(num(r.guest), credits), 4),
          },
        };
      });

    const cur = totals.current;
    const prev = totals.previous;
    // Provider cost is only recorded since mid-Nov 2026: a previous period
    // without any costed row has no cost data, which is not "$0 cost".
    const prevCost = prev && prev.costedCredits > 0 ? prev : null;
    const curMargin = marginUsd(cur);
    const prevMargin = prevCost ? marginUsd(prevCost) : null;

    return {
      window: serializeWindow(win),
      appliedFilters: {
        actor: filters.actor,
        creditKind: filters.creditKind,
        model: filters.model ?? null,
        feature: filters.feature ?? null,
        provider: filters.provider ?? null,
        includeInternal: filters.includeInternal,
      },
      kpis: {
        creditsSpent: kpi(cur.credits, prev?.credits ?? null),
        spendUsd: kpi(
          cur.credits * CREDIT_VALUE_USD,
          prev ? prev.credits * CREDIT_VALUE_USD : null,
        ),
        guestShare: kpi(
          ratio(cur.guestCredits, cur.credits),
          prev ? ratio(prev.guestCredits, prev.credits) : null,
          4,
        ),
        freeShare: kpi(
          ratio(cur.freeCredits, cur.credits),
          prev ? ratio(prev.freeCredits, prev.credits) : null,
          4,
        ),
        upstreamCostUsd: kpi(cur.costUsd, prevCost?.costUsd ?? null),
        freeCostUsd: kpi(cur.freeCostUsd, prevCost?.freeCostUsd ?? null),
        // Share of spend with a known funding source (origin-missing excluded).
        paidShare: kpi(
          ratio(cur.paidCredits, cur.credits - cur.unknownCredits),
          prev
            ? ratio(prev.paidCredits, prev.credits - prev.unknownCredits)
            : null,
          4,
        ),
        originMissingShare: kpi(
          ratio(cur.unknownCredits, cur.credits),
          prev ? ratio(prev.unknownCredits, prev.credits) : null,
          4,
        ),
        freeCredits: kpi(cur.freeCredits, prev?.freeCredits ?? null),
        freeCostCoverage: kpi(
          ratio(cur.freeCostedCredits, cur.freeCredits),
          prevCost
            ? ratio(prevCost.freeCostedCredits, prevCost.freeCredits)
            : null,
          4,
        ),
        costedSpendUsd: kpi(
          cur.costedCredits * CREDIT_VALUE_USD,
          prevCost ? prevCost.costedCredits * CREDIT_VALUE_USD : null,
        ),
        marginUsd: kpi(curMargin, prevMargin),
        marginPct: kpi(
          ratio(curMargin, cur.costedCredits * CREDIT_VALUE_USD),
          prevCost && prevMargin !== null
            ? ratio(prevMargin, prevCost.costedCredits * CREDIT_VALUE_USD)
            : null,
          4,
        ),
        costCoverage: kpi(
          ratio(cur.costedCredits, cur.credits),
          prev ? ratio(prev.costedCredits, prev.credits) : null,
          4,
        ),
        activeSpenders: kpi(cur.spenders, prev?.spenders ?? null, 0),
      },
      spendByActor: {
        buckets: win.buckets,
        series: [
          ...(filters.actor === UsageActor.GUESTS
            ? []
            : [{ key: "users", values: pickSeries("users") }]),
          ...(filters.actor === UsageActor.USERS ||
          filters.creditKind === UsageCreditKind.PURCHASED ||
          filters.creditKind === UsageCreditKind.SUBSCRIPTION
            ? []
            : [{ key: "guests", values: pickSeries("guests") }]),
        ],
      },
      spendByFunding: {
        buckets: win.buckets,
        series: FUNDING_SERIES[filters.creditKind].map((key) => ({
          key,
          values: pickSeries(`fund_${key}`),
        })),
      },
      spendByKind: {
        buckets: win.buckets,
        series: [
          { key: "free", values: pickSeries("free") },
          { key: "pack", values: pickSeries("pack") },
        ],
      },
      costVsSpend: {
        buckets: win.buckets,
        series: [
          { key: "spendUsd", values: pickSeries("spend", CREDIT_VALUE_USD) },
          {
            key: "costedSpendUsd",
            values: pickSeries("costed", CREDIT_VALUE_USD),
          },
          { key: "upstreamCostUsd", values: pickSeries("cost") },
        ],
      },
      byModel: toBreakdown(byModel.rows),
      byFeature: toBreakdown(byFeature.rows),
      byProvider: toBreakdown(byProvider.rows),
      topSpenders: spenders.rows.map((r) => {
        const credits = num(r.credits);
        return {
          userId: r.user_id,
          leadId: r.user_id ? null : r.lead_id,
          email: r.email,
          credits: roundCredits(credits),
          usd: round(credits * CREDIT_VALUE_USD),
          freeShare: round(ratio(num(r.free), credits), 4),
          costUsd: r.cost === null ? null : round(num(r.cost)),
          marginPct:
            num(r.costed) > 0
              ? round(
                  ratio(
                    num(r.costed) * CREDIT_VALUE_USD - num(r.cost),
                    num(r.costed) * CREDIT_VALUE_USD,
                  ),
                  4,
                )
              : null,
          purchasedShare: round(ratio(num(r.purchased), credits), 4),
          subscriptionShare: round(ratio(num(r.subscription), credits), 4),
          grantsShare: round(ratio(num(r.grants), credits), 4),
          unknownShare: round(ratio(num(r.pack_unknown), credits), 4),
          topModel: r.top_model,
          transactions: num(r.tx),
          lastActivity: r.last,
        };
      }),
    };
  }
}
