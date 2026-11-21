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
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  BreakdownRow,
  TimeSeries,
} from "next-vibe/unified-ui/analytics/schema";
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

import { pendingSignups, signupEvents } from "@/user/public/signup/db";
import { SignupEventType } from "@/user/public/signup/event-type";
import { expiryDedupeKeySql } from "@/user/public/signup/events";

import { resolveLeadWindow } from "../acquisition/repository";
import { BotFamily, LeadDimension } from "../enum";
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

/** Steps after "humans" only count human leads, so the funnel is monotonic. */
function stepCounts(prefix: SQL): SQL {
  const human = sql`${prefix}bot_family = ${BotFamily.HUMAN}`;
  return sql`
    count(*)::int AS leads,
    count(*) FILTER (WHERE ${human})::int AS humans,
    count(*) FILTER (WHERE ${human} AND ${prefix}first_chat_at IS NOT NULL)::int AS "firstChats",
    count(*) FILTER (WHERE ${human} AND ${prefix}signed_up_at IS NOT NULL)::int AS signups,
    count(*) FILTER (WHERE ${human} AND ${prefix}email_verified)::int AS "emailConfirmed",
    count(*) FILTER (WHERE ${human} AND ${prefix}first_paid_at IS NOT NULL)::int AS payers
  `;
}

type StepRow = Record<(typeof FUNNEL_STEPS)[number], number>;

/** Signup confirmation steps (signup_events), distinct leads per step. */
export const SIGNUP_STEPS = [
  "started",
  "emailSent",
  "sendFailed",
  "bounced",
  "expired",
  "confirmed",
] as const;

type SignupStep = (typeof SIGNUP_STEPS)[number];

const SIGNUP_STEP_OF_EVENT: Record<string, SignupStep> = {
  [SignupEventType.STARTED]: "started",
  [SignupEventType.EMAIL_SENT]: "emailSent",
  [SignupEventType.SEND_FAILED]: "sendFailed",
  [SignupEventType.BOUNCED]: "bounced",
  [SignupEventType.EXPIRED]: "expired",
  [SignupEventType.CONFIRMED]: "confirmed",
};

/**
 * `WITH ev AS (...), sev AS (...)`: signup step events of leads matching the
 * segment. Pending rows that expired but were not swept yet count as EXPIRED
 * at their expiry (read-only, the bounce sync writes the real event).
 */
function signupEventsCte(
  win: AnalyticsWindow,
  filters: LeadSegmentFilters,
): SQL {
  const start = utcSql(win.previousFrom ?? win.from);
  const end = utcSql(win.to);
  return sql`ev AS (
    SELECT e.lead_id, e.type, e.occurred_at FROM ${signupEvents} e
    WHERE e.lead_id IS NOT NULL AND e.occurred_at >= ${start} AND e.occurred_at < ${end}
    UNION ALL
    SELECT p.lead_id, ${SignupEventType.EXPIRED}::text, p.expires_at FROM ${pendingSignups} p
    WHERE p.expires_at <= ${utcSql(new Date())}
      AND p.expires_at >= ${start} AND p.expires_at < ${end}
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
    confirmed: 0,
  };
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
      const signupPrev = win.previousFrom ? signupTotals(false) : null;
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
              FROM seg WHERE ${now} AND bot_family = ${BotFamily.HUMAN} GROUP BY 2
            UNION ALL
            SELECT 'signups', ${bucketSql(sql`created_at`, win.bucket)}, count(*)::int
              FROM seg WHERE ${now} AND bot_family = ${BotFamily.HUMAN} AND signed_up_at IS NOT NULL GROUP BY 2
            UNION ALL
            SELECT 'payers', ${bucketSql(sql`created_at`, win.bucket)}, count(*)::int
              FROM seg WHERE ${now} AND bot_family = ${BotFamily.HUMAN} AND first_paid_at IS NOT NULL GROUP BY 2
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
        signupSegments,
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
