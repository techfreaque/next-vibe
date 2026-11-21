import "server-only";

/**
 * Acquisition report: where visitors and leads come from, humans vs bots.
 *
 * Every metric counts events inside the window (leads created, visits,
 * signups, first chats, first payments) for leads matching the segment.
 */
import { type SQL, sql } from "drizzle-orm";
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
import type { AnalyticsWindow } from "next-vibe/unified-ui/analytics/window";
import {
  fillBuckets,
  resolveAnalyticsWindow,
  serializeWindow,
} from "next-vibe/unified-ui/analytics/window";
import {
  bucketSql,
  inPreviousWindowSql,
  inWindowSql,
} from "next-vibe/unified-ui/analytics/window-sql";
import type { QueryResultRow } from "pg";

import { usdSql } from "@/payment/analytics/money-sql";
import { PaymentStatus } from "@/payment/enum";

import { BotFamily, LeadDimension } from "../enum";
import type { LeadSegmentFilters } from "../filters";
import {
  andAll,
  dimensionColumn,
  leadFactsSql,
  segmentConditions,
} from "../segment-sql";
import { leadDataFloor, relevantLeadsCondition } from "../window-sql";
import type {
  AcquisitionReportRequestOutput,
  AcquisitionReportResponseOutput,
} from "./definition";
import type { AcquisitionReportT } from "./i18n";

type LeadDimensionValue = (typeof LeadDimension)[keyof typeof LeadDimension];

export interface AcquisitionKpis {
  visits: Kpi;
  humanVisits: Kpi;
  botVisits: Kpi;
  visitors: Kpi;
  humanLeads: Kpi;
  botLeads: Kpi;
  signups: Kpi;
  firstChats: Kpi;
  payers: Kpi;
}

export interface AcquisitionCore {
  kpis: AcquisitionKpis;
  trend: TimeSeries;
}

/** `WITH seg AS (...)`: lead facts restricted to the win and the segment. */
function segmentCte(win: AnalyticsWindow, filters: LeadSegmentFilters): SQL {
  return sql`seg AS (
    SELECT * FROM (${leadFactsSql(relevantLeadsCondition(win))}) f
    WHERE ${andAll(segmentConditions(filters))}
  ),
  seg_users AS (
    SELECT user_id, min(signed_up_at) AS signed_up_at, min(first_paid_at) AS first_paid_at
    FROM seg WHERE user_id IS NOT NULL GROUP BY user_id
  )`;
}

const HUMAN = BotFamily.HUMAN;

function kpi(value: number, previous: number, win: AnalyticsWindow): Kpi {
  return { value, previous: win.previousFrom ? previous : null };
}

export async function computeAcquisitionCore(
  win: AnalyticsWindow,
  filters: LeadSegmentFilters,
): Promise<AcquisitionCore> {
  const w = (column: SQL): SQL => inWindowSql(column, win);
  const p = (column: SQL): SQL => inPreviousWindowSql(column, win);
  const created = sql`created_at`;
  const signed = sql`signed_up_at`;
  const chat = sql`first_chat_at`;
  const paid = sql`first_paid_at`;
  const visited = sql`v.visited_at`;

  const {
    rows: [totals],
  } = await db.execute<
    QueryResultRow & {
      humanLeads: number;
      botLeads: number;
      signups: number;
      firstChats: number;
      payers: number;
      prevHumanLeads: number;
      prevBotLeads: number;
      prevSignups: number;
      prevFirstChats: number;
      prevPayers: number;
      visits: number;
      visitors: number;
      prevVisits: number;
      prevVisitors: number;
      humanVisits: number;
      prevHumanVisits: number;
      botVisits: number;
      prevBotVisits: number;
    }
  >(sql`
    WITH ${segmentCte(win, filters)},
    visit_totals AS (
      SELECT
        count(*) FILTER (WHERE ${w(visited)})::int AS visits,
        count(DISTINCT v.lead_id) FILTER (WHERE ${w(visited)})::int AS visitors,
        count(*) FILTER (WHERE ${p(visited)})::int AS "prevVisits",
        count(DISTINCT v.lead_id) FILTER (WHERE ${p(visited)})::int AS "prevVisitors",
        count(*) FILTER (WHERE ${w(visited)} AND seg.bot_family = ${HUMAN})::int AS "humanVisits",
        count(*) FILTER (WHERE ${p(visited)} AND seg.bot_family = ${HUMAN})::int AS "prevHumanVisits",
        count(*) FILTER (WHERE ${w(visited)} AND seg.bot_family <> ${HUMAN})::int AS "botVisits",
        count(*) FILTER (WHERE ${p(visited)} AND seg.bot_family <> ${HUMAN})::int AS "prevBotVisits"
      FROM growth_visits v JOIN seg ON seg.id = v.lead_id
    )
    SELECT
      count(*) FILTER (WHERE ${w(created)} AND bot_family = ${HUMAN})::int AS "humanLeads",
      count(*) FILTER (WHERE ${w(created)} AND bot_family <> ${HUMAN})::int AS "botLeads",
      (SELECT count(*)::int FROM seg_users WHERE ${w(signed)}) AS signups,
      count(*) FILTER (WHERE ${w(chat)})::int AS "firstChats",
      (SELECT count(*)::int FROM seg_users WHERE ${w(paid)}) AS payers,
      count(*) FILTER (WHERE ${p(created)} AND bot_family = ${HUMAN})::int AS "prevHumanLeads",
      count(*) FILTER (WHERE ${p(created)} AND bot_family <> ${HUMAN})::int AS "prevBotLeads",
      (SELECT count(*)::int FROM seg_users WHERE ${p(signed)}) AS "prevSignups",
      count(*) FILTER (WHERE ${p(chat)})::int AS "prevFirstChats",
      (SELECT count(*)::int FROM seg_users WHERE ${p(paid)}) AS "prevPayers",
      (SELECT visits FROM visit_totals) AS visits,
      (SELECT visitors FROM visit_totals) AS visitors,
      (SELECT "prevVisits" FROM visit_totals) AS "prevVisits",
      (SELECT "prevVisitors" FROM visit_totals) AS "prevVisitors",
      (SELECT "humanVisits" FROM visit_totals) AS "humanVisits",
      (SELECT "prevHumanVisits" FROM visit_totals) AS "prevHumanVisits",
      (SELECT "botVisits" FROM visit_totals) AS "botVisits",
      (SELECT "prevBotVisits" FROM visit_totals) AS "prevBotVisits"
    FROM seg
  `);

  const bucket = win.bucket;
  const { rows: series } = await db.execute<
    QueryResultRow & { key: string; bucket: string; value: number }
  >(sql`
    WITH ${segmentCte(win, filters)}
    SELECT 'humanLeads' AS key, ${bucketSql(created, bucket)} AS bucket, count(*)::int AS value
      FROM seg WHERE ${w(created)} AND bot_family = ${HUMAN} GROUP BY 2
    UNION ALL
    SELECT 'botLeads', ${bucketSql(created, bucket)}, count(*)::int
      FROM seg WHERE ${w(created)} AND bot_family <> ${HUMAN} GROUP BY 2
    UNION ALL
    SELECT 'signups', ${bucketSql(signed, bucket)}, count(*)::int
      FROM seg_users WHERE ${w(signed)} GROUP BY 2
    UNION ALL
    SELECT 'firstChats', ${bucketSql(chat, bucket)}, count(*)::int
      FROM seg WHERE ${w(chat)} GROUP BY 2
    UNION ALL
    SELECT 'payers', ${bucketSql(paid, bucket)}, count(*)::int
      FROM seg_users WHERE ${w(paid)} GROUP BY 2
    UNION ALL
    SELECT 'visits', ${bucketSql(visited, bucket)}, count(*)::int
      FROM growth_visits v JOIN seg ON seg.id = v.lead_id WHERE ${w(visited)} GROUP BY 2
    UNION ALL
    SELECT 'humanVisits', ${bucketSql(visited, bucket)}, count(*)::int
      FROM growth_visits v JOIN seg ON seg.id = v.lead_id WHERE ${w(visited)} AND seg.bot_family = ${HUMAN} GROUP BY 2
    UNION ALL
    SELECT 'botVisits', ${bucketSql(visited, bucket)}, count(*)::int
      FROM growth_visits v JOIN seg ON seg.id = v.lead_id WHERE ${w(visited)} AND seg.bot_family <> ${HUMAN} GROUP BY 2
    UNION ALL
    SELECT 'visitors', ${bucketSql(visited, bucket)}, count(DISTINCT v.lead_id)::int
      FROM growth_visits v JOIN seg ON seg.id = v.lead_id WHERE ${w(visited)} GROUP BY 2
  `);

  const seriesKeys = [
    "humanLeads",
    "botLeads",
    "visits",
    "humanVisits",
    "botVisits",
    "visitors",
    "signups",
    "firstChats",
    "payers",
  ] as const;

  return {
    kpis: {
      visits: kpi(totals.visits, totals.prevVisits, win),
      humanVisits: kpi(totals.humanVisits, totals.prevHumanVisits, win),
      botVisits: kpi(totals.botVisits, totals.prevBotVisits, win),
      visitors: kpi(totals.visitors, totals.prevVisitors, win),
      humanLeads: kpi(totals.humanLeads, totals.prevHumanLeads, win),
      botLeads: kpi(totals.botLeads, totals.prevBotLeads, win),
      signups: kpi(totals.signups, totals.prevSignups, win),
      firstChats: kpi(totals.firstChats, totals.prevFirstChats, win),
      payers: kpi(totals.payers, totals.prevPayers, win),
    },
    trend: {
      buckets: win.buckets,
      series: seriesKeys.map((key) => ({
        key,
        values: fillBuckets(
          win.buckets,
          series.filter((row) => row.key === key),
        ),
      })),
    },
  };
}

/**
 * Breakdown rows by one dimension. Metrics: visits, leads, humanLeads,
 * botLeads, botShare (ratio), signups, payers.
 */
export async function computeAcquisitionBreakdown(
  win: AnalyticsWindow,
  filters: LeadSegmentFilters,
  dimension: LeadDimensionValue,
  limit = 50,
): Promise<BreakdownRow[]> {
  const w = (column: SQL): SQL => inWindowSql(column, win);
  const key = dimensionColumn(dimension);
  const { rows } = await db.execute<
    QueryResultRow & {
      key: string | null;
      visits: number;
      leads: number;
      humanLeads: number;
      botLeads: number;
      signups: number;
      payers: number;
      revenueUsd: number;
    }
  >(sql`
    WITH ${segmentCte(win, filters)},
    user_revenue AS (
      SELECT p.user_id, sum(${usdSql("p.amount", "p.currency")})::float8 AS usd
      FROM payment_transactions p
      WHERE p.status = ${PaymentStatus.SUCCEEDED} AND p.amount > 0
        AND ${w(sql`p.created_at`)}
      GROUP BY p.user_id
    ),
    keyed AS (SELECT ${key} AS key, * FROM seg f),
    row_revenue AS (
      SELECT ru.key, coalesce(sum(ur.usd), 0)::float8 AS usd
      FROM (SELECT DISTINCT key, user_id FROM keyed WHERE user_id IS NOT NULL) ru
      JOIN user_revenue ur ON ur.user_id = ru.user_id
      GROUP BY ru.key
    ),
    visit_counts AS (
      SELECT v.lead_id, count(*)::int AS n FROM growth_visits v
      WHERE ${w(sql`v.visited_at`)} GROUP BY v.lead_id
    ),
    rows AS (
      SELECT f.key AS key,
        coalesce(sum(vc.n), 0)::int AS visits,
        count(*) FILTER (WHERE ${w(sql`f.created_at`)})::int AS leads,
        count(*) FILTER (WHERE ${w(sql`f.created_at`)} AND f.bot_family = ${HUMAN})::int AS "humanLeads",
        count(*) FILTER (WHERE ${w(sql`f.created_at`)} AND f.bot_family <> ${HUMAN})::int AS "botLeads",
        count(DISTINCT f.user_id) FILTER (WHERE ${w(sql`f.signed_up_at`)})::int AS signups,
        count(DISTINCT f.user_id) FILTER (WHERE ${w(sql`f.first_paid_at`)})::int AS payers
      FROM keyed f
      LEFT JOIN visit_counts vc ON vc.lead_id = f.id
      GROUP BY 1
    )
    SELECT rows.*, coalesce(rr.usd, 0)::float8 AS "revenueUsd"
    FROM rows LEFT JOIN row_revenue rr ON rr.key IS NOT DISTINCT FROM rows.key
    WHERE rows.leads > 0 OR rows.visits > 0 OR rows.signups > 0 OR rows.payers > 0
    ORDER BY (rows.key IS NULL), rows.leads DESC, rows.visits DESC, rows.signups DESC, rows.key
    LIMIT ${limit}
  `);
  return rows.map((row) => ({
    key: row.key,
    metrics: {
      visits: row.visits,
      leads: row.leads,
      humanLeads: row.humanLeads,
      botLeads: row.botLeads,
      botShare: row.leads > 0 ? row.botLeads / row.leads : 0,
      signups: row.signups,
      payers: row.payers,
      revenueUsd: Math.round(row.revenueUsd * 100) / 100,
    },
  }));
}

/**
 * Signups in the window per first-touch channel type (LeadChannelFilter key),
 * one row per user with the same rule as kpis.signups, so the values sum to it.
 */
export async function computeSignupsByChannel(
  win: AnalyticsWindow,
): Promise<Map<string, number>> {
  const { rows } = await db.execute<
    QueryResultRow & { key: string; signups: number }
  >(sql`
    WITH ${segmentCte(win, {})},
    first_signup AS (
      SELECT DISTINCT ON (f.user_id) f.user_id, f.signed_up_at,
        ${dimensionColumn(LeadDimension.CHANNEL_TYPE)} AS key
      FROM seg f WHERE f.user_id IS NOT NULL
      ORDER BY f.user_id, f.signed_up_at, f.created_at
    )
    SELECT key, count(*)::int AS signups FROM first_signup
    WHERE ${inWindowSql(sql`signed_up_at`, win)}
    GROUP BY key
  `);
  return new Map(rows.map((row) => [row.key, row.signups]));
}

/** Earliest tracked visit / journey (tells the operator what the data covers). */
async function coverage(): Promise<{
  visitsSince: string | null;
  journeysSince: string | null;
}> {
  const {
    rows: [row],
  } = await db.execute<
    QueryResultRow & {
      visitsSince: string | null;
      journeysSince: string | null;
    }
  >(sql`
    SELECT to_char(min(visited_at), 'YYYY-MM-DD') AS "visitsSince",
      (SELECT to_char(min(first_touch_at), 'YYYY-MM-DD') FROM growth_journeys) AS "journeysSince"
    FROM growth_visits
  `);
  return {
    visitsSince: row?.visitsSince ?? null,
    journeysSince: row?.journeysSince ?? null,
  };
}

export async function resolveLeadWindow(
  data: Parameters<typeof resolveAnalyticsWindow>[0],
): Promise<AnalyticsWindow> {
  return resolveAnalyticsWindow(data, new Date(), await leadDataFloor());
}

export class AcquisitionReportRepository {
  static async getReport(
    data: AcquisitionReportRequestOutput,
    t: AcquisitionReportT,
    logger: EndpointLogger,
  ): Promise<ResponseType<AcquisitionReportResponseOutput>> {
    try {
      const win = await resolveLeadWindow(data);
      const dimension = data.dimension ?? LeadDimension.CHANNEL;
      const [core, breakdown, agents, dataCoverage] = await Promise.all([
        computeAcquisitionCore(win, data),
        computeAcquisitionBreakdown(win, data, dimension),
        computeAcquisitionBreakdown(win, data, LeadDimension.BOT_FAMILY, 20),
        coverage(),
      ]);
      return success({
        window: serializeWindow(win),
        kpis: core.kpis,
        trend: core.trend,
        breakdown,
        agents,
        coverage: dataCoverage,
      });
    } catch (error) {
      logger.error("Acquisition report failed", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
