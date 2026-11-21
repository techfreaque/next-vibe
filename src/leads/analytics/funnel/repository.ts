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
