import "server-only";

/**
 * Acquisition overview for the business overview (src/analytics/business).
 * Same definitions as the acquisition and abuse reports, no segment filters.
 *
 * topSources keys are LeadChannelFilter values, so they can be passed as
 * `channelType` to the acquisition-report and leads-list endpoints.
 */
import { sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  BreakdownRow,
  Kpi,
  TimeSeries,
} from "next-vibe/unified-ui/analytics/schema";
import {
  type AnalyticsWindow,
  fillBuckets,
} from "next-vibe/unified-ui/analytics/window";
import {
  bucketSql,
  inPreviousWindowSql,
  inWindowSql,
  utcSql,
} from "next-vibe/unified-ui/analytics/window-sql";
import type { QueryResultRow } from "pg";

import {
  REPORTABLE_PAYMENT_SQL,
  reportingUserSql,
  usdSql,
} from "@/payment/analytics/money-sql";
import { CheckoutMode, PaymentStatus } from "@/payment/enum";

import { computeFlaggedSummary, DEFAULT_MIN_LEADS } from "./abuse/repository";
import {
  computeAcquisitionCore,
  computeSignupsByChannel,
} from "./acquisition/repository";
import {
  AbuseGroupBy,
  BotFamily,
  CHANNEL_TYPE_TO_FILTER,
  LeadChannelFilter,
  LeadDimension,
  TrafficFilter,
} from "./enum";
import { scopedTranslation } from "./i18n";
import {
  dimensionColumn,
  humanLeadCreationsSql,
  leadFactsSql,
} from "./segment-sql";

/** Unsegmented platform headline, with the same event windows as Acquisition. */
export async function getAcquisitionHeadline(win: AnalyticsWindow): Promise<{
  humanLeads: Kpi;
  signups: Kpi;
  leadsTrend: number[];
  signupsTrend: number[];
}> {
  const leadCreated = sql`l.created_at`;
  const userCreated = sql`u.created_at`;
  const eventDate = sql`at`;
  // Every linked account is counted once, using the lead facts' journey-first
  // resolution and upper lead date bound. The unlinked branch is the same
  // fallback used by the unsegmented acquisition report.
  const { rows } = await db.execute<
    QueryResultRow & {
      key: "humanLeads" | "signups";
      bucket: string;
      current: number;
      previous: number;
    }
  >(sql`
    WITH events AS (
      SELECT 'humanLeads'::text AS key, created_at AS at
      FROM (${humanLeadCreationsSql(sql`
        (${inWindowSql(leadCreated, win)}) OR (${inPreviousWindowSql(leadCreated, win)})
      `)}) human_leads
      UNION ALL
      SELECT 'signups', u.created_at
      FROM users u
      WHERE ((${inWindowSql(userCreated, win)}) OR (${inPreviousWindowSql(userCreated, win)}))
        AND (
          EXISTS (
            SELECT 1 FROM growth_journeys j JOIN leads l ON l.id = j.lead_id
            WHERE j.user_id = u.id AND l.created_at < ${utcSql(win.to)}
          )
          OR EXISTS (
            SELECT 1 FROM leads l LEFT JOIN growth_journeys j ON j.lead_id = l.id
            WHERE l.converted_user_id = u.id AND l.created_at < ${utcSql(win.to)}
              AND (j.user_id IS NULL OR j.user_id = u.id)
          )
          OR (
            NOT EXISTS (SELECT 1 FROM growth_journeys j WHERE j.user_id = u.id)
            AND NOT EXISTS (SELECT 1 FROM leads l WHERE l.converted_user_id = u.id)
          )
        )
    )
    SELECT key, ${bucketSql(eventDate, win.bucket)} AS bucket,
      count(*) FILTER (WHERE ${inWindowSql(eventDate, win)})::int AS current,
      count(*) FILTER (WHERE ${inPreviousWindowSql(eventDate, win)})::int AS previous
    FROM events GROUP BY 1, 2
  `);
  const summarize = (
    key: "humanLeads" | "signups",
  ): { kpi: Kpi; trend: number[] } => {
    const matching = rows.filter((row) => row.key === key);
    return {
      kpi: {
        value: matching.reduce((sum, row) => sum + row.current, 0),
        previous: win.previousFrom
          ? matching.reduce((sum, row) => sum + row.previous, 0)
          : null,
      },
      trend: fillBuckets(
        win.buckets,
        matching.map(({ bucket, current }) => ({
          bucket,
          value: current,
        })),
      ),
    };
  };
  const leads = summarize("humanLeads");
  const signups = summarize("signups");
  return {
    humanLeads: leads.kpi,
    signups: signups.kpi,
    leadsTrend: leads.trend,
    signupsTrend: signups.trend,
  };
}

export interface AcquisitionOverview {
  kpis: {
    /** Human visits (lead has a browser user agent). */
    visits: Kpi;
    botVisits: Kpi;
    /** Visits of leads with no recorded user agent (neither human nor bot). */
    unknownVisits: Kpi;
    humanLeads: Kpi;
    botLeads: Kpi;
    unknownLeads: Kpi;
    signups: Kpi;
    firstChats: Kpi;
    payers: Kpi;
  };
  /** Series keys: visits, leads (human leads, same rule as kpis.humanLeads), signups. */
  trend: TimeSeries;
  /**
   * Period activity by first-touch channel (keys: LeadChannelFilter values).
   * leads = human leads created in the window; signups = kpis.signups split;
   * payers / revenueUsd = paying customers / gross revenue of the window (same
   * rule as the revenue report), unknown channel = UNATTRIBUTED. Columns sum to
   * the overview totals.
   */
  topSources: BreakdownRow[];
  abuse: {
    flaggedPrefixes: number;
    topPrefix: string | null;
    topPrefixLeads: number;
  };
}

/**
 * Payments collected in the window per first-touch channel of the paying
 * user. Same rule as the revenue report (paid = succeeded or refunded,
 * non-setup, real processor activity and the operating user audience), so the values sum to its gross revenue and
 * paying customers. Users without a journey land in UNATTRIBUTED.
 */
async function paymentsByChannel(
  win: AnalyticsWindow,
): Promise<Map<string, { payers: number; revenueUsd: number }>> {
  const { rows } = await db.execute<
    QueryResultRow & { key: string; payers: number; revenueUsd: number }
  >(sql`
    WITH paid AS (
      SELECT pt.user_id, ${usdSql("pt.amount", "pt.currency")} AS usd
      FROM payment_transactions pt
      WHERE ${REPORTABLE_PAYMENT_SQL}
        AND pt.mode <> ${CheckoutMode.SETUP}
        AND pt.status IN (${PaymentStatus.SUCCEEDED}, ${PaymentStatus.REFUNDED})
        AND ${inWindowSql(sql`pt.created_at`, win)}
        AND ${reportingUserSql("pt.user_id")}
    ),
    user_channel AS (
      SELECT DISTINCT ON (uid) uid, channel_type FROM (
        SELECT j.user_id AS uid, j.first_channel_type AS channel_type, j.first_touch_at AS touched
        FROM growth_journeys j WHERE j.user_id IS NOT NULL
        UNION ALL
        SELECT l.converted_user_id, j.first_channel_type, j.first_touch_at
        FROM leads l JOIN growth_journeys j ON j.lead_id = l.id
        WHERE l.converted_user_id IS NOT NULL
      ) touches
      ORDER BY uid, touched
    ),
    keyed AS (
      SELECT paid.user_id, paid.usd, (CASE ${sql.join(
        Object.entries(CHANNEL_TYPE_TO_FILTER).map(
          ([type, filter]) =>
            sql`WHEN uc.channel_type = ${type} THEN ${filter}`,
        ),
        sql` `,
      )} ELSE ${LeadChannelFilter.UNATTRIBUTED} END) AS key
      FROM paid LEFT JOIN user_channel uc ON uc.uid = paid.user_id
    )
    SELECT key, count(DISTINCT user_id)::int AS payers,
      coalesce(sum(usd), 0)::float8 AS "revenueUsd"
    FROM keyed GROUP BY key
  `);
  return new Map(
    rows.map((row) => [
      row.key,
      {
        payers: row.payers,
        revenueUsd: Math.round(row.revenueUsd * 100) / 100,
      },
    ]),
  );
}

/** The overview needs only new human leads per channel. Count that cohort
 * directly so the visits and revenue breakdown does not run a second time. */
async function newHumanLeadsByChannel(
  win: AnalyticsWindow,
): Promise<Map<string, number>> {
  const { rows } = await db.execute<
    QueryResultRow & { key: string; leads: number }
  >(sql`
    SELECT ${dimensionColumn(LeadDimension.CHANNEL_TYPE)} AS key, count(*)::int AS leads
    FROM (${leadFactsSql(inWindowSql(sql`l.created_at`, win))}) f
    WHERE f.bot_family = ${BotFamily.HUMAN}
    GROUP BY 1
  `);
  return new Map(rows.map((row) => [row.key, row.leads]));
}

export async function getAcquisitionOverview(
  win: AnalyticsWindow,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<AcquisitionOverview>> {
  try {
    const [core, humanLeads, signups, money, abuse] = await Promise.all([
      computeAcquisitionCore(win, {}),
      newHumanLeadsByChannel(win),
      computeSignupsByChannel(win),
      paymentsByChannel(win),
      // Crawler ranges (Meta, Bing, ...) are counted as bots above; the
      // abuse alert is about bursts that are not known bots.
      computeFlaggedSummary(
        win,
        { traffic: TrafficFilter.NOT_BOTS },
        AbuseGroupBy.IP_PREFIX,
        DEFAULT_MIN_LEADS,
      ),
    ]);
    const keys = Object.values(LeadChannelFilter).filter(
      (key) => key !== LeadChannelFilter.ALL,
    );
    const values = (key: string): number[] =>
      core.trend.series.find((entry) => entry.key === key)?.values ??
      win.buckets.map(() => 0);
    return success({
      kpis: {
        visits: core.kpis.humanVisits,
        botVisits: core.kpis.botVisits,
        unknownVisits: core.kpis.unknownVisits,
        humanLeads: core.kpis.humanLeads,
        botLeads: core.kpis.botLeads,
        unknownLeads: core.kpis.unknownLeads,
        signups: core.kpis.signups,
        firstChats: core.kpis.firstChats,
        payers: core.kpis.payers,
      },
      trend: {
        buckets: core.trend.buckets,
        series: [
          { key: "visits", values: values("humanVisits") },
          { key: "leads", values: values("humanLeads") },
          { key: "signups", values: values("signups") },
        ],
      },
      topSources: keys
        .map((key) => ({
          key,
          metrics: {
            leads: humanLeads.get(key) ?? 0,
            signups: signups.get(key) ?? 0,
            payers: money.get(key)?.payers ?? 0,
            revenueUsd: money.get(key)?.revenueUsd ?? 0,
          },
        }))
        .filter(
          (row) =>
            row.metrics.leads > 0 ||
            row.metrics.signups > 0 ||
            row.metrics.payers > 0 ||
            row.metrics.revenueUsd > 0,
        )
        .toSorted(
          (a, b) =>
            b.metrics.revenueUsd - a.metrics.revenueUsd ||
            b.metrics.leads - a.metrics.leads,
        ),
      abuse: {
        flaggedPrefixes: abuse.flaggedClusters.value,
        topPrefix: abuse.topKey,
        topPrefixLeads: abuse.topLeads,
      },
    });
  } catch (error) {
    logger.error("Acquisition overview failed", parseError(error));
    return fail({
      message: scopedTranslation
        .scopedT(locale)
        .t("leadAnalytics.overviewFailed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
