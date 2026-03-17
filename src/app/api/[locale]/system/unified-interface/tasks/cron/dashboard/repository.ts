/**
 * Cron Task Dashboard Repository
 * Combines tasks + recent executions + stats into one unified response.
 */

import "server-only";

import { count, desc, eq, gte, inArray, sql } from "drizzle-orm";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronTaskStatus } from "../../enum";
import type { JsonValue } from "../../unified-runner/types";
import { cronTaskExecutions, cronTasks } from "../db";
import { serializeTask, translateTaskFields } from "../repository";
import type {
  CronDashboardRequestOutput,
  CronDashboardResponseOutput,
} from "./definition";
import type { CronDashboardT } from "./i18n";

/* eslint-disable i18next/no-literal-string */

/**
 * Truncate a string, appending "..." if over maxLen.
 */
function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) {
    return str;
  }
  return `${str.slice(0, maxLen - 3)}...`;
}

/**
 * Summarise a task result JSONB value into a short readable string.
 */
function summariseResult(
  result: Record<string, JsonValue> | null,
): string | null {
  if (!result) {
    return null;
  }
  const entries = Object.entries(result);
  if (entries.length === 0) {
    return null;
  }
  const snippet = entries
    .slice(0, 4)
    .map(([k, v]) => `${k}:${String(v)}`)
    .join(", ");
  return truncate(snippet, 80);
}

export class CronDashboardRepository {
  static async getDashboard(
    data: CronDashboardRequestOutput,
    user: JwtPayloadType,
    t: CronDashboardT,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CronDashboardResponseOutput>> {
    try {
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      const userId = !user.isPublic ? user.id : null;

      if (!userId) {
        return fail({
          message: t("errors.fetchDashboard"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      const taskLimit = data.limit ?? 20;
      const historyDepth = data.historyDepth ?? 3;

      // ── 3 parallel queries ──────────────────────────────────────────────
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const ownerFilter = isAdmin ? undefined : eq(cronTasks.userId, userId);

      const [taskRows, statsResult] = await Promise.all([
        // Query 1: Tasks
        db
          .select()
          .from(cronTasks)
          .where(ownerFilter)
          .orderBy(desc(cronTasks.updatedAt))
          .limit(taskLimit),

        // Query 2: 24h execution stats
        db
          .select({
            total: count(),
            failed: count(
              sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.FAILED} THEN 1 END`,
            ),
          })
          .from(cronTaskExecutions)
          .where(gte(cronTaskExecutions.startedAt, twentyFourHoursAgo)),
      ]);

      // Query 3: Recent executions for discovered task IDs.
      // Fetch more rows than needed and group in JS to get last N per task —
      // avoids raw SQL while still being correct regardless of execution time.
      const taskIds = taskRows.map((row) => row.id);
      const recentExecs =
        taskIds.length > 0 && historyDepth > 0
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
              .where(inArray(cronTaskExecutions.taskId, taskIds))
              .orderBy(desc(cronTaskExecutions.startedAt))
              .limit(taskIds.length * historyDepth * 10)
          : [];

      // Group executions by taskId
      const execsByTask = new Map<string, typeof recentExecs>();
      for (const exec of recentExecs) {
        const existing = execsByTask.get(exec.taskId) ?? [];
        if (existing.length < historyDepth) {
          existing.push(exec);
          execsByTask.set(exec.taskId, existing);
        }
      }

      // ── Format tasks with embedded history ──────────────────────────────
      const formattedTasks = await Promise.all(
        taskRows.map(async (task) => {
          const taskExecs = execsByTask.get(task.id) ?? [];

          const lastSuccess = taskExecs.find(
            (e) => e.status === CronTaskStatus.COMPLETED,
          );
          const lastResultSummary = lastSuccess
            ? summariseResult(lastSuccess.result ?? null)
            : null;

          const recentExecutions = taskExecs.map((e) => ({
            status: e.status,
            completedAt: e.completedAt?.toISOString() ?? null,
            durationMs: e.durationMs,
            resultSnippet: e.result ? summariseResult(e.result) : null,
            errorSnippet: e.error?.message
              ? truncate(e.error.message, 60)
              : null,
          }));

          const serialized = serializeTask(task, logger);
          const base = await translateTaskFields(serialized, locale);

          return {
            ...base,
            recentExecutions,
            lastResultSummary,
          };
        }),
      );

      // ── Build alerts (use formattedTasks for translated displayName) ────
      const alerts = formattedTasks
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
              ? truncate(lastFailed.error.message, 120)
              : null,
            lastFailedAt: lastFailed?.startedAt?.toISOString() ?? null,
          };
        });

      // ── Build stats ─────────────────────────────────────────────────────
      const totalTasks = taskRows.length;
      const enabledTasks = taskRows.filter((row) => row.enabled).length;
      const disabledTasks = totalTasks - enabledTasks;
      const total24h = statsResult[0]?.total ?? 0;
      const failed24h = statsResult[0]?.failed ?? 0;
      const successRate24h =
        total24h > 0
          ? Math.round(((total24h - failed24h) / total24h) * 1000) / 10
          : null;

      const criticalFailures = taskRows.some(
        (row) =>
          row.consecutiveFailures >= 3 && row.priority === "priority.critical",
      );
      const highFailures = taskRows.some(
        (row) =>
          row.consecutiveFailures >= 3 && row.priority === "priority.high",
      );
      const systemHealth = criticalFailures
        ? ("critical" as const)
        : highFailures || (successRate24h !== null && successRate24h < 80)
          ? ("warning" as const)
          : ("healthy" as const);

      logger.debug("[CronDashboard] Generated", {
        totalTasks,
        enabledTasks,
        alertCount: alerts.length,
        systemHealth,
      });

      return success({
        tasks: formattedTasks,
        alerts,
        stats: {
          totalTasks,
          enabledTasks,
          disabledTasks,
          successRate24h,
          failedTasks24h: failed24h,
          systemHealth,
        },
      });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[CronDashboard] Failed", { error: msg });
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: msg },
      });
    }
  }
}
