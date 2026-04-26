/**
 * Campaign Stats Repository
 * Queries email campaign performance metrics from the DB.
 */

import "server-only";

import { and, count, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { Environment } from "next-vibe/shared/utils/env-util";

import { MessageStatus } from "@/app/api/[locale]/messenger/messages/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { isValidEnumValue } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { getCronFrequencyMinutes } from "@/app/api/[locale]/system/unified-interface/tasks/cron-formatter";
import {
  cronTaskExecutions,
  cronTasks,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { CronTasksRepository } from "@/app/api/[locale]/system/unified-interface/tasks/cron/repository";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues } from "@/i18n/core/config";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";
import { emailCampaigns, leadLeadLinks, leads } from "../../db";
import {
  EmailJourneyVariant,
  EmailJourneyVariantFilter,
  LeadStatus,
} from "../../enum";
import { campaignStarterConfigs } from "../campaign-starter/db";
import type {
  CampaignStatsGetRequestOutput,
  CampaignStatsGetResponseOutput,
} from "./definition";
import type { CampaignStatsT } from "./i18n";

function truncate(str: string, maxLen: number): string {
  return str.length <= maxLen ? str : `${str.slice(0, maxLen - 3)}...`;
}

function summariseResult(
  result: Record<string, WidgetData> | null,
): string | null {
  if (!result) {
    return null;
  }
  const entries = Object.entries(result);
  if (entries.length === 0) {
    return null;
  }
  return truncate(
    entries
      .slice(0, 4)
      .map(([k, v]) => `${k}:${String(v)}`)
      .join(", "),
    80,
  );
}

export class CampaignStatsRepository {
  static async getStats(
    data: CampaignStatsGetRequestOutput,
    logger: EndpointLogger,
    t: CampaignStatsT,
  ): Promise<ResponseType<CampaignStatsGetResponseOutput>> {
    try {
      const variantValue =
        data.journeyVariant &&
        data.journeyVariant !== EmailJourneyVariantFilter.ALL &&
        isValidEnumValue(EmailJourneyVariant, data.journeyVariant)
          ? data.journeyVariant
          : null;
      const variantFilter = variantValue
        ? eq(emailCampaigns.journeyVariant, variantValue)
        : undefined;

      // ── Aggregate overall counts in one query ───────────────────────────
      const [overall] = await db
        .select({
          total: count(),
          pending: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.PENDING} then 1 end)`,
          sent: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.SENT} then 1 end)`,
          delivered: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.DELIVERED} then 1 end)`,
          opened: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.OPENED} then 1 end)`,
          clicked: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.CLICKED} then 1 end)`,
          failed: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.FAILED} then 1 end)`,
        })
        .from(emailCampaigns)
        .where(variantFilter);

      const rawTotals = overall ?? {
        total: 0,
        pending: 0,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        failed: 0,
      };
      const totals = {
        total: Number(rawTotals.total),
        pending: Number(rawTotals.pending),
        sent: Number(rawTotals.sent),
        delivered: Number(rawTotals.delivered),
        opened: Number(rawTotals.opened),
        clicked: Number(rawTotals.clicked),
        failed: Number(rawTotals.failed),
      };

      // Sent includes delivered+opened+clicked for rate calculation denominator
      const sentBase =
        totals.sent + totals.delivered + totals.opened + totals.clicked;
      const openRate =
        sentBase > 0 ? (totals.opened + totals.clicked) / sentBase : 0;
      const clickRate = sentBase > 0 ? totals.clicked / sentBase : 0;
      const deliveryRate =
        sentBase > 0
          ? (totals.delivered + totals.opened + totals.clicked) / sentBase
          : 0;
      const failureRate = totals.total > 0 ? totals.failed / totals.total : 0;

      // ── Per-stage breakdown ─────────────────────────────────────────────
      const stageRows = await db
        .select({
          stage: emailCampaigns.stage,
          total: count(),
          sent: sql<number>`count(case when ${emailCampaigns.status} in (${MessageStatus.SENT}, ${MessageStatus.DELIVERED}, ${MessageStatus.OPENED}, ${MessageStatus.CLICKED}) then 1 end)`,
          opened: sql<number>`count(case when ${emailCampaigns.status} in (${MessageStatus.OPENED}, ${MessageStatus.CLICKED}) then 1 end)`,
          clicked: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.CLICKED} then 1 end)`,
          failed: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.FAILED} then 1 end)`,
        })
        .from(emailCampaigns)
        .where(variantFilter)
        .groupBy(emailCampaigns.stage);

      const byStage = stageRows.map((r) => ({
        stage: r.stage,
        total: Number(r.total),
        sent: Number(r.sent),
        opened: Number(r.opened),
        clicked: Number(r.clicked),
        failed: Number(r.failed),
      }));

      // ── Per-variant breakdown ───────────────────────────────────────────
      const variantRows = await db
        .select({
          variant: emailCampaigns.journeyVariant,
          total: count(),
          sent: sql<number>`count(case when ${emailCampaigns.status} in (${MessageStatus.SENT}, ${MessageStatus.DELIVERED}, ${MessageStatus.OPENED}, ${MessageStatus.CLICKED}) then 1 end)`,
          opened: sql<number>`count(case when ${emailCampaigns.status} in (${MessageStatus.OPENED}, ${MessageStatus.CLICKED}) then 1 end)`,
          clicked: sql<number>`count(case when ${emailCampaigns.status} = ${MessageStatus.CLICKED} then 1 end)`,
        })
        .from(emailCampaigns)
        .where(variantFilter)
        .groupBy(emailCampaigns.journeyVariant);

      const byJourneyVariant = variantRows.map((r) => {
        const vSentBase = Number(r.sent);
        return {
          variant: r.variant,
          total: Number(r.total),
          sent: vSentBase,
          openRate: vSentBase > 0 ? Number(r.opened) / vSentBase : 0,
          clickRate: vSentBase > 0 ? Number(r.clicked) / vSentBase : 0,
        };
      });

      // ── Lead identity counts ─────────────────────────────────────────────
      // Total leads (raw row count)
      const [totalLeadsRow] = await db.select({ count: count() }).from(leads);
      const totalLeads = Number(totalLeadsRow?.count ?? 0);

      // Linked leads: unique lead IDs that appear in any link (either side)
      const linkedLeadsResult = await db.execute(
        sql`SELECT count(distinct v) as count FROM "lead_lead_links" ll, lateral unnest(array[ll.lead_id_1, ll.lead_id_2]) AS v`,
      );
      const linkedLeadsCountRow = linkedLeadsResult.rows[0] as
        | { count: number }
        | undefined;
      const linkedLeadsCount = Number(linkedLeadsCountRow?.count ?? 0);

      // Unique persons estimate: total leads minus the "secondary" leads
      // A secondary lead is one where it appears as lead_id_2 in a link
      // (lead_id_1 is the earlier/primary one by convention of linking order).
      // This is an estimate - exact deduplication would require graph traversal.
      const [secondaryLeadsRow] = await db
        .select({ count: sql<number>`count(distinct lead_id_2)` })
        .from(leadLeadLinks);
      const secondaryCount = Number(secondaryLeadsRow?.count ?? 0);
      const uniquePersonsEstimate = Math.max(0, totalLeads - secondaryCount);

      // ── Queue health ─────────────────────────────────────────────────────
      const [pendingLeadsRow] = await db
        .select({ count: count() })
        .from(leads)
        .where(eq(leads.status, LeadStatus.CAMPAIGN_RUNNING));

      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);

      const [scheduledTodayRow] = await db
        .select({ count: count() })
        .from(emailCampaigns)
        .where(
          and(
            gte(emailCampaigns.scheduledAt, todayStart),
            lt(emailCampaigns.scheduledAt, tomorrowStart),
          ),
        );

      const pendingLeadsCount = pendingLeadsRow?.count ?? 0;
      const emailsScheduledToday = scheduledTodayRow?.count ?? 0;

      // ── Weekly quota progress ─────────────────────────────────────────────
      const environment =
        env.NODE_ENV === Environment.PRODUCTION
          ? Environment.PRODUCTION
          : Environment.DEVELOPMENT;

      const [starterConfig] = await db
        .select()
        .from(campaignStarterConfigs)
        .where(eq(campaignStarterConfigs.environment, environment))
        .limit(1);

      const nowUtc = new Date();
      const daysFromMonday =
        nowUtc.getUTCDay() === 0 ? 6 : nowUtc.getUTCDay() - 1;
      const startOfWeek = new Date(nowUtc);
      startOfWeek.setUTCDate(nowUtc.getUTCDate() - daysFromMonday);
      startOfWeek.setUTCHours(0, 0, 0, 0);

      const weeklyQuotaByLocale: Record<string, number> = Object.fromEntries(
        Object.entries(starterConfig?.localeConfig ?? {}).map(
          ([locale, cfg]) => [locale, cfg.leadsPerWeek],
        ),
      );

      const quotaProgress: Array<{
        locale: string;
        weeklyQuota: number;
        startedThisWeek: number;
        remaining: number;
        perRunBudget: number;
        totalRunsPerWeek: number;
        accumulator: number;
      }> = [];

      const [starterCronTask] = await db
        .select({ schedule: cronTasks.schedule })
        .from(cronTasks)
        .where(eq(cronTasks.routeId, "campaign-starter"))
        .limit(1);
      const starterSchedule = starterCronTask?.schedule ?? "*/5 * * * *";
      const frequencyMinutes = getCronFrequencyMinutes(starterSchedule, logger);
      const runsPerHour = 60 / frequencyMinutes;

      for (const localeValue of Object.values(CountryLanguageValues)) {
        const weeklyQuota = weeklyQuotaByLocale[localeValue] ?? 0;
        const localeEntry = starterConfig?.localeConfig[localeValue];
        const enabledHours = localeEntry?.enabledHours ?? { start: 0, end: 0 };
        const enabledDays = localeEntry?.enabledDays ?? [];
        const enabledHoursCount = Math.max(
          0,
          enabledHours.end - enabledHours.start,
        );
        const totalRunsPerWeek =
          runsPerHour * enabledHoursCount * enabledDays.length;
        const perRunBudget =
          totalRunsPerWeek > 0 ? Math.floor(weeklyQuota / totalRunsPerWeek) : 0;

        const languageCode = getLanguageFromLocale(localeValue);
        const [weekRow] = await db
          .select({ count: sql<number>`COUNT(*)::int` })
          .from(leads)
          .where(
            and(
              eq(leads.language, languageCode),
              gte(leads.campaignStartedAt, startOfWeek),
            ),
          );
        const startedThisWeek = Number(weekRow?.count ?? 0);
        const accumulator = starterConfig?.localeAccumulators[localeValue] ?? 0;
        quotaProgress.push({
          locale: localeValue,
          weeklyQuota,
          startedThisWeek,
          remaining: Math.max(0, weeklyQuota - startedThisWeek),
          perRunBudget,
          totalRunsPerWeek: Math.round(totalRunsPerWeek),
          accumulator,
        });
      }

      // ── Campaign cron task health ─────────────────────────────────────
      const CAMPAIGN_TASK_IDS = [
        "campaign-starter",
        "email-campaigns",
        "bounce-processor",
      ];

      const campaignTaskRows = await db
        .select()
        .from(cronTasks)
        .where(inArray(cronTasks.id, CAMPAIGN_TASK_IDS));

      const HISTORY_DEPTH = 5;
      const recentExecs =
        campaignTaskRows.length > 0
          ? await db
              .select({
                taskId: cronTaskExecutions.taskId,
                status: cronTaskExecutions.status,
                completedAt: cronTaskExecutions.completedAt,
                durationMs: cronTaskExecutions.durationMs,
                result: cronTaskExecutions.result,
                error: cronTaskExecutions.error,
                startedAt: cronTaskExecutions.startedAt,
              })
              .from(cronTaskExecutions)
              .where(inArray(cronTaskExecutions.taskId, CAMPAIGN_TASK_IDS))
              .orderBy(desc(cronTaskExecutions.startedAt))
              .limit(CAMPAIGN_TASK_IDS.length * HISTORY_DEPTH * 4)
          : [];

      const execsByTask = new Map<string, typeof recentExecs>();
      for (const exec of recentExecs) {
        const existing = execsByTask.get(exec.taskId) ?? [];
        if (existing.length < HISTORY_DEPTH) {
          existing.push(exec);
          execsByTask.set(exec.taskId, existing);
        }
      }

      const nowForStats = new Date();
      const twentyFourHoursAgo = new Date(
        nowForStats.getTime() - 24 * 60 * 60 * 1000,
      );
      const [statsResult] = await db
        .select({
          total: count(),
          failed: count(
            sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.FAILED} THEN 1 END`,
          ),
        })
        .from(cronTaskExecutions)
        .where(
          and(
            gte(cronTaskExecutions.startedAt, twentyFourHoursAgo),
            inArray(cronTaskExecutions.taskId, CAMPAIGN_TASK_IDS),
          ),
        );

      const locale = "en-GLOBAL" as CountryLanguage;
      const campaignTasks = await Promise.all(
        campaignTaskRows.map(async (task) => {
          const taskExecs = execsByTask.get(task.id) ?? [];
          const lastSuccess = taskExecs.find(
            (e) => e.status === CronTaskStatus.COMPLETED,
          );

          const recentExecutions = taskExecs.map((e) => ({
            status: e.status,
            completedAt: e.completedAt?.toISOString() ?? null,
            durationMs: e.durationMs,
            resultSnippet: e.result ? summariseResult(e.result) : null,
            errorSnippet: e.error?.message
              ? truncate(String(e.error.message), 60)
              : null,
          }));

          const serialized = CronTasksRepository.serializeTask(task, logger);
          const base = await CronTasksRepository.translateTaskFields(
            serialized,
            locale,
          );

          return {
            ...base,
            recentExecutions,
            lastResultSummary: lastSuccess
              ? summariseResult(lastSuccess.result)
              : null,
          };
        }),
      );

      const alerts = campaignTasks
        .filter(
          (ft) =>
            ft.consecutiveFailures > 0 &&
            (ft.priority === "priority.critical" ||
              ft.priority === "priority.high"),
        )
        .map((ft) => {
          const taskExecs = execsByTask.get(ft.id) ?? [];
          const lastFailed = taskExecs.find(
            (e) => e.status === CronTaskStatus.FAILED,
          );
          return {
            taskId: ft.id,
            taskName: ft.displayName,
            priority: ft.priority,
            consecutiveFailures: ft.consecutiveFailures,
            lastError: lastFailed?.error?.message
              ? truncate(String(lastFailed.error.message), 120)
              : null,
            lastFailedAt: lastFailed?.startedAt?.toISOString() ?? null,
          };
        });

      const total24h = statsResult?.total ?? 0;
      const failed24h = statsResult?.failed ?? 0;
      const successRate24h =
        total24h > 0
          ? Math.round(((total24h - failed24h) / total24h) * 1000) / 10
          : null;

      const criticalFailures = campaignTaskRows.some(
        (row) =>
          row.consecutiveFailures >= 3 && row.priority === "priority.critical",
      );
      const highFailures = campaignTaskRows.some(
        (row) =>
          row.consecutiveFailures >= 3 && row.priority === "priority.high",
      );
      const systemHealth = criticalFailures
        ? ("critical" as const)
        : highFailures || (successRate24h !== null && successRate24h < 80)
          ? ("warning" as const)
          : ("healthy" as const);

      const taskStats = {
        totalTasks: campaignTaskRows.length,
        enabledTasks: campaignTaskRows.filter((r) => r.enabled).length,
        disabledTasks: campaignTaskRows.filter((r) => !r.enabled).length,
        successRate24h,
        failedTasks24h: Number(failed24h),
        systemHealth,
      };

      logger.debug("Campaign stats retrieved", {
        total: totals.total,
        openRate,
        clickRate,
        pendingLeadsCount,
        emailsScheduledToday,
      });

      return success({
        total: totals.total,
        pending: totals.pending,
        sent: totals.sent,
        delivered: totals.delivered,
        opened: totals.opened,
        clicked: totals.clicked,
        failed: totals.failed,
        openRate,
        clickRate,
        deliveryRate,
        failureRate,
        totalLeads,
        linkedLeadsCount,
        uniquePersonsEstimate,
        pendingLeadsCount,
        emailsScheduledToday,
        byStage,
        byJourneyVariant,
        quotaProgress,
        campaignTasks,
        alerts,
        taskStats,
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
