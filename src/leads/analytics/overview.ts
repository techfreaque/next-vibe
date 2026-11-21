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
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  BreakdownRow,
  Kpi,
  TimeSeries,
} from "next-vibe/unified-ui/analytics/schema";
import type { AnalyticsWindow } from "next-vibe/unified-ui/analytics/window";
import { inWindowSql } from "next-vibe/unified-ui/analytics/window-sql";
import type { QueryResultRow } from "pg";

import { usdSql } from "@/payment/analytics/money-sql";
import { CheckoutMode, PaymentStatus } from "@/payment/enum";

import { computeFlaggedSummary, DEFAULT_MIN_LEADS } from "./abuse/repository";
import {
  computeAcquisitionBreakdown,
  computeAcquisitionCore,
  computeSignupsByChannel,
} from "./acquisition/repository";
import {
  AbuseGroupBy,
  CHANNEL_TYPE_TO_FILTER,
  LeadChannelFilter,
  LeadDimension,
  TrafficFilter,
} from "./enum";
import { scopedTranslation } from "./i18n";

export interface AcquisitionOverview {
  kpis: {
    /** Human visits (lead not classified as bot). */
    visits: Kpi;
    botVisits: Kpi;
    humanLeads: Kpi;
    botLeads: Kpi;
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
 * non-setup, admins excluded), so the values sum to its gross revenue and
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
      WHERE pt.mode <> ${CheckoutMode.SETUP}
        AND pt.status IN (${PaymentStatus.SUCCEEDED}, ${PaymentStatus.REFUNDED})
        AND ${inWindowSql(sql`pt.created_at`, win)}
        AND pt.user_id NOT IN (SELECT user_id FROM user_roles WHERE role = ${UserPermissionRole.ADMIN})
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

export async function getAcquisitionOverview(
  win: AnalyticsWindow,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<ResponseType<AcquisitionOverview>> {
  try {
    const [core, sources, signups, money, abuse] = await Promise.all([
      computeAcquisitionCore(win, {}),
      computeAcquisitionBreakdown(
        win,
        { traffic: TrafficFilter.HUMANS },
        LeadDimension.CHANNEL_TYPE,
        10,
      ),
      computeSignupsByChannel(win),
      paymentsByChannel(win),
      computeFlaggedSummary(win, {}, AbuseGroupBy.IP_PREFIX, DEFAULT_MIN_LEADS),
    ]);
    const humanLeads = new Map(
      sources.map((row) => [
        row.key ?? LeadChannelFilter.UNATTRIBUTED,
        row.metrics.leads ?? 0,
      ]),
    );
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
        humanLeads: core.kpis.humanLeads,
        botLeads: core.kpis.botLeads,
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
