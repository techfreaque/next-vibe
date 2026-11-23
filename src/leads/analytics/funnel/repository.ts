import "server-only";

/**
 * Funnel report: leads created in the period (cohort) and how far they got,
 * overall and per segment (source, ref code, ...).
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
import { leadEngagements } from "next-vibe/identity/lead/db";
import { EngagementTypes } from "next-vibe/identity/lead/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  BreakdownRow,
  TimeSeries,
} from "next-vibe/unified-ui/analytics/schema";
import type { AnalyticsWindow } from "next-vibe/unified-ui/analytics/window";
import {
  fillBuckets,
  serializeWindow,
  toDayKey,
} from "next-vibe/unified-ui/analytics/window";
import {
  bucketSql,
  inPreviousWindowSql,
  inWindowSql,
  utcSql,
} from "next-vibe/unified-ui/analytics/window-sql";
import type { QueryResultRow } from "pg";

import { WALL_META } from "@/leads/tracking/wall-meta";
import { pendingSignups, signupEvents } from "@/user/public/signup/db";
import { SignupEventType } from "@/user/public/signup/event-type";
import { expiryDedupeKeySql } from "@/user/public/signup/events";

import { resolveLeadWindow } from "../acquisition/repository";
import { notBotFamilySql } from "../bot-sql";
import { LeadDimension } from "../enum";
import type { LeadSegmentFilters } from "../filters";
import {
  andAll,
  dimensionColumn,
  leadFactsSql,
  segmentConditions,
} from "../segment-sql";
import type {
  FunnelReportRequestOutput,
  FunnelReportResponseOutput,
} from "./definition";
import type { FunnelReportT } from "./i18n";

/** Step keys in funnel order. */
export const FUNNEL_STEPS = [
  "leads",
  "humans",
  "firstChats",
  "signups",
  "emailConfirmed",
  "payers",
] as const;

/**
 * Funnel steps of a lead cohort.
 *
 * leads / humans count lead rows. Every later step counts PEOPLE: a returning
 * account gets a new lead per device or session, so per-lead counting showed
 * one paying customer as dozens of "payers". A lead converts when its account
 * was created at or after the lead (an older account that only logged in on a
 * new device is not a conversion of that lead); each account counts once.
 *
 * Steps after "humans" only count leads that are not known bots (browser user
 * agent, or none recorded). Unknown stays in: many signup leads were written
 * without a user agent, and dropping them would hide real signups and payers.
 */
function stepCounts(prefix: SQL): SQL {
  const human = notBotFamilySql(sql`${prefix}bot_family`);
  const converted = sql`(${prefix}user_id IS NOT NULL AND ${prefix}signed_up_at >= ${prefix}created_at - interval '10 minutes')`;
  const account = sql`CASE WHEN ${converted} THEN ${prefix}user_id END`;
  const person = sql`coalesce(${account}::text, ${prefix}id::text)`;
  return sql`
    count(*)::int AS leads,
    count(*) FILTER (WHERE ${human})::int AS humans,
    count(DISTINCT ${person}) FILTER (WHERE ${human} AND (${prefix}lead_first_chat_at IS NOT NULL OR (${converted} AND ${prefix}first_chat_at IS NOT NULL)))::int AS "firstChats",
    count(DISTINCT ${account}) FILTER (WHERE ${human})::int AS signups,
    count(DISTINCT ${account}) FILTER (WHERE ${human} AND ${prefix}email_verified)::int AS "emailConfirmed",
    count(DISTINCT ${account}) FILTER (WHERE ${human} AND ${prefix}first_paid_at IS NOT NULL)::int AS payers
  `;
}

/** The lead's account was created at or after the lead (a conversion). */
const CONVERTED = sql`(user_id IS NOT NULL AND signed_up_at >= created_at - interval '10 minutes')`;

type StepRow = Record<(typeof FUNNEL_STEPS)[number], number>;

/** Signup confirmation steps (signup_events), distinct leads per step. */
export const SIGNUP_STEPS = [
  "started",
  "emailSent",
  "sendFailed",
  "bounced",
  "expired",
  "reminded",
  "confirmed",
] as const;

type SignupStep = (typeof SIGNUP_STEPS)[number];

const SIGNUP_STEP_OF_EVENT: Record<string, SignupStep> = {
  [SignupEventType.STARTED]: "started",
  [SignupEventType.EMAIL_SENT]: "emailSent",
  [SignupEventType.SEND_FAILED]: "sendFailed",
  [SignupEventType.BOUNCED]: "bounced",
  [SignupEventType.EXPIRED]: "expired",
  [SignupEventType.REMINDER_SENT]: "reminded",
  [SignupEventType.CONFIRMED]: "confirmed",
};

/**
 * `WITH ev AS (...), sev AS (...)`: signup step events of leads matching the
 * segment. Pending rows that expired but were not swept yet count as EXPIRED
 * at their expiry (read-only, the bounce sync writes the real event).
 */
/**
 * Pending signups whose start was recorded live. The migration that added
 * signup_events backfilled only the pending rows still present (failures:
 * expired, bounced, unconfirmed); confirmed ones were already consumed, so
 * counting backfilled starts would show a fake 20% confirm rate. Every step
 * counts only for these tracked signups.
 */
const TRACKED_PENDING = sql`SELECT te.pending_id FROM ${signupEvents} te
  WHERE te.type = ${SignupEventType.STARTED}
    AND (te.dedupe_key IS NULL OR te.dedupe_key NOT LIKE 'backfill-%')`;

/** First live-tracked signup start (null = nothing tracked yet). */
async function signupTrackingSince(): Promise<Date | null> {
  const { rows } = await db.execute<QueryResultRow & { since: string | null }>(
    sql`SELECT min(te.occurred_at)::text AS since FROM ${signupEvents} te
      WHERE te.type = ${SignupEventType.STARTED}
        AND (te.dedupe_key IS NULL OR te.dedupe_key NOT LIKE 'backfill-%')`,
  );
  const since = rows[0]?.since;
  return since ? new Date(`${since.replace(" ", "T")}Z`) : null;
}

function signupEventsCte(
  win: AnalyticsWindow,
  filters: LeadSegmentFilters,
): SQL {
  const start = utcSql(win.previousFrom ?? win.from);
  const end = utcSql(win.to);
  return sql`ev AS (
    SELECT e.lead_id, e.type, e.occurred_at FROM ${signupEvents} e
    WHERE e.lead_id IS NOT NULL AND e.occurred_at >= ${start} AND e.occurred_at < ${end}
      AND e.pending_id IN (${TRACKED_PENDING})
    UNION ALL
    SELECT p.lead_id, ${SignupEventType.EXPIRED}::text, p.expires_at FROM ${pendingSignups} p
    WHERE p.expires_at <= ${utcSql(new Date())}
      AND p.expires_at >= ${start} AND p.expires_at < ${end}
      AND p.id IN (${TRACKED_PENDING})
      AND NOT EXISTS (
        SELECT 1 FROM ${signupEvents} x
        WHERE x.dedupe_key = ${expiryDedupeKeySql(sql`p.id`, sql`p.expires_at`)}
      )
  ),
  sev AS (
    SELECT ev.*, f.* FROM ev
    JOIN (${leadFactsSql(sql`l.id IN (SELECT lead_id FROM ev)`)}) f ON f.id = ev.lead_id
    WHERE ${andAll(segmentConditions(filters))}
  )`;
}

function emptySignupSteps(): Record<SignupStep, number> {
  return {
    started: 0,
    emailSent: 0,
    sendFailed: 0,
    bounced: 0,
    expired: 0,
    reminded: 0,
    confirmed: 0,
  };
}

/**
 * Conversion walls (lead_engagements), distinct leads per wall: a chat send
 * refused for credits (guest or account) and the 18+ consent dialog closed
 * without agreeing. Dated when it happened, like the signup steps.
 */
export const WALL_STEPS = [
  "creditWallGuests",
  "creditWallAccounts",
  "consentDeclined",
] as const;

type WallStep = (typeof WALL_STEPS)[number];

const WALL_TYPES = sql`(${EngagementTypes.CREDIT_WALL}, ${EngagementTypes.CONSENT_DECLINED})`;

/** First recorded wall (null = nothing tracked yet). */
async function wallTrackingSince(): Promise<Date | null> {
  const { rows } = await db.execute<QueryResultRow & { since: string | null }>(
    sql`SELECT min(e.created_at)::text AS since FROM ${leadEngagements} e
      WHERE e.engagement_type IN ${WALL_TYPES}`,
  );
  const since = rows[0]?.since;
  return since ? new Date(`${since.replace(" ", "T")}Z`) : null;
}

/** `WITH wev AS (...), swev AS (...)`: wall events of leads in the segment. */
function wallEventsCte(win: AnalyticsWindow, filters: LeadSegmentFilters): SQL {
  const start = utcSql(win.previousFrom ?? win.from);
  const end = utcSql(win.to);
  return sql`wev AS (
    SELECT e.lead_id,
      CASE
        WHEN e.engagement_type = ${EngagementTypes.CONSENT_DECLINED} THEN 'consentDeclined'
        WHEN e.metadata->>${WALL_META.who} = 'account' THEN 'creditWallAccounts'
        ELSE 'creditWallGuests'
      END AS wall,
      e.created_at AS occurred_at
    FROM ${leadEngagements} e
    WHERE e.engagement_type IN ${WALL_TYPES}
      AND e.created_at >= ${start} AND e.created_at < ${end}
  ),
  swev AS (
    SELECT wev.*, f.* FROM wev
    JOIN (${leadFactsSql(sql`l.id IN (SELECT lead_id FROM wev)`)}) f ON f.id = wev.lead_id
    WHERE ${andAll(segmentConditions(filters))}
  )`;
}

function emptyWallSteps(): Record<WallStep, number> {
  return { creditWallGuests: 0, creditWallAccounts: 0, consentDeclined: 0 };
}

function isWallStep(value: string): value is WallStep {
  return (WALL_STEPS as readonly string[]).includes(value);
}

function cohortCte(win: AnalyticsWindow, filters: LeadSegmentFilters): SQL {
  const start = win.previousFrom ?? win.from;
  return sql`seg AS (
    SELECT * FROM (${leadFactsSql(sql`l.created_at >= ${utcSql(start)} AND l.created_at < ${utcSql(win.to)}`)}) f
    WHERE ${andAll(segmentConditions(filters))}
  )`;
}

function rate(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0;
}

function withRates(row: StepRow): Record<string, number> {
  return {
    ...row,
    chatRate: rate(row.firstChats, row.humans),
    signupRate: rate(row.signups, row.humans),
    payRate: rate(row.payers, row.signups),
    overall: rate(row.payers, row.humans),
  };
}

export class FunnelReportRepository {
  static async getReport(
    data: FunnelReportRequestOutput,
    t: FunnelReportT,
    logger: EndpointLogger,
  ): Promise<ResponseType<FunnelReportResponseOutput>> {
    try {
      const win = await resolveLeadWindow(data);
      const dimension = data.dimension ?? LeadDimension.CHANNEL;
      const cte = cohortCte(win, data);
      const now = inWindowSql(sql`created_at`, win);
      const prev = inPreviousWindowSql(sql`created_at`, win);

      const evCte = signupEventsCte(win, data);
      const evNow = inWindowSql(sql`occurred_at`, win);
      const evPrev = inPreviousWindowSql(sql`occurred_at`, win);
      const trackedSince = await signupTrackingSince();
      const [signupPeriods, signupSegmentRows] = await Promise.all([
        db.execute<
          QueryResultRow & { current: boolean; type: string; leads: number }
        >(sql`
          WITH ${evCte}
          SELECT (${evNow}) AS current, type, count(DISTINCT lead_id)::int AS leads
          FROM sev WHERE (${evNow}) OR (${evPrev}) GROUP BY 1, 2
        `),
        db.execute<
          QueryResultRow & { key: string | null; type: string; leads: number }
        >(sql`
          WITH ${evCte}
          SELECT f.key, f.type, count(DISTINCT f.lead_id)::int AS leads
          FROM (SELECT ${dimensionColumn(dimension)} AS key, f.type, f.lead_id, f.occurred_at FROM sev f) f
          WHERE ${inWindowSql(sql`f.occurred_at`, win)}
          GROUP BY 1, 2
        `),
      ]);
      const signupTotals = (current: boolean): Record<SignupStep, number> => {
        const totals = emptySignupSteps();
        for (const row of signupPeriods.rows) {
          const step = SIGNUP_STEP_OF_EVENT[row.type];
          if (step && row.current === current) {
            totals[step] = row.leads;
          }
        }
        return totals;
      };
      const signupNow = signupTotals(true);
      // No comparison when the previous period predates live tracking.
      const signupPrev =
        win.previousFrom &&
        trackedSince &&
        trackedSince.getTime() <= win.previousFrom.getTime()
          ? signupTotals(false)
          : null;
      const signupByKey = new Map<string | null, Record<SignupStep, number>>();
      for (const row of signupSegmentRows.rows) {
        const step = SIGNUP_STEP_OF_EVENT[row.type];
        if (!step) {
          continue;
        }
        const entry = signupByKey.get(row.key) ?? emptySignupSteps();
        entry[step] = row.leads;
        signupByKey.set(row.key, entry);
      }
      const signupSegments: BreakdownRow[] = [...signupByKey.entries()]
        .map(([key, steps]) => ({
          key,
          metrics: {
            ...steps,
            confirmRate: rate(steps.confirmed, steps.started),
          },
        }))
        .toSorted(
          (a, b) =>
            (b.metrics.started ?? 0) - (a.metrics.started ?? 0) ||
            (b.metrics.confirmed ?? 0) - (a.metrics.confirmed ?? 0),
        )
        .slice(0, 50);

      const wallCte = wallEventsCte(win, data);
      const wallNowSql = inWindowSql(sql`occurred_at`, win);
      const wallPrevSql = inPreviousWindowSql(sql`occurred_at`, win);
      const [wallSince, wallPeriods, wallSegmentRows] = await Promise.all([
        wallTrackingSince(),
        db.execute<
          QueryResultRow & { current: boolean; wall: string; leads: number }
        >(sql`
          WITH ${wallCte}
          SELECT (${wallNowSql}) AS current, wall, count(DISTINCT lead_id)::int AS leads
          FROM swev WHERE (${wallNowSql}) OR (${wallPrevSql}) GROUP BY 1, 2
        `),
        db.execute<
          QueryResultRow & { key: string | null; wall: string; leads: number }
        >(sql`
          WITH ${wallCte}
          SELECT f.key, f.wall, count(DISTINCT f.lead_id)::int AS leads
          FROM (SELECT ${dimensionColumn(dimension)} AS key, f.wall, f.lead_id, f.occurred_at FROM swev f) f
          WHERE ${inWindowSql(sql`f.occurred_at`, win)}
          GROUP BY 1, 2
        `),
      ]);
      const wallTotals = (current: boolean): Record<WallStep, number> => {
        const totals = emptyWallSteps();
        for (const row of wallPeriods.rows) {
          if (isWallStep(row.wall) && row.current === current) {
            totals[row.wall] = row.leads;
          }
        }
        return totals;
      };
      const wallNow = wallTotals(true);
      const wallPrev =
        win.previousFrom &&
        wallSince &&
        wallSince.getTime() <= win.previousFrom.getTime()
          ? wallTotals(false)
          : null;
      const wallByKey = new Map<string | null, Record<WallStep, number>>();
      for (const row of wallSegmentRows.rows) {
        if (!isWallStep(row.wall)) {
          continue;
        }
        const entry = wallByKey.get(row.key) ?? emptyWallSteps();
        entry[row.wall] = row.leads;
        wallByKey.set(row.key, entry);
      }
      const wallSegments: BreakdownRow[] = [...wallByKey.entries()]
        .map(([key, steps]) => ({ key, metrics: { ...steps } }))
        .toSorted(
          (a, b) =>
            (b.metrics.creditWallGuests ?? 0) +
            (b.metrics.creditWallAccounts ?? 0) -
            ((a.metrics.creditWallGuests ?? 0) +
              (a.metrics.creditWallAccounts ?? 0)),
        )
        .slice(0, 50);

      const [periodsResult, segmentsResult, trendResult] = await Promise.all([
        db.execute<QueryResultRow & StepRow & { current: boolean }>(
          sql`WITH ${cte} SELECT (${now}) AS current, ${stepCounts(sql``)}
              FROM seg WHERE (${now}) OR (${prev}) GROUP BY 1`,
        ),
        db.execute<QueryResultRow & StepRow & { key: string | null }>(sql`
            WITH ${cte}
            SELECT f.key, ${stepCounts(sql`f.`)}
            FROM (SELECT ${dimensionColumn(dimension)} AS key, * FROM seg f WHERE ${now}) f
            GROUP BY 1
            ORDER BY (key IS NULL), humans DESC, leads DESC, key
            LIMIT 50
          `),
        db.execute<
          QueryResultRow & { key: string; bucket: string; value: number }
        >(sql`
            WITH ${cte}
            SELECT 'humans' AS key, ${bucketSql(sql`created_at`, win.bucket)} AS bucket, count(*)::int AS value
              FROM seg WHERE ${now} AND ${notBotFamilySql(sql`bot_family`)} GROUP BY 2
            UNION ALL
            SELECT 'signups', bucket, count(*)::int FROM (
              SELECT DISTINCT ON (user_id) user_id, ${bucketSql(sql`created_at`, win.bucket)} AS bucket
              FROM seg WHERE ${now} AND ${notBotFamilySql(sql`bot_family`)} AND ${CONVERTED}
              ORDER BY user_id, created_at
            ) s GROUP BY 2
            UNION ALL
            SELECT 'payers', bucket, count(*)::int FROM (
              SELECT DISTINCT ON (user_id) user_id, ${bucketSql(sql`created_at`, win.bucket)} AS bucket
              FROM seg WHERE ${now} AND ${notBotFamilySql(sql`bot_family`)} AND ${CONVERTED} AND first_paid_at IS NOT NULL
              ORDER BY user_id, created_at
            ) p GROUP BY 2
          `),
      ]);

      const empty: StepRow = {
        leads: 0,
        humans: 0,
        firstChats: 0,
        signups: 0,
        emailConfirmed: 0,
        payers: 0,
      };
      const totals = periodsResult.rows.find((row) => row.current) ?? empty;
      const previous = win.previousFrom
        ? (periodsResult.rows.find((row) => !row.current) ?? empty)
        : null;
      const segments: BreakdownRow[] = segmentsResult.rows.map(
        ({
          key,
          leads,
          humans,
          firstChats,
          signups,
          emailConfirmed,
          payers,
        }) => ({
          key,
          metrics: withRates({
            leads,
            humans,
            firstChats,
            signups,
            emailConfirmed,
            payers,
          }),
        }),
      );
      const trend: TimeSeries = {
        buckets: win.buckets,
        series: ["humans", "signups", "payers"].map((key) => ({
          key,
          values: fillBuckets(
            win.buckets,
            trendResult.rows.filter((row) => row.key === key),
          ),
        })),
      };

      return success({
        window: serializeWindow(win),
        dimensionUsed: dimension,
        steps: FUNNEL_STEPS.map((key) => ({ key, value: totals[key] })),
        previousSteps: previous
          ? FUNNEL_STEPS.map((key) => ({ key, value: previous[key] }))
          : null,
        rates: withRates({
          leads: totals.leads,
          humans: totals.humans,
          firstChats: totals.firstChats,
          signups: totals.signups,
          emailConfirmed: totals.emailConfirmed,
          payers: totals.payers,
        }),
        segments,
        trend,
        signupSteps: SIGNUP_STEPS.map((key) => ({
          key,
          value: signupNow[key],
        })),
        previousSignupSteps: signupPrev
          ? SIGNUP_STEPS.map((key) => ({ key, value: signupPrev[key] }))
          : null,
        signupTrackedSince: trackedSince ? toDayKey(trackedSince) : null,
        signupSegments,
        wallSteps: WALL_STEPS.map((key) => ({ key, value: wallNow[key] })),
        previousWallSteps: wallPrev
          ? WALL_STEPS.map((key) => ({ key, value: wallPrev[key] }))
          : null,
        wallTrackedSince: wallSince ? toDayKey(wallSince) : null,
        wallSegments,
      });
    } catch (error) {
      logger.error("Funnel report failed", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
