import "server-only";

/**
 * Per-lead facts + segment filter SQL shared by every lead analytics report and
 * the lead list. One definition of "source", "bot", "signed up", "paid" etc.
 *
 * Cohort rule: a lead belongs to the period it was created in (leads.created_at).
 * Funnel steps count whenever they happened, so a cohort's numbers can still
 * grow after the period ends.
 */
import { type SQL, sql } from "drizzle-orm";
import { utcSql } from "next-vibe/unified-ui/analytics/window-sql";

import {
  CHROME_131_CRAWLER_REFERRER_HOST,
  CHROME_131_CRAWLER_REFERRER_PATH,
  CHROME_131_CRAWLER_UA,
} from "@/leads/growth/chrome-131-crawler";
import { PaymentStatus } from "@/payment/enum";

import {
  botFamilySql,
  ipPrefixSql,
  isBotFamilySql,
  leadBrowserSql,
  leadDeviceSql,
  leadIpSql,
  leadOsSql,
  leadUserAgentSql,
  notBotFamilySql,
  uaFingerprintSql,
} from "./bot-sql";
import {
  BotFamily,
  CHANNEL_FILTER_TO_TYPE,
  CHANNEL_TYPE_TO_FILTER,
  DEVICE_FILTER_TO_TYPE,
  DEVICE_TYPE_TO_FILTER,
  FunnelReach,
  LeadChannelFilter,
  LeadDeviceFilter,
  LeadDimension,
  NONE_FILTER_VALUE,
  TrafficFilter,
} from "./enum";
import type { LeadDrillFilters, LeadSegmentFilters } from "./filters";
import { LEAD_SEGMENT_TEXT_KEYS, pickSegmentFilters } from "./filters";

type LeadDimensionValue = (typeof LeadDimension)[keyof typeof LeadDimension];

// The Nov 20 crawl paired this exact browser string with a Google origin
// referrer. Preserve older traffic and leads with observed account or chat activity.
const chrome131Crawler = (noLeadChat: SQL): SQL => sql`(
  ident.ua = ${CHROME_131_CRAWLER_UA}
  AND l.created_at >= timestamp '2026-11-20'
  AND l.metadata->>'anonymous' = 'true'
  AND l.metadata->>'referer' = ${CHROME_131_CRAWLER_REFERRER_PATH}
  AND j.first_referrer_host = ${CHROME_131_CRAWLER_REFERRER_HOST}
  AND l.email IS NULL
  AND l.converted_user_id IS NULL AND j.user_id IS NULL
  AND l.signed_up_at IS NULL AND j.signed_up_at IS NULL
  AND j.first_chat_at IS NULL AND ${noLeadChat}
)`;

/**
 * `SELECT` of one row per lead with every derived dimension and funnel stamp.
 * `leadCondition` filters on the `l` (leads) alias, e.g. the creation window.
 */
export function leadFactsSql(leadCondition: SQL = sql`TRUE`): SQL {
  return sql`
    SELECT l.id, l.created_at, l.geo_country AS country,
      l.country AS locale_country, l.email, l.business_name,
      ${leadDeviceSql(sql`l.device_type`, sql`ident.ua`, sql`fam.bot_family`)} AS device,
      ${leadBrowserSql(sql`l.browser`, sql`ident.ua`)} AS browser,
      ${leadOsSql(sql`l.os`, sql`ident.ua`)} AS os,
      ident.ip, ident.ua, fam.bot_family,
      ${ipPrefixSql(sql`ident.ip`)} AS ip_prefix,
      ${uaFingerprintSql(sql`ident.ua`)} AS ua_fp,
      j.first_channel_type AS channel_type, j.first_channel AS channel,
      j.first_source AS source, j.first_medium AS medium,
      j.first_campaign AS campaign, j.first_referrer_host AS referrer_host,
      j.first_landing_path AS landing_path,
      coalesce(j.first_ref_code, l.referral_code) AS ref_code,
      u.id AS user_id,
      -- Account creation is the signup. growth_journeys.signed_up_at is
      -- stamped when an account first attaches to a journey, which for an
      -- existing account (login on a new device) is long after its signup.
      u.created_at AS signed_up_at,
      coalesce(u.email_verified, false) AS email_verified,
      coalesce(j.first_chat_at, lead_chat.first_at, user_chat.first_at) AS first_chat_at,
      coalesce(j.first_chat_at, lead_chat.first_at) AS lead_first_chat_at,
      coalesce(j.first_paid_at, pay.first_at) AS first_paid_at
    FROM leads l
    CROSS JOIN LATERAL (
      SELECT ${leadUserAgentSql("l")} AS ua, ${leadIpSql("l")} AS ip
    ) ident
    LEFT JOIN growth_journeys j ON j.lead_id = l.id
    LEFT JOIN users u ON u.id = coalesce(j.user_id, l.converted_user_id)
    LEFT JOIN (
      SELECT lead_id, min(created_at) AS first_at FROM chat_threads
      WHERE lead_id IS NOT NULL GROUP BY lead_id
    ) lead_chat ON lead_chat.lead_id = l.id
    LEFT JOIN (
      SELECT user_id, min(created_at) AS first_at FROM chat_threads
      WHERE user_id IS NOT NULL GROUP BY user_id
    ) user_chat ON user_chat.user_id = u.id
    LEFT JOIN (
      SELECT user_id, min(created_at) AS first_at FROM payment_transactions
      WHERE status = ${PaymentStatus.SUCCEEDED} AND amount > 0 GROUP BY user_id
    ) pay ON pay.user_id = u.id
    CROSS JOIN LATERAL (
      SELECT ${botFamilySql(sql`ident.ua`, chrome131Crawler(sql`lead_chat.first_at IS NULL`))} AS bot_family
    ) fam
    WHERE ${leadCondition}
  `;
}

/** Lead creation events for the unsegmented human headline. */
export function humanLeadCreationsSql(leadCondition: SQL): SQL {
  const noLeadChat = sql`NOT EXISTS (
    SELECT 1 FROM chat_threads ct WHERE ct.lead_id = l.id AND ct.created_at IS NOT NULL
  )`;
  const family = botFamilySql(sql`ident.ua`, chrome131Crawler(noLeadChat));
  return sql`
    SELECT l.created_at
    FROM leads l
    CROSS JOIN LATERAL (SELECT ${leadUserAgentSql("l")} AS ua) ident
    LEFT JOIN growth_journeys j ON j.lead_id = l.id
    WHERE (${leadCondition}) AND ${family} = ${BotFamily.HUMAN}
  `;
}

/** Exact match, or IS NULL for the "(none)" value. */
function matches(column: SQL, value: string): SQL {
  return value === NONE_FILTER_VALUE
    ? sql`${column} IS NULL`
    : sql`${column} = ${value}`;
}

const TEXT_COLUMNS = {
  channel: sql`f.channel`,
  source: sql`f.source`,
  medium: sql`f.medium`,
  campaign: sql`f.campaign`,
  referrerHost: sql`f.referrer_host`,
  landingPath: sql`f.landing_path`,
  refCode: sql`f.ref_code`,
  country: sql`f.country`,
  localeCountry: sql`f.locale_country`,
  browser: sql`f.browser`,
  os: sql`f.os`,
  ipPrefix: sql`f.ip_prefix`,
  uaFingerprint: sql`f.ua_fp`,
} as const;

/** Conditions on the `f` (lead facts) alias. */
export function segmentConditions(filters: LeadSegmentFilters): SQL[] {
  const picked = pickSegmentFilters(filters);
  const conditions: SQL[] = [];
  if (picked.traffic === TrafficFilter.HUMANS) {
    conditions.push(sql`f.bot_family = ${BotFamily.HUMAN}`);
  } else if (picked.traffic === TrafficFilter.BOTS) {
    conditions.push(isBotFamilySql(sql`f.bot_family`));
  } else if (picked.traffic === TrafficFilter.UNKNOWN) {
    conditions.push(sql`f.bot_family = ${BotFamily.NO_UA}`);
  } else if (picked.traffic === TrafficFilter.NOT_BOTS) {
    conditions.push(notBotFamilySql(sql`f.bot_family`));
  }
  if (picked.botFamily) {
    conditions.push(sql`f.bot_family = ${picked.botFamily}`);
  }
  if (picked.channelType && picked.channelType !== LeadChannelFilter.ALL) {
    const type = CHANNEL_FILTER_TO_TYPE[picked.channelType];
    conditions.push(
      type === null
        ? sql`f.channel_type IS NULL`
        : sql`f.channel_type = ${type}`,
    );
  }
  if (picked.device) {
    conditions.push(sql`f.device = ${DEVICE_FILTER_TO_TYPE[picked.device]}`);
  }
  for (const key of LEAD_SEGMENT_TEXT_KEYS) {
    const value = picked[key];
    if (value) {
      conditions.push(
        matches(
          TEXT_COLUMNS[key],
          key === "country" || key === "localeCountry"
            ? value.toUpperCase()
            : value,
        ),
      );
    }
  }
  return conditions;
}

/** Timestamp column of a funnel step on the `f` alias (null = no timestamp). */
function reachColumn(reached: LeadDrillFilters["reached"]): SQL | null {
  switch (reached) {
    case FunnelReach.SIGNED_UP:
      return sql`f.signed_up_at`;
    case FunnelReach.FIRST_CHAT:
      return sql`f.first_chat_at`;
    case FunnelReach.PAID:
      return sql`f.first_paid_at`;
    default:
      return null;
  }
}

/**
 * "Reached at least this funnel step", optionally with the step inside
 * [from, to] (YYYY-MM-DD inclusive). VISITED + window = visited in the window.
 */
export function reachCondition(
  reached: LeadDrillFilters["reached"],
  from?: string,
  to?: string,
): SQL | null {
  const range = (column: SQL): SQL[] => [
    ...(from ? [sql`${column} >= ${utcSql(dayStart(from))}`] : []),
    ...(to ? [sql`${column} < ${utcSql(dayEnd(to))}`] : []),
  ];
  switch (reached) {
    case FunnelReach.VISITED:
      return sql`EXISTS (SELECT 1 FROM growth_visits v WHERE v.lead_id = f.id AND ${andAll(range(sql`v.visited_at`))})`;
    case FunnelReach.EMAIL_CONFIRMED:
      return sql`f.email_verified`;
    case FunnelReach.SIGNED_UP:
    case FunnelReach.FIRST_CHAT:
    case FunnelReach.PAID: {
      const column = reachColumn(reached);
      return column
        ? andAll([sql`${column} IS NOT NULL`, ...range(column)])
        : null;
    }
    default:
      return null;
  }
}

export function andAll(conditions: readonly SQL[]): SQL {
  return conditions.length > 0
    ? sql.join(
        conditions.map((condition) => sql`(${condition})`),
        sql` AND `,
      )
    : sql`TRUE`;
}

const DAY_MS = 86_400_000;

function dayStart(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

function dayEnd(day: string): Date {
  return new Date(dayStart(day).getTime() + DAY_MS);
}

/** `leads.created_at` window condition from YYYY-MM-DD (to = inclusive day). */
export function createdRangeCondition(
  from: string | undefined,
  to: string | undefined,
): SQL | null {
  const conditions: SQL[] = [];
  if (from) {
    conditions.push(sql`l.created_at >= ${utcSql(dayStart(from))}`);
  }
  if (to) {
    conditions.push(sql`l.created_at < ${utcSql(dayEnd(to))}`);
  }
  return conditions.length > 0 ? andAll(conditions) : null;
}

/**
 * Lead ids matching drill-down filters (for `leads.id IN (...)`), or null when
 * no drill filter is active.
 */
export function matchingLeadIdsSql(filters: LeadDrillFilters): SQL | null {
  const created = createdRangeCondition(filters.createdFrom, filters.createdTo);
  const conditions = [
    ...segmentConditions(filters),
    reachCondition(filters.reached, filters.reachedFrom, filters.reachedTo),
  ].filter((condition): condition is SQL => condition !== null);
  if (!created && conditions.length === 0) {
    return null;
  }
  return sql`SELECT f.id FROM (${leadFactsSql(created ?? sql`TRUE`)}) f WHERE ${andAll(conditions)}`;
}

/** Channel type as a LeadChannelFilter value (breakdown keys = filter values). */
const channelFilterKeySql = sql`(CASE ${sql.join(
  Object.entries(CHANNEL_TYPE_TO_FILTER).map(
    ([type, filter]) => sql`WHEN f.channel_type = ${type} THEN ${filter}`,
  ),
  sql` `,
)} ELSE ${LeadChannelFilter.UNATTRIBUTED} END)`;

/** Device as a LeadDeviceFilter value. */
const deviceFilterKeySql = sql`(CASE ${sql.join(
  Object.entries(DEVICE_TYPE_TO_FILTER).map(
    ([type, filter]) => sql`WHEN f.device = ${type} THEN ${filter}`,
  ),
  sql` `,
)} ELSE ${LeadDeviceFilter.UNKNOWN} END)`;

/** Column of the lead facts row a breakdown dimension groups by. */
export function dimensionColumn(dimension: LeadDimensionValue): SQL {
  switch (dimension) {
    case LeadDimension.CHANNEL_TYPE:
      return channelFilterKeySql;
    case LeadDimension.CHANNEL:
      return sql`f.channel`;
    case LeadDimension.SOURCE:
      return sql`f.source`;
    case LeadDimension.MEDIUM:
      return sql`f.medium`;
    case LeadDimension.CAMPAIGN:
      return sql`f.campaign`;
    case LeadDimension.REFERRER_HOST:
      return sql`f.referrer_host`;
    case LeadDimension.LANDING_PATH:
      return sql`f.landing_path`;
    case LeadDimension.REF_CODE:
      return sql`f.ref_code`;
    case LeadDimension.COUNTRY:
      return sql`f.country`;
    case LeadDimension.LOCALE_COUNTRY:
      return sql`f.locale_country`;
    case LeadDimension.DEVICE:
      return deviceFilterKeySql;
    case LeadDimension.BROWSER:
      return sql`f.browser`;
    case LeadDimension.OS:
      return sql`f.os`;
    case LeadDimension.BOT_FAMILY:
      return sql`f.bot_family`;
    default:
      return channelFilterKeySql;
  }
}
