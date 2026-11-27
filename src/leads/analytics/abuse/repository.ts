import "server-only";

/**
 * Abuse report: lead/signup bursts per network prefix or exact user agent, and
 * free-credit burn by non-users.
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
import type { Kpi, TimeSeries } from "next-vibe/unified-ui/analytics/schema";
import type { AnalyticsWindow } from "next-vibe/unified-ui/analytics/window";
import {
  fillBuckets,
  serializeWindow,
} from "next-vibe/unified-ui/analytics/window";
import {
  bucketSql,
  inPreviousWindowSql,
  inWindowSql,
  utcSql,
} from "next-vibe/unified-ui/analytics/window-sql";
import type { QueryResultRow } from "pg";

import { CreditTransactionType } from "@/credits/enum";

import { resolveLeadWindow } from "../acquisition/repository";
import { isBotFamilySql } from "../bot-sql";
import type { BotFamily } from "../enum";
import { AbuseGroupBy } from "../enum";
import type { LeadSegmentFilters } from "../filters";
import {
  andAll,
  leadFactsSql,
  requestsBotTraffic,
  segmentConditions,
} from "../segment-sql";
import type {
  AbuseReportRequestOutput,
  AbuseReportResponseOutput,
} from "./definition";
import type { AbuseReportT } from "./i18n";

type AbuseGroupByValue = (typeof AbuseGroupBy)[keyof typeof AbuseGroupBy];

/** Default burst threshold: leads from one cluster inside the period. */
export const DEFAULT_MIN_LEADS = 10;

function groupKey(groupBy: AbuseGroupByValue): SQL {
  return groupBy === AbuseGroupBy.UA_FINGERPRINT ? sql`ua_fp` : sql`ip_prefix`;
}

/** Leads created in [previousFrom ?? from, to) that match the segment. */
function segmentCte(win: AnalyticsWindow, filters: LeadSegmentFilters): SQL {
  const start = win.previousFrom ?? win.from;
  const botFilter = requestsBotTraffic(filters) ? sql`` : sql`AND NOT l.is_bot`;
  return sql`seg AS (
    SELECT * FROM (${leadFactsSql(sql`l.created_at >= ${utcSql(start)} AND l.created_at < ${utcSql(win.to)} ${botFilter}`)}) f
    WHERE ${andAll(segmentConditions(filters))}
  )`;
}

/** Free credits spent by leads that never became users, per lead. */
function burnCte(win: AnalyticsWindow): SQL {
  const start = win.previousFrom ?? win.from;
  return sql`burn AS (
    SELECT b.lead_id, sum(b.credits)::float8 AS credits, count(*)::int AS tx,
      sum(b.credits) FILTER (WHERE ${inWindowSql(sql`b.created_at`, win)})::float8 AS credits_now,
      sum(b.credits) FILTER (WHERE ${inPreviousWindowSql(sql`b.created_at`, win)})::float8 AS credits_prev,
      count(*) FILTER (WHERE ${inWindowSql(sql`b.created_at`, win)})::int AS tx_now,
      min(b.created_at) AS first_at, max(b.created_at) AS last_at
    FROM (
      SELECT CASE
          WHEN t.metadata->>'actorLeadId' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            THEN (t.metadata->>'actorLeadId')::uuid
          ELSE w.lead_id END AS lead_id,
        (t.metadata->>'freeCreditsUsed')::numeric AS credits, t.created_at
      FROM credit_transactions t
      JOIN credit_wallets w ON w.id = t.wallet_id
      WHERE t.type = ${CreditTransactionType.USAGE}
        AND t.created_at >= ${utcSql(start)} AND t.created_at < ${utcSql(win.to)}
        AND (t.metadata->>'freeCreditsUsed') ~ '^[0-9.]+$'
        AND (t.metadata->>'freeCreditsUsed')::numeric > 0
    ) b
    JOIN leads bl ON bl.id = b.lead_id
    WHERE bl.converted_user_id IS NULL
      AND NOT EXISTS (SELECT 1 FROM user_lead_links ul WHERE ul.lead_id = bl.id)
    GROUP BY b.lead_id
  )`;
}

interface ClusterRow {
  key: string;
  sample: string | null;
  leads: number;
  distinctOther: number;
  signups: number;
  freeCredits: number;
  botShare: number;
  perHour: number;
  firstSeen: string;
  lastSeen: string;
}

async function clusters(
  win: AnalyticsWindow,
  filters: LeadSegmentFilters,
  groupBy: AbuseGroupByValue,
  minLeads: number,
  limit: number,
): Promise<ClusterRow[]> {
  const key = groupKey(groupBy);
  const other =
    groupBy === AbuseGroupBy.UA_FINGERPRINT ? sql`ip_prefix` : sql`ua_fp`;
  const sample = groupBy === AbuseGroupBy.UA_FINGERPRINT ? sql`ua` : sql`ip`;
  const { rows } = await db.execute<QueryResultRow & ClusterRow>(sql`
    WITH ${segmentCte(win, filters)}, ${burnCte(win)}
    SELECT ${key} AS key,
      mode() WITHIN GROUP (ORDER BY ${sample}) AS sample,
      count(*)::int AS leads,
      count(DISTINCT ${other})::int AS "distinctOther",
      count(DISTINCT user_id) FILTER (WHERE signed_up_at IS NOT NULL)::int AS signups,
      round(coalesce(sum(burn.credits_now), 0))::float8 AS "freeCredits",
      (count(*) FILTER (WHERE ${isBotFamilySql(sql`bot_family`)}))::float8 / count(*) AS "botShare",
      round((count(*) / greatest(1, extract(epoch FROM max(created_at) - min(created_at)) / 3600))::numeric, 1)::float8 AS "perHour",
      to_char(min(created_at), 'YYYY-MM-DD HH24:MI') AS "firstSeen",
      to_char(max(created_at), 'YYYY-MM-DD HH24:MI') AS "lastSeen"
    FROM seg LEFT JOIN burn ON burn.lead_id = seg.id
    WHERE ${key} IS NOT NULL AND ${inWindowSql(sql`created_at`, win)}
    GROUP BY 1
    HAVING count(*) >= ${minLeads}
    ORDER BY "perHour" DESC, leads DESC
    LIMIT ${limit}
  `);
  return rows;
}

export interface FlaggedSummary {
  flaggedClusters: Kpi;
  flaggedLeads: Kpi;
  allLeads: number;
  topKey: string | null;
  topLeads: number;
}

/** Clusters over the threshold in the period and the previous one. */
export async function computeFlaggedSummary(
  win: AnalyticsWindow,
  filters: LeadSegmentFilters,
  groupBy: AbuseGroupByValue,
  minLeads: number,
): Promise<FlaggedSummary> {
  const key = groupKey(groupBy);
  const {
    rows: [row],
  } = await db.execute<
    QueryResultRow & {
      clusters: number;
      flaggedLeads: number;
      prevClusters: number;
      prevFlaggedLeads: number;
      allLeads: number;
      topKey: string | null;
      topLeads: number | null;
    }
  >(sql`
    WITH ${segmentCte(win, filters)},
    cur AS (
      SELECT ${key} AS key, count(*)::int AS n FROM seg
      WHERE ${key} IS NOT NULL AND ${inWindowSql(sql`created_at`, win)}
      GROUP BY 1 HAVING count(*) >= ${minLeads}
    ),
    prev AS (
      SELECT ${key} AS key, count(*)::int AS n FROM seg
      WHERE ${key} IS NOT NULL AND ${inPreviousWindowSql(sql`created_at`, win)}
      GROUP BY 1 HAVING count(*) >= ${minLeads}
    )
    SELECT
      (SELECT count(*)::int FROM cur) AS clusters,
      (SELECT coalesce(sum(n), 0)::int FROM cur) AS "flaggedLeads",
      (SELECT count(*)::int FROM prev) AS "prevClusters",
      (SELECT coalesce(sum(n), 0)::int FROM prev) AS "prevFlaggedLeads",
      (SELECT count(*)::int FROM seg WHERE ${inWindowSql(sql`created_at`, win)}) AS "allLeads",
      (SELECT key FROM cur ORDER BY n DESC, key LIMIT 1) AS "topKey",
      (SELECT n FROM cur ORDER BY n DESC, key LIMIT 1) AS "topLeads"
  `);
  const hasPrevious = win.previousFrom !== null;
  return {
    flaggedClusters: {
      value: row.clusters,
      previous: hasPrevious ? row.prevClusters : null,
    },
    flaggedLeads: {
      value: row.flaggedLeads,
      previous: hasPrevious ? row.prevFlaggedLeads : null,
    },
    allLeads: row.allLeads,
    topKey: row.topKey,
    topLeads: row.topLeads ?? 0,
  };
}

export async function flaggedTrend(
  win: AnalyticsWindow,
  filters: LeadSegmentFilters,
  groupBy: AbuseGroupByValue,
  minLeads: number,
): Promise<TimeSeries> {
  const key = groupKey(groupBy);
  const { rows } = await db.execute<
    QueryResultRow & { flagged: boolean; bucket: string; value: number }
  >(sql`
    WITH ${segmentCte(win, filters)},
    cur AS (
      SELECT ${key} AS key FROM seg
      WHERE ${key} IS NOT NULL AND ${inWindowSql(sql`created_at`, win)}
      GROUP BY 1 HAVING count(*) >= ${minLeads}
    )
    SELECT (${key} IN (SELECT key FROM cur)) IS TRUE AS flagged,
      ${bucketSql(sql`created_at`, win.bucket)} AS bucket, count(*)::int AS value
    FROM seg WHERE ${inWindowSql(sql`created_at`, win)}
    GROUP BY 1, 2
  `);
  return {
    buckets: win.buckets,
    series: [
      {
        key: "flagged",
        values: fillBuckets(
          win.buckets,
          rows.filter((r) => r.flagged),
        ),
      },
      {
        key: "other",
        values: fillBuckets(
          win.buckets,
          rows.filter((r) => !r.flagged),
        ),
      },
    ],
  };
}

interface BurnerRow {
  leadId: string;
  label: string | null;
  ipPrefix: string | null;
  botFamily: (typeof BotFamily)[keyof typeof BotFamily];
  country: string | null;
  credits: number;
  tx: number;
  firstAt: string;
  lastAt: string;
}

async function burners(
  win: AnalyticsWindow,
  filters: LeadSegmentFilters,
  limit: number,
): Promise<{
  rows: BurnerRow[];
  total: Kpi;
  burnerCount: Kpi;
}> {
  const start = win.previousFrom ?? win.from;
  const facts = sql`SELECT * FROM (${leadFactsSql(
    sql`l.id IN (SELECT lead_id FROM burn)`,
  )}) f WHERE ${andAll(segmentConditions(filters))}`;
  const { rows } = await db.execute<QueryResultRow & BurnerRow>(sql`
    WITH ${burnCte(win)}, bf AS (${facts})
    SELECT bf.id AS "leadId", coalesce(bf.ip, bf.email) AS label,
      bf.ip_prefix AS "ipPrefix", bf.bot_family AS "botFamily", bf.country,
      round(burn.credits_now::numeric)::float8 AS credits, burn.tx_now AS tx,
      to_char(burn.first_at, 'YYYY-MM-DD HH24:MI') AS "firstAt",
      to_char(burn.last_at, 'YYYY-MM-DD HH24:MI') AS "lastAt"
    FROM burn JOIN bf ON bf.id = burn.lead_id
    WHERE burn.credits_now > 0
    ORDER BY burn.credits_now DESC
    LIMIT ${limit}
  `);
  const {
    rows: [totals],
  } = await db.execute<
    QueryResultRow & {
      now: number;
      prev: number;
      burnersNow: number;
      burnersPrev: number;
    }
  >(sql`
    WITH ${burnCte(win)}, bf AS (${facts})
    SELECT round(coalesce(sum(burn.credits_now), 0))::float8 AS now,
      round(coalesce(sum(burn.credits_prev), 0))::float8 AS prev,
      count(*) FILTER (WHERE burn.credits_now > 0)::int AS "burnersNow",
      count(*) FILTER (WHERE burn.credits_prev > 0)::int AS "burnersPrev"
    FROM burn JOIN bf ON bf.id = burn.lead_id
  `);
  const hasPrevious = start.getTime() !== win.from.getTime();
  return {
    rows,
    total: { value: totals.now, previous: hasPrevious ? totals.prev : null },
    burnerCount: {
      value: totals.burnersNow,
      previous: hasPrevious ? totals.burnersPrev : null,
    },
  };
}

export class AbuseReportRepository {
  static async getReport(
    data: AbuseReportRequestOutput,
    t: AbuseReportT,
    logger: EndpointLogger,
  ): Promise<ResponseType<AbuseReportResponseOutput>> {
    try {
      const win = await resolveLeadWindow(data);
      const groupBy = data.groupBy ?? AbuseGroupBy.IP_PREFIX;
      const minLeads = data.minLeads ?? DEFAULT_MIN_LEADS;
      const [summary, rows, trend, burn] = await Promise.all([
        computeFlaggedSummary(win, data, groupBy, minLeads),
        clusters(win, data, groupBy, minLeads, 50),
        flaggedTrend(win, data, groupBy, minLeads),
        burners(win, data, 25),
      ]);
      return success({
        window: serializeWindow(win),
        groupByUsed: groupBy,
        minLeadsUsed: minLeads,
        kpis: {
          flaggedClusters: summary.flaggedClusters,
          flaggedLeads: summary.flaggedLeads,
          flaggedShare:
            summary.allLeads > 0
              ? summary.flaggedLeads.value / summary.allLeads
              : 0,
          freeCredits: burn.total,
          burners: burn.burnerCount,
        },
        trend,
        clusters: rows,
        burners: burn.rows,
      });
    } catch (error) {
      logger.error("Abuse report failed", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
