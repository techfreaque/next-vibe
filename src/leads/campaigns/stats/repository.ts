/**
 * Campaign performance repository.
 *
 * Definitions (keep in sync with the widget hints):
 * - Sent: campaign rows with sent_at in the period (status not failed).
 * - Open / click rate: share of the rows sent in the period that have an
 *   opened_at / clicked_at timestamp (any time after sending).
 * - Unsubscribed / bounced: rows whose unsubscribed_at / bounced_at falls in
 *   the period. Failed: failed rows last touched in the period.
 * - Due now: pending, never sent, scheduled_at <= now. These only leave the
 *   queue when the email-campaigns dispatcher task runs.
 * - Locale: locale the mail was rendered in (email_send_log), else the lead's
 *   language-country.
 * All timestamps are UTC timestamp-without-time-zone.
 */

import "server-only";

import { inArray, type SQL, sql } from "drizzle-orm";
import { coreEnv } from "next-vibe/core/env";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { Environment } from "next-vibe/env/env-util";
import { emailCampaigns } from "next-vibe/identity/lead/db";
import { EmailCampaignStage, LeadStatus } from "next-vibe/identity/lead/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { cronTaskExecutions, cronTasks } from "next-vibe/tasks/cron/db";
import {
  isFailingTask,
  isNeverRunTask,
  isOverdueTask,
  isStuckTask,
} from "next-vibe/tasks/cron/health-summary";
import { CronTaskStatus } from "next-vibe/tasks/enum";
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

import { MessageStatus } from "@/messenger/messages/enum";

import { journeyVariantFromFilter, stageFromFilter } from "../filter-map";
import type {
  CampaignAutomation,
  CampaignStatsGetRequestOutput,
  CampaignStatsGetResponseOutput,
} from "./definition";
import type { CampaignStatsT } from "./i18n";

type NumLike = string | number | null;

/** The task that actually sends due campaign mail. */
export const CAMPAIGN_DISPATCHER_TASK_ID = "email-campaigns";
const CAMPAIGN_TASK_IDS = [
  CAMPAIGN_DISPATCHER_TASK_ID,
  "campaign-starter",
  "bounce-processor",
] as const;

const BREAKDOWN_LIMIT = 20;
/** Stages in journey order (stage breakdown sorts by this, not by volume). */
const STAGE_ORDER = [
  EmailCampaignStage.NOT_STARTED,
  EmailCampaignStage.INITIAL,
  EmailCampaignStage.FOLLOWUP_1,
  EmailCampaignStage.FOLLOWUP_2,
  EmailCampaignStage.FOLLOWUP_3,
  EmailCampaignStage.NURTURE,
  EmailCampaignStage.REACTIVATION,
];
const ERROR_LIMIT = 8;

function num(value: NumLike | undefined): number {
  return value === null || value === undefined ? 0 : Number(value);
}

function ratio(part: number, whole: number): number {
  return whole > 0 ? part / whole : 0;
}

function iso(value: string | Date | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const date =
    value instanceof Date
      ? value
      : new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function daysSince(value: string | null): number {
  if (!value) {
    return 0;
  }
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000),
  );
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

/** Campaign rows matching the request filters, with their render locale. */
export function campaignRowsCte(filters: {
  journeyVariant?: CampaignStatsGetRequestOutput["journeyVariant"];
  stage?: CampaignStatsGetRequestOutput["stage"];
  locale?: string;
}): SQL {
  const where: SQL[] = [sql`TRUE`];
  const variant = journeyVariantFromFilter(filters.journeyVariant);
  if (variant) {
    where.push(sql`e.journey_variant = ${variant}`);
  }
  const stage = stageFromFilter(filters.stage);
  if (stage) {
    where.push(sql`e.stage = ${stage}`);
  }
  const locale = filters.locale?.trim().toLowerCase();
  const localeWhere = locale
    ? sql`WHERE lower(r.loc) = ${locale} OR lower(r.loc) LIKE ${`${locale}-%`}`
    : sql``;
  return sql`ec AS (
    SELECT r.* FROM (
      SELECT e.id, e.lead_id, e.status, e.stage, e.journey_variant, e.error,
        e.scheduled_at, e.sent_at, e.opened_at, e.clicked_at, e.unsubscribed_at,
        e.bounced_at, e.updated_at,
        coalesce(
          (SELECT s.locale FROM email_send_log s WHERE s.campaign_id = e.id LIMIT 1),
          l.language || '-' || l.country
        ) AS loc
      FROM email_campaigns e JOIN leads l ON l.id = e.lead_id
      WHERE ${sql.join(where, sql` AND `)}
    ) r ${localeWhere}
  )`;
}

export class CampaignStatsRepository {
  private static async loadAutomation(): Promise<CampaignAutomation[]> {
    const rows = await db
      .select()
      .from(cronTasks)
      .where(inArray(cronTasks.id, [...CAMPAIGN_TASK_IDS]));
    const lastFailures = await db
      .select({
        taskId: cronTaskExecutions.taskId,
        error: cronTaskExecutions.error,
        startedAt: cronTaskExecutions.startedAt,
      })
      .from(cronTaskExecutions)
      .where(
        sql`${cronTaskExecutions.taskId} IN (${sql.join(
          CAMPAIGN_TASK_IDS.map((id) => sql`${id}`),
          sql`, `,
        )}) AND ${cronTaskExecutions.status} = ${CronTaskStatus.FAILED}`,
      )
      .orderBy(sql`${cronTaskExecutions.startedAt} DESC`)
      .limit(CAMPAIGN_TASK_IDS.length * 3);

    const now = new Date();
    return CAMPAIGN_TASK_IDS.map((id): CampaignAutomation => {
      const row = rows.find((r) => r.id === id);
      if (!row) {
        return {
          id,
          state: "missing",
          schedule: null,
          lastRunAt: null,
          nextRunAt: null,
          consecutiveFailures: 0,
          lastError: null,
        };
      }
      const failure = lastFailures.find((f) => f.taskId === id);
      // Mirrors the dispatch configuration default when there is no stored override.
      const dryRun =
        id === CAMPAIGN_DISPATCHER_TASK_ID &&
        (typeof row.taskInput.dryRun === "boolean"
          ? row.taskInput.dryRun
          : coreEnv.NODE_ENV !== Environment.PRODUCTION);
      let state: CampaignAutomation["state"] = "running";
      if (!row.enabled) {
        state = "disabled";
      } else if (dryRun) {
        state = "dryRun";
      } else if (isStuckTask(row, now) || isOverdueTask(row, now)) {
        state = "delayed";
      } else if (row.consecutiveFailures > 0 || isFailingTask(row)) {
        state = "failing";
      } else if (isNeverRunTask(row)) {
        state = "waiting";
      }
      return {
        id,
        state,
        schedule: row.schedule,
        lastRunAt: iso(row.lastExecutedAt),
        nextRunAt: row.enabled ? iso(row.nextExecutionAt) : null,
        consecutiveFailures: row.consecutiveFailures,
        lastError:
          row.consecutiveFailures > 0 && failure?.error?.message
            ? truncate(String(failure.error.message), 160)
            : null,
      };
    });
  }

  static async getStats(
    data: CampaignStatsGetRequestOutput,
    logger: EndpointLogger,
    t: CampaignStatsT,
  ): Promise<ResponseType<CampaignStatsGetResponseOutput>> {
    try {
      const [floor] = await db
        .select({ first: sql<string | null>`min(${emailCampaigns.sentAt})` })
        .from(emailCampaigns);
      const win = resolveAnalyticsWindow(
        data,
        new Date(),
        floor?.first
          ? new Date(`${String(floor.first).replace(" ", "T")}Z`)
          : null,
      );
      const cte = sql`WITH ${campaignRowsCte(data)}`;
      const cur = (col: string): SQL => inWindowSql(sql.raw(col), win);
      const prv = (col: string): SQL => inPreviousWindowSql(sql.raw(col), win);
      const bucketOf = (col: string): SQL =>
        bucketSql(sql.raw(col), win.bucket);
      const failedStatus = MessageStatus.FAILED;
      const pendingStatus = MessageStatus.PENDING;
      // Dedupe/status skips are recorded as failed rows but are not send errors.
      const skipped = sql.raw(
        `(ec.error LIKE 'duplicate:%' OR ec.error LIKE 'status_change:%')`,
      );
      const realFailure = sql`ec.status = ${failedStatus} AND NOT coalesce(${skipped}, false)`;
      const sentRow = sql.raw(
        `ec.sent_at IS NOT NULL AND ec.status <> '${MessageStatus.FAILED}'`,
      );

      const [
        automation,
        queueRows,
        kpiRows,
        sentSeries,
        openSeries,
        clickSeries,
        problemSeries,
        variantRows,
        stageRows,
        localeRows,
        errorRows,
      ] = await Promise.all([
        CampaignStatsRepository.loadAutomation(),

        db.execute<
          QueryResultRow & {
            dueNow: NumLike;
            overdue: NumLike;
            scheduled: NumLike;
            next24h: NumLike;
            failed7d: NumLike;
            dueLeads: NumLike;
            lastSent: string | null;
            sent24h: NumLike;
            oldestDue: string | null;
            nextScheduled: string | null;
            stuck: NumLike;
            running: NumLike;
          }
        >(sql`${cte}
          SELECT
            count(*) FILTER (WHERE ec.status = ${pendingStatus} AND ec.sent_at IS NULL AND ec.scheduled_at <= now() AT TIME ZONE 'UTC') AS "dueNow",
            count(*) FILTER (WHERE ec.status = ${pendingStatus} AND ec.sent_at IS NULL AND ec.scheduled_at <= (now() AT TIME ZONE 'UTC') - interval '24 hours') AS overdue,
            count(*) FILTER (WHERE ec.status = ${pendingStatus} AND ec.sent_at IS NULL AND ec.scheduled_at > now() AT TIME ZONE 'UTC') AS scheduled,
            count(*) FILTER (WHERE ec.status = ${pendingStatus} AND ec.sent_at IS NULL AND ec.scheduled_at > now() AT TIME ZONE 'UTC' AND ec.scheduled_at <= (now() AT TIME ZONE 'UTC') + interval '24 hours') AS "next24h",
            count(*) FILTER (WHERE ${realFailure} AND ec.updated_at >= (now() AT TIME ZONE 'UTC') - interval '7 days') AS "failed7d",
            count(DISTINCT ec.lead_id) FILTER (WHERE ec.status = ${pendingStatus} AND ec.sent_at IS NULL AND ec.scheduled_at <= now() AT TIME ZONE 'UTC') AS "dueLeads",
            max(ec.sent_at) FILTER (WHERE ec.sent_at IS NOT NULL AND ec.status <> ${failedStatus})::text AS "lastSent",
            count(*) FILTER (WHERE ec.sent_at >= (now() AT TIME ZONE 'UTC') - interval '24 hours' AND ec.status <> ${failedStatus}) AS "sent24h",
            min(ec.scheduled_at) FILTER (WHERE ec.status = ${pendingStatus} AND ec.sent_at IS NULL AND ec.scheduled_at <= now() AT TIME ZONE 'UTC')::text AS "oldestDue",
            min(ec.scheduled_at) FILTER (WHERE ec.status = ${pendingStatus} AND ec.sent_at IS NULL AND ec.scheduled_at > now() AT TIME ZONE 'UTC')::text AS "nextScheduled",
            (SELECT count(*) FROM email_send_log s JOIN ec matching ON matching.id = s.campaign_id
              WHERE s.status = ${pendingStatus} AND s.claimed_at < (now() AT TIME ZONE 'UTC') - interval '1 hour') AS stuck,
            (SELECT count(*) FROM leads WHERE status = ${LeadStatus.CAMPAIGN_RUNNING}) AS running
          FROM ec`),

        db.execute<
          QueryResultRow & {
            sent: NumLike;
            opened: NumLike;
            clicked: NumLike;
            sentPrev: NumLike;
            openedPrev: NumLike;
            clickedPrev: NumLike;
            unsub: NumLike;
            unsubPrev: NumLike;
            bounced: NumLike;
            bouncedPrev: NumLike;
            failed: NumLike;
            failedPrev: NumLike;
            skipped: NumLike;
          }
        >(sql`${cte}
          SELECT
            count(*) FILTER (WHERE ${sentRow} AND ${cur("ec.sent_at")}) AS sent,
            count(*) FILTER (WHERE ${sentRow} AND ${cur("ec.sent_at")} AND ec.opened_at IS NOT NULL) AS opened,
            count(*) FILTER (WHERE ${sentRow} AND ${cur("ec.sent_at")} AND ec.clicked_at IS NOT NULL) AS clicked,
            count(*) FILTER (WHERE ${sentRow} AND ${prv("ec.sent_at")}) AS "sentPrev",
            count(*) FILTER (WHERE ${sentRow} AND ${prv("ec.sent_at")} AND ec.opened_at IS NOT NULL) AS "openedPrev",
            count(*) FILTER (WHERE ${sentRow} AND ${prv("ec.sent_at")} AND ec.clicked_at IS NOT NULL) AS "clickedPrev",
            count(*) FILTER (WHERE ${cur("ec.unsubscribed_at")}) AS unsub,
            count(*) FILTER (WHERE ${prv("ec.unsubscribed_at")}) AS "unsubPrev",
            count(*) FILTER (WHERE ${cur("ec.bounced_at")}) AS bounced,
            count(*) FILTER (WHERE ${prv("ec.bounced_at")}) AS "bouncedPrev",
            count(*) FILTER (WHERE ${realFailure} AND ${cur("ec.updated_at")}) AS failed,
            count(*) FILTER (WHERE ${realFailure} AND ${prv("ec.updated_at")}) AS "failedPrev",
            count(*) FILTER (WHERE ec.status = ${failedStatus} AND coalesce(${skipped}, false) AND ${cur("ec.updated_at")}) AS skipped
          FROM ec`),

        db.execute<
          QueryResultRow & { bucket: string; value: NumLike }
        >(sql`${cte}
          SELECT ${bucketOf("ec.sent_at")} AS bucket, count(*) AS value
          FROM ec WHERE ${sentRow} AND ${cur("ec.sent_at")} GROUP BY 1`),
        db.execute<
          QueryResultRow & { bucket: string; value: NumLike }
        >(sql`${cte}
          SELECT ${bucketOf("ec.sent_at")} AS bucket, count(*) AS value
          FROM ec WHERE ${sentRow} AND ${cur("ec.sent_at")} AND ec.opened_at IS NOT NULL GROUP BY 1`),
        db.execute<
          QueryResultRow & { bucket: string; value: NumLike }
        >(sql`${cte}
          SELECT ${bucketOf("ec.sent_at")} AS bucket, count(*) AS value
          FROM ec WHERE ${sentRow} AND ${cur("ec.sent_at")} AND ec.clicked_at IS NOT NULL GROUP BY 1`),

        db.execute<
          QueryResultRow & { bucket: string; kind: string; value: NumLike }
        >(sql`${cte}
          SELECT ${bucketOf("ec.updated_at")} AS bucket, 'failed' AS kind, count(*) AS value
          FROM ec WHERE ${realFailure} AND ${cur("ec.updated_at")} GROUP BY 1
          UNION ALL
          SELECT ${bucketOf("ec.bounced_at")}, 'bounced', count(*)
          FROM ec WHERE ${cur("ec.bounced_at")} GROUP BY 1
          UNION ALL
          SELECT ${bucketOf("ec.unsubscribed_at")}, 'unsubscribed', count(*)
          FROM ec WHERE ${cur("ec.unsubscribed_at")} GROUP BY 1`),

        ...(["journey_variant", "stage", "loc"] as const).map((dim) =>
          db.execute<
            QueryResultRow & {
              key: string | null;
              sent: NumLike;
              opened: NumLike;
              clicked: NumLike;
              unsub: NumLike;
              bounced: NumLike;
              failed: NumLike;
              due: NumLike;
            }
          >(sql`${cte}
            SELECT ec.${sql.raw(dim)} AS key,
              count(*) FILTER (WHERE ${sentRow} AND ${cur("ec.sent_at")}) AS sent,
              count(*) FILTER (WHERE ${sentRow} AND ${cur("ec.sent_at")} AND ec.opened_at IS NOT NULL) AS opened,
              count(*) FILTER (WHERE ${sentRow} AND ${cur("ec.sent_at")} AND ec.clicked_at IS NOT NULL) AS clicked,
              count(*) FILTER (WHERE ${cur("ec.unsubscribed_at")}) AS unsub,
              count(*) FILTER (WHERE ${cur("ec.bounced_at")}) AS bounced,
              count(*) FILTER (WHERE ${realFailure} AND ${cur("ec.updated_at")}) AS failed,
              count(*) FILTER (WHERE ec.status = ${pendingStatus} AND ec.sent_at IS NULL AND ec.scheduled_at <= now() AT TIME ZONE 'UTC') AS due
            FROM ec GROUP BY 1
            HAVING count(*) FILTER (WHERE
              (${sentRow} AND ${cur("ec.sent_at")})
              OR (ec.status = ${pendingStatus} AND ec.sent_at IS NULL AND ec.scheduled_at <= now() AT TIME ZONE 'UTC')
              OR (${realFailure} AND ${cur("ec.updated_at")})
              OR ${cur("ec.bounced_at")} OR ${cur("ec.unsubscribed_at")}
            ) > 0
            ORDER BY ${
              dim === "stage"
                ? sql`array_position(ARRAY[${sql.join(
                    STAGE_ORDER.map((st) => sql`${st}`),
                    sql`, `,
                  )}]::text[], ec.stage), 1`
                : sql`(count(*) FILTER (WHERE ${sentRow} AND ${cur("ec.sent_at")}) + count(*) FILTER (WHERE ec.status = ${pendingStatus} AND ec.sent_at IS NULL AND ec.scheduled_at <= now() AT TIME ZONE 'UTC')) DESC, 1`
            }
            LIMIT ${BREAKDOWN_LIMIT}`),
        ),

        db.execute<QueryResultRow & { key: string; count: NumLike }>(sql`${cte}
          SELECT left(coalesce(nullif(ec.error, ''), '-'), 120) AS key, count(*) AS count
          FROM ec WHERE ${realFailure} AND ${cur("ec.updated_at")}
          GROUP BY 1 ORDER BY 2 DESC LIMIT ${ERROR_LIMIT}`),
      ]);

      const variantTrendRows = await db.execute<
        QueryResultRow & { bucket: string; key: string; value: NumLike }
      >(sql`${cte}
          SELECT ${bucketOf("ec.sent_at")} AS bucket, ec.journey_variant AS key, count(*) AS value
          FROM ec WHERE ${sentRow} AND ${cur("ec.sent_at")}
          GROUP BY 1, 2`);

      const q = queueRows.rows[0];
      const k = kpiRows.rows[0];
      const buckets = win.buckets;
      const series = (
        rows: Array<{ bucket: string; value: NumLike }>,
      ): number[] =>
        fillBuckets(
          buckets,
          rows.map((r) => ({ bucket: r.bucket, value: num(r.value) })),
        );
      const problemOf = (kind: string): number[] =>
        series(problemSeries.rows.filter((r) => r.kind === kind));
      const hasPrevious = win.previousFrom !== null;
      const kpi = (
        value: number,
        previous: number,
      ): { value: number; previous: number | null } => ({
        value,
        previous: hasPrevious ? previous : null,
      });
      const sent = num(k?.sent);
      const sentPrev = num(k?.sentPrev);
      const breakdown = (
        rows: typeof variantRows.rows,
      ): CampaignStatsGetResponseOutput["byVariant"] =>
        rows.map((r) => ({
          key: r.key,
          metrics: {
            sent: num(r.sent),
            opened: num(r.opened),
            clicked: num(r.clicked),
            openRate: ratio(num(r.opened), num(r.sent)),
            clickRate: ratio(num(r.clicked), num(r.sent)),
            unsubscribed: num(r.unsub),
            bounced: num(r.bounced),
            failed: num(r.failed),
            due: num(r.due),
          },
        }));

      const dispatcher =
        automation.find((a) => a.id === CAMPAIGN_DISPATCHER_TASK_ID) ??
        automation[0];
      if (!dispatcher) {
        return fail({
          message: t("get.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      return success({
        window: serializeWindow(win),
        engine: { dispatcher, tasks: automation },
        queue: {
          dueNow: num(q?.dueNow),
          overdue24h: num(q?.overdue),
          scheduled: num(q?.scheduled),
          scheduledNext24h: num(q?.next24h),
          failed7d: num(q?.failed7d),
          dueLeads: num(q?.dueLeads),
          lastSentAt: iso(q?.lastSent),
          sent24h: num(q?.sent24h),
          stuckClaims: num(q?.stuck),
          oldestDueAt: iso(q?.oldestDue),
          oldestDueDays: daysSince(iso(q?.oldestDue)),
          nextScheduledAt: iso(q?.nextScheduled),
          leadsInCampaign: num(q?.running),
        },
        kpis: {
          sent: kpi(sent, sentPrev),
          openRate: kpi(
            ratio(num(k?.opened), sent),
            ratio(num(k?.openedPrev), sentPrev),
          ),
          clickRate: kpi(
            ratio(num(k?.clicked), sent),
            ratio(num(k?.clickedPrev), sentPrev),
          ),
          unsubscribed: kpi(num(k?.unsub), num(k?.unsubPrev)),
          bounced: kpi(num(k?.bounced), num(k?.bouncedPrev)),
          failed: kpi(num(k?.failed), num(k?.failedPrev)),
        },
        totals: {
          opened: num(k?.opened),
          clicked: num(k?.clicked),
          skipped: num(k?.skipped),
        },
        trend: {
          buckets,
          series: [
            { key: "sent", values: series(sentSeries.rows) },
            { key: "opened", values: series(openSeries.rows) },
            { key: "clicked", values: series(clickSeries.rows) },
          ],
        },
        problems: {
          buckets,
          series: [
            { key: "failed", values: problemOf("failed") },
            { key: "bounced", values: problemOf("bounced") },
            { key: "unsubscribed", values: problemOf("unsubscribed") },
          ],
        },
        funnel: [
          { key: "sent", value: sent },
          { key: "opened", value: num(k?.opened) },
          { key: "clicked", value: num(k?.clicked) },
        ],
        variantTrend: {
          buckets,
          series: [...new Set(variantTrendRows.rows.map((r) => r.key))]
            .toSorted()
            .map((key) => ({
              key,
              values: series(
                variantTrendRows.rows.filter((r) => r.key === key),
              ),
            })),
        },
        byVariant: breakdown(variantRows.rows),
        byStage: breakdown(stageRows.rows),
        byLocale: breakdown(localeRows.rows),
        topErrors: errorRows.rows.map((r) => ({
          key: r.key,
          metrics: { count: num(r.count) },
        })),
      });
    } catch (error) {
      logger.error("campaign.stats.error", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
