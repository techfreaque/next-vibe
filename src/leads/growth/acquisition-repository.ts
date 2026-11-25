import "server-only";

import { type SQL, sql } from "drizzle-orm";
import type { Currencies } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";
import { resolutionBucketExpr } from "next-vibe/dataflow/shared/query-utils";
import { fillGaps } from "next-vibe/dataflow/shared/range";
import type { QueryResultRow } from "pg";
import type { z } from "zod";

import { isBotFamilySql } from "@/leads/analytics/bot-sql";
import { leadFactsSql } from "@/leads/analytics/segment-sql";
import { PaymentStatus } from "@/payment/enum";

import type {
  AcquisitionFilters,
  acquisitionLeadRow,
  acquisitionMetrics,
  acquisitionSummaryRow,
} from "./acquisition";
import {
  AcquisitionMetric,
  AcquisitionSource,
  AcquisitionSourceFilter,
} from "./acquisition";

type SummaryRow = z.infer<typeof acquisitionSummaryRow>;
type LeadRow = z.infer<typeof acquisitionLeadRow>;
type MetricTotals = z.infer<typeof acquisitionMetrics>;

// Match known search domains. Other external links
// (including social traffic) are reported under the referrer domain.
const SEARCH_HOST =
  "^(google\\.(com|[a-z]{2}|com\\.[a-z]{2}|co\\.[a-z]{2})|(cn\\.)?bing\\.com|([a-z]{2}\\.)?search\\.yahoo\\.(com|co\\.jp)|duckduckgo\\.com|search\\.brave\\.com|ecosia\\.org|startpage\\.com|qwant\\.com|baidu\\.com|yandex\\.(com|ru)|naver\\.com)$";

function sourceType(observed: SQL): SQL {
  return sql`CASE
    WHEN c.code IS NOT NULL AND (
      owner.creator_slug IS NOT NULL OR
      EXISTS (SELECT 1 FROM custom_skills s WHERE s.user_id = c.owner_user_id)
    ) THEN ${AcquisitionSource.CREATOR}
    WHEN c.code IS NOT NULL THEN ${AcquisitionSource.REFERRAL}
    WHEN a.source IS NOT NULL OR a.medium IS NOT NULL OR a.campaign IS NOT NULL
      THEN ${AcquisitionSource.CAMPAIGN}
    WHEN a.referrer_host ~ ${SEARCH_HOST} THEN ${AcquisitionSource.SEARCH}
    WHEN a.referrer_host IS NOT NULL THEN ${AcquisitionSource.REFERRER}
    WHEN ${observed} THEN ${AcquisitionSource.DIRECT}
    ELSE ${AcquisitionSource.UNATTRIBUTED}
  END`;
}

const codeJoin = sql`
  LEFT JOIN referral_codes c ON c.code = a.ref_code
  LEFT JOIN users owner ON owner.id = c.owner_user_id
`;

function filterConditions(filters: AcquisitionFilters): SQL {
  const conditions = [
    filters.sourceType &&
      filters.sourceType !== AcquisitionSourceFilter.ALL &&
      sql`source_type = ${filters.sourceType}`,
    filters.source?.trim() &&
      sql`source = ${filters.source.trim().toLowerCase()}`,
    filters.medium?.trim() &&
      sql`medium = ${filters.medium.trim().toLowerCase()}`,
    filters.campaign?.trim() && sql`campaign = ${filters.campaign.trim()}`,
    filters.referrerHost?.trim() &&
      sql`referrer_host = ${filters.referrerHost
        .trim()
        .toLowerCase()
        .replace(/^www\./, "")}`,
    filters.refCode?.trim() && sql`ref_code = ${filters.refCode.trim()}`,
  ].filter((condition): condition is SQL => Boolean(condition));
  return conditions.length > 0
    ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
    : sql``;
}

const dimensions = sql`
  source_type AS "sourceType", source, medium, campaign,
  referrer_host AS "referrerHost", ref_code AS "refCode"
`;

// Choose one acquisition lead per account. Login links and subsequently
// merged leads cannot move signup or payment attribution to another source.
const acquiredUsers = sql`
  SELECT u.id, u.created_at, coalesce(j.lead_id, signup.lead_id, legacy.id) AS lead_id
  FROM users u
  LEFT JOIN growth_journeys j ON j.user_id = u.id
  LEFT JOIN LATERAL (
    SELECT link.lead_id FROM user_lead_links link
    WHERE j.lead_id IS NULL AND link.user_id = u.id AND link.link_reason = 'signup'
    ORDER BY link.linked_at, link.lead_id
    LIMIT 1
  ) signup ON true
  LEFT JOIN LATERAL (
    -- The outer-only conditions sit inside the subquery so Postgres skips
    -- the (unindexed) leads scan for every account that already has a lead.
    SELECT l.id FROM leads l
    WHERE j.lead_id IS NULL AND signup.lead_id IS NULL
      AND l.converted_user_id = u.id AND l.signed_up_at IS NOT NULL
    ORDER BY l.created_at, l.id
    LIMIT 1
  ) legacy ON true
`;

// Recorded live stamps also cover incognito, where message history is absent.
const historicalChats = sql`
  SELECT t.user_id, CASE WHEN t.user_id IS NULL THEN t.lead_id END AS lead_id,
    min(m.created_at) AS first_chat_at
  FROM chat_threads t JOIN chat_messages m ON m.thread_id = t.id
  WHERE m.role = 'user' AND NOT m.is_ai
    AND ((t.user_id IS NOT NULL AND m.author_id = t.user_id::text)
      OR (t.user_id IS NULL AND t.lead_id IS NOT NULL AND m.author_id IS NULL))
  GROUP BY 1, 2
`;

function leadSources(leadCondition: SQL, includeChats = false): SQL {
  const firstChat = includeChats
    ? sql`least(j.first_chat_at, account_chat.first_chat_at, guest_chat.first_chat_at)`
    : sql`j.first_chat_at`;
  return sql`
    SELECT a.*, ${sourceType(sql`a.observed`)} AS source_type, c.code AS ref_code
    FROM (
      SELECT l.id, l.created_at, ${firstChat} AS first_chat_at, u.id AS user_id,
        u.created_at AS signed_up_at,
        first_visit.id IS NOT NULL AS observed,
        first_visit.source, first_visit.medium, first_visit.campaign, first_visit.referrer_host,
        coalesce(credited.code, first_visit.ref_code, last_code.code, linked.code, l.referral_code) AS candidate_code
      FROM leads l
      LEFT JOIN growth_journeys j ON j.lead_id = l.id
      LEFT JOIN (
        SELECT DISTINCT ON (lead_id) id, created_at, lead_id
        FROM acquired_users WHERE lead_id IS NOT NULL ORDER BY lead_id, created_at, id
      ) u ON u.lead_id = l.id
      ${
        includeChats
          ? sql`
        LEFT JOIN historical_chats account_chat ON account_chat.user_id = u.id
        LEFT JOIN historical_chats guest_chat ON guest_chat.lead_id = l.id
      `
          : sql``
      }
      LEFT JOIN referral_codes last_code ON last_code.code = j.last_ref_code
      LEFT JOIN user_referrals ur ON ur.referred_user_id = u.id
      LEFT JOIN referral_codes credited ON credited.id = ur.referral_code_id
      LEFT JOIN LATERAL (
        SELECT v.id, v.source, v.medium, v.campaign, v.referrer_host, r.code AS ref_code
        FROM growth_visits v LEFT JOIN referral_codes r ON r.code = v.ref_code
        WHERE v.lead_id = l.id
        ORDER BY v.visited_at, v.id
        LIMIT 1
      ) first_visit ON true
      LEFT JOIN (
        SELECT DISTINCT ON (lr.lead_id) lr.lead_id, r.code
        FROM lead_referrals lr JOIN referral_codes r ON r.id = lr.referral_code_id
        ORDER BY lr.lead_id, lr.created_at DESC, lr.id DESC
      ) linked ON linked.lead_id = l.id
      ${leadCondition}
    ) a
    LEFT JOIN referral_codes c ON c.code = a.candidate_code
    LEFT JOIN users owner ON owner.id = c.owner_user_id
  `;
}

// Accounts can share a browser lead. Keep each account's credited code on its
// own conversion rows while counting the underlying lead only once.
const accountSources = sql`
  SELECT a.id, a.created_at,
    CASE WHEN c.code IS NOT NULL THEN ${sourceType(sql`false`)}
      ELSE coalesce(a.lead_source_type, ${AcquisitionSource.UNATTRIBUTED}) END AS source_type,
    a.source, a.medium, a.campaign, a.referrer_host, coalesce(c.code, a.lead_ref_code) AS ref_code
  FROM (
    SELECT u.id, u.created_at, c.code AS ref_code,
      l.source_type AS lead_source_type, l.source, l.medium, l.campaign, l.referrer_host,
      l.ref_code AS lead_ref_code
    FROM acquired_users u
    LEFT JOIN lead_sources l ON l.id = u.lead_id
    LEFT JOIN user_referrals ur ON ur.referred_user_id = u.id
    LEFT JOIN referral_codes c ON c.id = ur.referral_code_id
  ) a
  ${codeJoin}
`;

const succeededPayments = sql`
  SELECT user_id, currency, amount, created_at
  FROM payment_transactions WHERE status = ${PaymentStatus.SUCCEEDED} AND amount > 0
`;

function between(column: SQL, range: TimeRange): SQL {
  return sql`${column} BETWEEN ${range.from.toISOString()}::timestamp AND ${range.to.toISOString()}::timestamp`;
}

/**
 * Visits whose lead is a known bot, with the Leads funnel's bot rule (user
 * agent families plus the Chrome 131 Google-referrer crawler).
 */
function botVisitLeads(range: TimeRange): SQL {
  return sql`
    SELECT f.id FROM (${leadFactsSql(
      sql`l.id IN (SELECT lead_id FROM growth_visits WHERE ${between(sql`visited_at`, range)})`,
    )}) f
    WHERE ${isBotFamilySql(sql`f.bot_family`)}
  `;
}

function visitEvents(range: TimeRange, excludeBots = false): SQL {
  return sql`
    SELECT ${AcquisitionMetric.VISITS}::text AS metric, a.visited_at AS happened_at,
      ${sourceType(sql`true`)} AS source_type, a.source, a.medium, a.campaign,
      a.referrer_host, c.code AS ref_code, 1::numeric AS value
    FROM growth_visits a
    ${codeJoin}
    WHERE ${between(sql`a.visited_at`, range)}
    ${excludeBots ? sql`AND a.lead_id NOT IN (${botVisitLeads(range)})` : sql``}
  `;
}

function leadEvents(
  range: TimeRange,
  currency: Currencies,
): Record<Exclude<AcquisitionMetric, typeof AcquisitionMetric.VISITS>, SQL> {
  const leadDimensions = sql`l.source_type, l.source, l.medium, l.campaign, l.referrer_host, l.ref_code`;
  const accountDimensions = sql`u.source_type, u.source, u.medium, u.campaign, u.referrer_host, u.ref_code`;
  return {
    [AcquisitionMetric.LEADS]: sql`
      SELECT ${AcquisitionMetric.LEADS}, l.created_at, ${leadDimensions}, 1
      FROM lead_sources l WHERE ${between(sql`l.created_at`, range)}
    `,
    [AcquisitionMetric.SIGNUPS]: sql`
      SELECT ${AcquisitionMetric.SIGNUPS}, u.created_at, ${accountDimensions}, 1
      FROM account_sources u
      WHERE ${between(sql`u.created_at`, range)}
    `,
    [AcquisitionMetric.FIRST_CHATS]: sql`
      SELECT ${AcquisitionMetric.FIRST_CHATS}, l.first_chat_at, ${leadDimensions}, 1
      FROM lead_sources l WHERE ${between(sql`l.first_chat_at`, range)}
    `,
    [AcquisitionMetric.PAYERS]: sql`
      SELECT ${AcquisitionMetric.PAYERS}, p.first_paid_at, ${accountDimensions}, 1
      FROM (SELECT user_id, min(created_at) AS first_paid_at FROM payments GROUP BY user_id) p
      JOIN account_sources u ON u.id = p.user_id
      WHERE ${between(sql`p.first_paid_at`, range)}
    `,
    [AcquisitionMetric.REVENUE]: sql`
      SELECT ${AcquisitionMetric.REVENUE}, p.created_at, ${accountDimensions}, p.amount
      FROM payments p JOIN account_sources u ON u.id = p.user_id
      WHERE ${between(sql`p.created_at`, range)} AND p.currency = ${currency}
    `,
  };
}

const metricTotals = sql`
        coalesce(sum(value) FILTER (WHERE metric = ${AcquisitionMetric.VISITS}), 0)::int AS visits,
        coalesce(sum(value) FILTER (WHERE metric = ${AcquisitionMetric.LEADS}), 0)::int AS leads,
        coalesce(sum(value) FILTER (WHERE metric = ${AcquisitionMetric.SIGNUPS}), 0)::int AS signups,
        coalesce(sum(value) FILTER (WHERE metric = ${AcquisitionMetric.FIRST_CHATS}), 0)::int AS "firstChats",
        coalesce(sum(value) FILTER (WHERE metric = ${AcquisitionMetric.PAYERS}), 0)::int AS payers,
        coalesce(sum(value) FILTER (WHERE metric = ${AcquisitionMetric.REVENUE}), 0)::float8 AS revenue
`;

function acquisitionEvents(range: TimeRange, currency: Currencies): SQL {
  return sql`
    acquired_users AS (${acquiredUsers}),
    historical_chats AS (${historicalChats}),
    lead_sources AS (${leadSources(sql``, true)}),
    account_sources AS (${accountSources}),
    payments AS (${succeededPayments}),
    events AS (
      ${sql.join([visitEvents(range), ...Object.values(leadEvents(range, currency))], sql` UNION ALL `)}
    )
  `;
}

interface SeriesQuery {
  range: TimeRange;
  resolution: Resolution;
  filters: AcquisitionFilters;
  currency: Currencies;
  metric: AcquisitionMetric;
  /** Visits only: drop visits of known bot leads (Leads funnel rule). */
  excludeBots?: boolean;
}

type SourceBucketRow = QueryResultRow & {
  bucket: string;
  sourceType: string;
  value: number;
};

const SHARE_MS = 15_000;
const sharedSourceRows = new Map<
  string,
  { at: number; rows: Promise<SourceBucketRow[]> }
>();

/** `WITH ... events(...) AS (...)` for one metric, ready for a SELECT. */
function seriesEvents(data: SeriesQuery): SQL {
  const { metric } = data;
  const visitsOnly = metric === AcquisitionMetric.VISITS;
  const events =
    metric === AcquisitionMetric.VISITS
      ? visitEvents(data.range, data.excludeBots === true)
      : leadEvents(data.range, data.currency)[metric];
  const includeChats = metric === AcquisitionMetric.FIRST_CHATS;
  const context = visitsOnly
    ? sql``
    : sql`acquired_users AS (${acquiredUsers}),
        historical_chats AS (${historicalChats}),
        lead_sources AS (${leadSources(sql``, includeChats)}),
        account_sources AS (${accountSources}),
        payments AS (${succeededPayments}),`;
  return sql`WITH ${context} events(metric, happened_at, source_type, source, medium, campaign, referrer_host, ref_code, value) AS (${events})`;
}

export class AcquisitionRepository {
  static async summary(data: {
    range: TimeRange;
    filters: AcquisitionFilters;
    currency: Currencies;
    page: number;
  }): Promise<{ rows: SummaryRow[]; totals: MetricTotals; hasMore: boolean }> {
    const {
      rows: [report],
    } = await db.execute<
      QueryResultRow & {
        rows: SummaryRow[];
        totals: MetricTotals;
      }
    >(sql`
      WITH ${acquisitionEvents(data.range, data.currency)},
        matching_events AS (SELECT * FROM events ${filterConditions(data.filters)}),
        source_rows AS (
          SELECT ${dimensions}, ${metricTotals}
          FROM matching_events GROUP BY 1, 2, 3, 4, 5, 6
          ORDER BY visits DESC, leads DESC, signups DESC, payers DESC, revenue DESC, 1, 2, 3, 4, 5, 6
          LIMIT 26 OFFSET ${(data.page - 1) * 25}
        ),
        totals AS (SELECT ${metricTotals} FROM matching_events)
      SELECT coalesce((SELECT json_agg(source_rows) FROM source_rows), '[]'::json) AS rows,
        row_to_json(totals) AS totals
      FROM totals
    `);
    return {
      rows: report.rows.slice(0, 25),
      totals: report.totals,
      hasMore: report.rows.length > 25,
    };
  }

  static async referralCodeSummary(
    codes: string[],
    currency: Currencies,
  ): Promise<
    Map<
      string,
      Pick<SummaryRow, "visits" | "leads" | "firstChats" | "payers" | "revenue">
    >
  > {
    if (codes.length === 0) {
      return new Map();
    }
    const codeList = sql.join(
      codes.map((code) => sql`${code}`),
      sql`, `,
    );
    const range = { from: new Date(0), to: new Date() };
    const { rows } = await db.execute<
      QueryResultRow & SummaryRow & { refCode: string }
    >(sql`
      WITH ${acquisitionEvents(range, currency)}
      SELECT ref_code AS "refCode", ${metricTotals}
      FROM events WHERE ref_code IN (${codeList})
      GROUP BY ref_code
    `);
    return new Map(rows.map((row) => [row.refCode, row]));
  }

  static async series(data: SeriesQuery): Promise<DataPoint[]> {
    const { rows } = await db.execute<
      QueryResultRow & { bucket: string; value: number }
    >(sql`
      ${seriesEvents(data)}
      SELECT ${resolutionBucketExpr(data.resolution, sql`happened_at`)} AS bucket,
        sum(value)::float8 AS value
      FROM events ${filterConditions(data.filters)}
      GROUP BY 1 ORDER BY 1
    `);
    return fillGaps(
      rows.map(({ bucket, value }) => ({ timestamp: new Date(bucket), value })),
      data.range,
      data.resolution,
    );
  }

  /**
   * One metric split by source type in a single scan: a graph with one node
   * per source asks for the same split several times, so the scan is shared
   * for a few seconds instead of re-running the attribution joins per node.
   */
  static seriesBySource(
    data: Omit<SeriesQuery, "filters">,
  ): Promise<SourceBucketRow[]> {
    const key = [
      data.metric,
      data.resolution,
      data.currency,
      data.excludeBots === true,
      data.range.from.toISOString(),
      data.range.to.toISOString(),
    ].join("|");
    const now = Date.now();
    for (const [k, entry] of sharedSourceRows) {
      if (now - entry.at > SHARE_MS) {
        sharedSourceRows.delete(k);
      }
    }
    const hit = sharedSourceRows.get(key);
    if (hit) {
      return hit.rows;
    }
    const rows = db
      .execute<SourceBucketRow>(
        sql`
          ${seriesEvents({ ...data, filters: {} })}
          SELECT ${resolutionBucketExpr(data.resolution, sql`happened_at`)} AS bucket,
            source_type AS "sourceType", sum(value)::float8 AS value
          FROM events
          GROUP BY 1, 2 ORDER BY 1, 2
        `,
      )
      .then((result) => result.rows);
    // A failed scan must not be served to the next caller.
    rows.catch(() => sharedSourceRows.delete(key));
    sharedSourceRows.set(key, { at: now, rows });
    return rows;
  }

  static matchingLeadIds(filters: AcquisitionFilters): SQL {
    return sql`
      WITH acquired_users AS (${acquiredUsers})
      SELECT id FROM (${leadSources(sql``)}) sources ${filterConditions(filters)}
    `;
  }

  static async leadDetails(
    ids: string[],
    currency: Currencies,
  ): Promise<Map<string, LeadRow>> {
    if (ids.length === 0) {
      return new Map();
    }
    const idList = sql.join(
      ids.map((id) => sql`${id}::uuid`),
      sql`, `,
    );
    const { rows } = await db.execute<
      QueryResultRow & { id: string } & Omit<SummaryRow, "leads">
    >(sql`
      WITH acquired_users AS (${acquiredUsers}), payments AS (${succeededPayments}),
        historical_chats AS (${historicalChats})
      SELECT l.id, ${dimensions},
        (SELECT count(*)::int FROM growth_visits v WHERE v.lead_id = l.id) AS visits,
        (l.signed_up_at IS NOT NULL)::int AS signups,
        (l.first_chat_at IS NOT NULL)::int AS "firstChats",
        EXISTS (SELECT 1 FROM payments p WHERE p.user_id = l.user_id)::int AS payers,
        coalesce((SELECT sum(p.amount) FROM payments p WHERE p.user_id = l.user_id AND p.currency = ${currency}), 0)::float8 AS revenue
      FROM (${leadSources(sql`WHERE l.id IN (${idList})`, true)}) l
    `);
    return new Map(rows.map((row) => [row.id, { ...row, currency }]));
  }
}
