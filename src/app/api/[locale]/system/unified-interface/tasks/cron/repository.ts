/**
 * Cron Tasks Repository
 * Database operations for cron task management
 * Following interface + implementation pattern
 */

import { and, count, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type {
  RecentExecution,
  TaskSummaryItem,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks-formatter";
import { formatTasksSummary } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks-formatter";
import { calculateNextExecutionTime } from "@/app/api/[locale]/system/unified-interface/tasks/cron-formatter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronTaskStatus, TaskCategory, TaskCategoryDB } from "../enum";
import type { scopedTranslation } from "../i18n";
import type { JsonValue } from "../unified-runner/types";
import type {
  CronTaskExecution,
  CronTaskRow,
  NewCronTask,
  NewCronTaskExecution,
} from "./db";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];
import { cronTaskExecutions, cronTasks } from "./db";
import type { CronTaskResponseType as CronTaskResponse } from "./tasks/definition";

export type { CronTaskResponse };

/**
 * Translate task displayName and description using the endpoint's scoped translation.
 * System tasks store scoped translation keys (e.g. "taskSync.name") as displayName/description.
 * Falls back to the raw DB value if the endpoint can't be resolved or translation fails.
 */
export async function translateTaskFields(
  task: CronTaskResponse,
  locale: CountryLanguage,
): Promise<CronTaskResponse> {
  const endpoint = await getEndpoint(task.routeId);
  if (!endpoint) {
    return task;
  }

  const { t } = endpoint.scopedTranslation.scopedT(locale);
  const translatedName = t(task.displayName as Parameters<typeof t>[0]);
  const translatedDesc = task.description
    ? t(task.description as Parameters<typeof t>[0])
    : null;

  return {
    ...task,
    displayName:
      translatedName !== task.displayName ? translatedName : task.displayName,
    description:
      translatedDesc && translatedDesc !== task.description
        ? translatedDesc
        : task.description,
  };
}

/**
 * Fetch the last execution's error/result summary for a batch of tasks.
 * Returns a Map<taskId, errorOrSummary>.
 */
export async function fetchLastExecutionSummaries(
  taskIds: string[],
): Promise<Map<string, string | null>> {
  if (taskIds.length === 0) {
    return new Map();
  }

  // Get the latest execution per task using a lateral-style query
  const rows = await db
    .select({
      taskId: cronTaskExecutions.taskId,
      status: cronTaskExecutions.status,
      error: cronTaskExecutions.error,
      result: cronTaskExecutions.result,
    })
    .from(cronTaskExecutions)
    .where(inArray(cronTaskExecutions.taskId, taskIds))
    .orderBy(desc(cronTaskExecutions.startedAt))
    .limit(taskIds.length * 2); // grab a few extras to ensure coverage

  const map = new Map<string, string | null>();
  for (const row of rows) {
    if (map.has(row.taskId)) {
      continue;
    } // first = latest
    if (row.status === CronTaskStatus.FAILED && row.error?.message) {
      map.set(row.taskId, row.error.message);
    } else if (row.result) {
      const entries = Object.entries(row.result);
      if (entries.length > 0) {
        const snippet = entries
          .slice(0, 4)
          .map(([k, v]) => `${k}:${String(v)}`)
          .join(", ");
        map.set(
          row.taskId,
          snippet.length > 120 ? `${snippet.slice(0, 117)}...` : snippet,
        );
      } else {
        map.set(row.taskId, null);
      }
    } else {
      map.set(row.taskId, null);
    }
  }
  return map;
}

export function serializeTask(
  task: CronTaskRow,
  logger: EndpointLogger,
): CronTaskResponse {
  return {
    id: task.id,
    shortId: task.shortId,
    routeId: task.routeId,
    displayName: task.displayName,
    description: task.description ?? null,
    version: task.version,
    category: (TaskCategoryDB as readonly string[]).includes(task.category)
      ? task.category
      : TaskCategory.SYSTEM,
    schedule: task.schedule,
    timezone: task.timezone ?? null,
    enabled: task.enabled,
    hidden: task.hidden,
    priority: task.priority,
    timeout: task.timeout ?? null,
    retries: task.retries ?? null,
    retryDelay: task.retryDelay ?? null,
    taskInput: task.taskInput,
    runOnce: task.runOnce,
    outputMode: task.outputMode,
    notificationTargets: task.notificationTargets,
    lastExecutedAt: task.lastExecutedAt?.toISOString() ?? null,
    lastExecutionStatus: task.lastExecutionStatus ?? null,
    lastExecutionError: null, // populated by caller from execution history
    lastExecutionDuration: task.lastExecutionDuration ?? null,
    nextExecutionAt: task.enabled
      ? (calculateNextExecutionTime(
          task.schedule,
          task.timezone ?? "UTC",
          logger,
        )?.toISOString() ?? null)
      : null,
    executionCount: task.executionCount,
    successCount: task.successCount,
    errorCount: task.errorCount,
    averageExecutionTime: task.averageExecutionTime ?? null,
    consecutiveFailures: task.consecutiveFailures,
    targetInstance: task.targetInstance ?? null,
    tags: task.tags,
    userId: task.userId ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

/**
 * Implementation of Cron Tasks Repository
 */
export class CronTasksRepository {
  static async getAllTasks(
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskRow[]>> {
    try {
      logger.debug("Fetching all cron tasks");
      const tasks = await db
        .select()
        .from(cronTasks)
        .orderBy(desc(cronTasks.createdAt));
      logger.info(`Successfully fetched ${tasks.length} cron tasks`);
      return success(tasks as CronTaskRow[]);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron tasks", {
        error: parsedError.message,
      });
      return fail({
        message: t("errors.fetchCronTasks"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { message: parsedError.message },
      });
    }
  }

  static async getTaskById(
    id: string,
    user: JwtPayloadType,
    locale: CountryLanguage,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ task: CronTaskResponse }>> {
    try {
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      const userId = !user.isPublic ? user.id : null;

      const tasks = await db
        .select()
        .from(cronTasks)
        .where(or(eq(cronTasks.id, id), eq(cronTasks.shortId, id)))
        .limit(1);
      const task = tasks[0];

      if (!task) {
        return fail({
          message: t("errors.repositoryNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { taskId: id },
        });
      }

      // Non-admins can only access their own tasks
      if (!isAdmin && task.userId !== userId) {
        return fail({
          message: t("errors.repositoryGetTaskForbidden"),
          errorType: ErrorResponseTypes.FORBIDDEN,
          messageParams: { taskId: id },
        });
      }

      const serialized = serializeTask(task, logger);
      const summaries = await fetchLastExecutionSummaries([task.id]);
      serialized.lastExecutionError = summaries.get(task.id) ?? null;
      return success({
        task: await translateTaskFields(serialized, locale),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron task by ID", {
        id,
        error: parsedError.message,
      });
      return fail({
        message: t("errors.fetchCronTasks"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { message: parsedError.message },
      });
    }
  }

  /** Find a system task (userId IS NULL) by its routeId */
  static async getSystemTaskByRouteId(
    routeId: string,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskRow | null>> {
    try {
      const task = await db
        .select()
        .from(cronTasks)
        .where(
          sql`${cronTasks.routeId} = ${routeId} AND ${cronTasks.userId} IS NULL`,
        )
        .limit(1);
      const result: CronTaskRow | null = (task[0] as CronTaskRow) || null;
      return success<CronTaskRow | null>(result);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch system task by routeId", {
        routeId,
        error: parsedError.message,
      });
      return fail({
        message: t("errors.fetchCronTasks"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { message: parsedError.message },
      });
    }
  }

  /** Get all system tasks (userId IS NULL) — for startup sync */
  static async getAllSystemTasks(
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskRow[]>> {
    try {
      const tasks = await db
        .select()
        .from(cronTasks)
        .where(isNull(cronTasks.userId));
      return success(tasks as CronTaskRow[]);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch system tasks", {
        error: parsedError.message,
      });
      return fail({
        message: t("errors.fetchCronTasks"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { message: parsedError.message },
      });
    }
  }

  static async createTask(
    task: NewCronTask,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskRow>> {
    try {
      logger.debug("Creating new cron task", { routeId: task.routeId });
      const [newTask] = await db.insert(cronTasks).values(task).returning();
      logger.info("Successfully created cron task", {
        id: newTask.id,
        routeId: newTask.routeId,
      });
      return success(newTask as CronTaskRow);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron task", {
        routeId: task.routeId,
        error: parsedError.message,
      });
      return fail({
        message: t("errors.createCronTask"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { message: parsedError.message },
      });
    }
  }

  static async updateTask(
    id: string,
    updates: Partial<CronTaskRow>,
    user: JwtPayloadType | null,
    locale: CountryLanguage,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ task: CronTaskResponse; success: boolean }>> {
    try {
      // null user = internal system call (e.g. task runner) — skip ownership check.
      // For non-null users, ownership is enforced atomically inside the UPDATE WHERE
      // clause to avoid a TOCTOU race between the read and the write.
      const isAdmin =
        user !== null && !user.isPublic
          ? user.roles.includes(UserPermissionRole.ADMIN)
          : false;
      const userId = user !== null && !user.isPublic ? user.id : null;

      logger.debug(
        `Updating task "${id}" (${Object.keys(updates).join(", ")})`,
      );

      // Resolve shortId → canonical id so the WHERE clause uses the primary key.
      const [resolved] = await db
        .select({ id: cronTasks.id })
        .from(cronTasks)
        .where(or(eq(cronTasks.id, id), eq(cronTasks.shortId, id)))
        .limit(1);
      const canonicalId = resolved?.id ?? id;

      // Build the WHERE clause:
      // - system calls (user=null): match only on id
      // - admin users: match only on id (can edit any task)
      // - regular users: match on id AND userId (own tasks only)
      const whereClause =
        user === null || isAdmin
          ? eq(cronTasks.id, canonicalId)
          : and(
              eq(cronTasks.id, canonicalId),
              eq(cronTasks.userId, userId as string),
            );

      const [task] = await db
        .update(cronTasks)
        .set({ ...updates, updatedAt: new Date() })
        .where(whereClause)
        .returning();

      if (!task) {
        // Either the task doesn't exist or the user doesn't own it.
        // Distinguish by checking existence without ownership constraint.
        const [exists] = await db
          .select({ id: cronTasks.id })
          .from(cronTasks)
          .where(eq(cronTasks.id, canonicalId))
          .limit(1);

        if (!exists) {
          return fail({
            message: t("errors.repositoryNotFound"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        return fail({
          message: t("errors.repositoryUpdateTaskForbidden"),
          errorType: ErrorResponseTypes.FORBIDDEN,
          messageParams: { taskId: id },
        });
      }

      const serialized = serializeTask(task, logger);
      const summaries = await fetchLastExecutionSummaries([task.id]);
      serialized.lastExecutionError = summaries.get(task.id) ?? null;
      return success({
        task: await translateTaskFields(serialized, locale),
        success: true,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update cron task", {
        id,
        error: parsedError.message,
      });
      return fail({
        message: t("common.cronRepositoryTaskUpdateFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId: id },
      });
    }
  }

  static async deleteTask(
    id: string,
    user: JwtPayloadType,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean; message: string }>> {
    try {
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      const userId = !user.isPublic ? user.id : null;

      // Resolve shortId → canonical id, and check ownership
      const existing = await db
        .select({ id: cronTasks.id, userId: cronTasks.userId })
        .from(cronTasks)
        .where(or(eq(cronTasks.id, id), eq(cronTasks.shortId, id)))
        .limit(1);

      if (!existing[0]) {
        return fail({
          message: t("errors.repositoryNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const canonicalId = existing[0].id;

      if (!isAdmin && existing[0].userId !== userId) {
        return fail({
          message: t("errors.repositoryDeleteTaskForbidden"),
          errorType: ErrorResponseTypes.FORBIDDEN,
          messageParams: { taskId: id },
        });
      }

      logger.debug("Deleting cron task", { id: canonicalId });
      await db.delete(cronTasks).where(eq(cronTasks.id, canonicalId));
      logger.info("Successfully deleted cron task", { id });
      return success({ success: true, message: "Task deleted successfully" });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to delete cron task", {
        id,
        error: parsedError.message,
      });
      return fail({
        message: t("common.cronRepositoryTaskDeleteFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId: id },
      });
    }
  }

  static async createExecution(
    execution: NewCronTaskExecution,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution>> {
    try {
      logger.debug(`Creating execution for task "${execution.taskId}"`);
      const [newExecution] = await db
        .insert(cronTaskExecutions)
        .values(execution)
        .returning();
      return success(newExecution as CronTaskExecution);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron execution", {
        taskId: execution.taskId,
        error: parsedError.message,
      });
      return fail({
        message: t("common.cronRepositoryExecutionCreateFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId: execution.taskId },
      });
    }
  }

  static async updateExecution(
    id: string,
    updates: Partial<CronTaskExecution>,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution>> {
    try {
      logger.debug(
        `Updating execution "${id}" (${Object.keys(updates).join(", ")})`,
      );
      const [updatedExecution] = await db
        .update(cronTaskExecutions)
        .set(updates)
        .where(eq(cronTaskExecutions.id, id))
        .returning();

      if (!updatedExecution) {
        return fail({
          message: t("errors.repositoryNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(updatedExecution as CronTaskExecution);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update cron execution", {
        id,
        error: parsedError.message,
      });
      return fail({
        message: t("common.cronRepositoryExecutionUpdateFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, executionId: id },
      });
    }
  }

  static async getExecutionsByTaskId(
    taskId: string,
    limit = 50,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution[]>> {
    try {
      logger.debug("Fetching executions by task ID", { taskId, limit });
      const executions = await db
        .select()
        .from(cronTaskExecutions)
        .where(eq(cronTaskExecutions.taskId, taskId))
        .orderBy(desc(cronTaskExecutions.startedAt))
        .limit(limit);

      return success(executions as CronTaskExecution[]);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron executions by task ID", {
        taskId,
        limit,
        error: parsedError.message,
      });
      return fail({
        message: t("common.cronRepositoryExecutionsFetchFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId, limit },
      });
    }
  }

  static async getRecentExecutions(
    limit = 100,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution[]>> {
    try {
      logger.debug("Fetching recent executions", { limit });
      const executions = await db
        .select()
        .from(cronTaskExecutions)
        .orderBy(desc(cronTaskExecutions.startedAt))
        .limit(limit);

      return success(executions as CronTaskExecution[]);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch recent cron executions", {
        limit,
        error: parsedError.message,
      });
      return fail({
        message: t("common.cronRepositoryRecentExecutionsFetchFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, limit },
      });
    }
  }

  static async getTaskStatistics(
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      totalTasks: number;
      enabledTasks: number;
      disabledTasks: number;
      averageExecutionTime: number | null;
    }>
  > {
    try {
      logger.debug("Fetching task statistics");
      const [stats] = await db
        .select({
          totalTasks: count(cronTasks.id),
          enabledTasks: sql<number>`count(case when ${cronTasks.enabled} = true then 1 end)::int`,
          disabledTasks: sql<number>`count(case when ${cronTasks.enabled} = false then 1 end)::int`,
          averageExecutionTime: sql<number>`avg(${cronTasks.averageExecutionTime})::int`,
        })
        .from(cronTasks);

      return success({
        totalTasks: stats.totalTasks,
        enabledTasks: stats.enabledTasks,
        disabledTasks: stats.disabledTasks,
        averageExecutionTime: stats.averageExecutionTime ?? null,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch task statistics", {
        error: parsedError.message,
      });
      return fail({
        message: t("common.cronRepositoryStatisticsFetchFailed"),
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}

/**
 * Truncate a string to maxLen, adding "..." if truncated.
 */
function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) {
    return str;
  }
  return `${str.slice(0, maxLen - 3)}...`;
}

/**
 * Summarise a task result JSONB value into a short human-readable string.
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
  // Compact key:value pairs
  const snippet = entries
    .slice(0, 4)
    .map(([k, v]) => `${k}:${String(v)}`)
    .join(", ");
  return truncate(snippet, 80);
}

/**
 * Generate a concise tasks summary for injection into the AI system prompt.
 * Returns an empty string if the user has no tasks.
 *
 * Loads task definitions + recent execution history for enriched formatting.
 */
/**
 * Load raw task summary items for system prompt injection.
 * Returns typed data — formatting is handled by formatTasksSummary() in tasks-formatter.ts.
 */
export async function loadTaskItems(params: {
  userId: string;
  logger: EndpointLogger;
}): Promise<TaskSummaryItem[]> {
  const { userId, logger } = params;

  try {
    // Query 1: Task definitions with enriched fields
    const { getLocalInstanceId } =
      await import("@/app/api/[locale]/user/remote-connection/repository");
    const instanceId = await getLocalInstanceId(userId);

    const tasks = await db
      .select({
        id: cronTasks.id,
        shortId: cronTasks.shortId,
        displayName: cronTasks.displayName,
        schedule: cronTasks.schedule,
        enabled: cronTasks.enabled,
        lastExecutionStatus: cronTasks.lastExecutionStatus,
        lastExecutedAt: cronTasks.lastExecutedAt,
        lastExecutionDuration: cronTasks.lastExecutionDuration,
        errorCount: cronTasks.errorCount,
        routeId: cronTasks.routeId,
        description: cronTasks.description,
        priority: cronTasks.priority,
        consecutiveFailures: cronTasks.consecutiveFailures,
      })
      .from(cronTasks)
      .where(
        and(
          // Never show hidden tasks to AI
          eq(cronTasks.hidden, false),
          // Include user's own tasks + tasks targeting this instance (e.g. delegated from prod)
          instanceId
            ? or(
                eq(cronTasks.userId, userId),
                eq(cronTasks.targetInstance, instanceId),
              )
            : eq(cronTasks.userId, userId),
        ),
      )
      .orderBy(desc(cronTasks.updatedAt))
      .limit(50);

    if (tasks.length === 0) {
      return [];
    }

    // Query 2: Recent executions for all discovered tasks (last 3 per task)
    const taskIds = tasks.map((t) => t.id);
    const recentExecs =
      taskIds.length > 0
        ? await db
            .select({
              taskId: cronTaskExecutions.taskId,
              status: cronTaskExecutions.status,
              completedAt: cronTaskExecutions.completedAt,
              durationMs: cronTaskExecutions.durationMs,
              result: cronTaskExecutions.result,
              error: cronTaskExecutions.error,
            })
            .from(cronTaskExecutions)
            .where(inArray(cronTaskExecutions.taskId, taskIds))
            .orderBy(desc(cronTaskExecutions.startedAt))
            .limit(taskIds.length * 3)
        : [];

    // Group executions by taskId (max 3 per task)
    const execsByTask = new Map<string, typeof recentExecs>();
    for (const exec of recentExecs) {
      const existing = execsByTask.get(exec.taskId) ?? [];
      if (existing.length < 3) {
        existing.push(exec);
        execsByTask.set(exec.taskId, existing);
      }
    }

    // Shape into TaskSummaryItem[] with enriched fields
    const summaryItems = tasks.map((t) => {
      const taskExecs = execsByTask.get(t.id) ?? [];

      // Find last successful result for summary
      const lastSuccess = taskExecs.find(
        (e) => e.status === CronTaskStatus.COMPLETED,
      );
      const lastResultSummary = lastSuccess
        ? summariseResult(lastSuccess.result ?? null)
        : null;

      // Map recent executions
      const recentExecutions: RecentExecution[] = taskExecs.map((e) => ({
        status: e.status,
        completedAt: e.completedAt?.toISOString() ?? null,
        durationMs: e.durationMs,
        resultSnippet: e.result ? summariseResult(e.result) : null,
        errorSnippet: e.error?.message ? truncate(e.error.message, 60) : null,
      }));

      return {
        id: t.id,
        shortId: t.shortId,
        displayName: t.displayName,
        description: t.description,
        schedule: t.schedule,
        enabled: t.enabled,
        lastExecutionStatus: t.lastExecutionStatus,
        lastExecutedAt: t.lastExecutedAt,
        lastExecutionDuration: t.lastExecutionDuration,
        errorCount: t.errorCount,
        routeId: t.routeId,
        priority: t.priority,
        consecutiveFailures: t.consecutiveFailures,
        lastResultSummary,
        recentExecutions: recentExecutions.length > 0 ? recentExecutions : null,
      };
    });

    logger.debug("Loaded task items for system prompt", {
      userId,
      taskCount: tasks.length,
      execsLoaded: recentExecs.length,
    });

    return summaryItems;
  } catch (error) {
    logger.error("Failed to load task items", {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Generate a concise tasks summary string for injection into the AI system prompt.
 * @deprecated Prefer loadTaskItems() + formatTasksSummary() — keeps data and formatting separate.
 */
export async function generateTasksSummary(params: {
  userId: string;
  logger: EndpointLogger;
}): Promise<string> {
  const items = await loadTaskItems(params);
  return formatTasksSummary(items);
}
