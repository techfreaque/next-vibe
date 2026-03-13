/**
 * Cron Queue Repository
 * Returns enabled tasks sorted by nextExecutionAt ascending (queue order).
 * Defaults: enabled only, all visibility (including hidden).
 */

import "server-only";

import { and, count, eq, inArray, isNull } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { calculateNextExecutionTime } from "@/app/api/[locale]/system/unified-interface/tasks/cron-formatter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { cronTasks } from "../db";
import {
  CronTaskHiddenFilter,
  CronTaskPriority,
  TaskCategory,
  TaskCategoryDB,
  TaskOutputMode,
} from "../../enum";
import type {
  CronQueueListRequestOutput,
  CronQueueListResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

type CronTaskRow = typeof cronTasks.$inferSelect;

/**
 * Format a DB row into the queue response shape, computing nextExecutionAt.
 */
function formatQueueTask(
  task: CronTaskRow,
  logger: EndpointLogger,
): CronQueueListResponseOutput["tasks"][number] {
  const nextExecutionAt = task.enabled
    ? (calculateNextExecutionTime(
        task.schedule,
        task.timezone ?? "UTC",
        logger,
      )?.toISOString() ?? null)
    : null;

  return {
    id: task.id,
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
    priority: task.priority ?? CronTaskPriority.MEDIUM,
    timeout: task.timeout ?? null,
    retries: task.retries ?? null,
    retryDelay: task.retryDelay ?? null,
    outputMode: task.outputMode ?? TaskOutputMode.STORE_ONLY,
    lastExecutedAt: task.lastExecutedAt?.toISOString() ?? null,
    lastExecutionStatus: task.lastExecutionStatus ?? null,
    lastExecutionError: task.lastExecutionError ?? null,
    lastExecutionDuration: task.lastExecutionDuration ?? null,
    nextExecutionAt,
    executionCount: task.executionCount,
    successCount: task.successCount,
    errorCount: task.errorCount,
    averageExecutionTime: task.averageExecutionTime ?? null,
    consecutiveFailures: task.consecutiveFailures,
    userId: task.userId ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

/**
 * Translate displayName/description from scoped keys if the endpoint has translations.
 */
async function translateQueueTask(
  task: CronQueueListResponseOutput["tasks"][number],
  locale: CountryLanguage,
): Promise<CronQueueListResponseOutput["tasks"][number]> {
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

export interface ICronQueueRepository {
  getQueue(
    data: CronQueueListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronQueueListResponseOutput>>;
}

class CronQueueRepositoryImpl implements ICronQueueRepository {
  async getQueue(
    data: CronQueueListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronQueueListResponseOutput>> {
    try {
      logger.info("Fetching task queue");

      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

      const conditions = [];

      // Queue is always enabled tasks only
      conditions.push(eq(cronTasks.enabled, true));

      // User ownership: admin sees all, others see only their own
      if (!isAdmin) {
        const userId = !user.isPublic ? user.id : null;
        if (userId) {
          conditions.push(eq(cronTasks.userId, userId));
        } else {
          conditions.push(isNull(cronTasks.id));
        }
      }

      // Visibility filter — default is ALL (include hidden tasks in queue)
      if (data.hidden === CronTaskHiddenFilter.HIDDEN) {
        conditions.push(eq(cronTasks.hidden, true));
      } else if (data.hidden === CronTaskHiddenFilter.VISIBLE) {
        conditions.push(eq(cronTasks.hidden, false));
      }
      // CronTaskHiddenFilter.ALL or undefined → no filter (show everything)

      if (data.priority && data.priority.length > 0) {
        conditions.push(inArray(cronTasks.priority, data.priority));
      }

      if (data.category && data.category.length > 0) {
        conditions.push(inArray(cronTasks.category, data.category));
      }

      const limit = data.limit ? parseInt(data.limit, 10) : 200;
      const offset = data.offset ? parseInt(data.offset, 10) : 0;

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Count
      const [countRow] = await db
        .select({ total: count(cronTasks.id) })
        .from(cronTasks)
        .where(whereClause);
      const totalTasks = countRow?.total ?? 0;

      // Fetch all enabled tasks — we sort in-memory by nextExecutionAt after computing it
      // (nextExecutionAt is computed, not stored, so we can't ORDER BY in SQL)
      const rows = await db
        .select()
        .from(cronTasks)
        .where(whereClause)
        .limit(limit)
        .offset(offset);

      // Format + compute nextExecutionAt for each
      const formatted = await Promise.all(
        rows.map(async (row) => {
          const task = formatQueueTask(row, logger);
          return translateQueueTask(task, locale);
        }),
      );

      // Sort by nextExecutionAt ascending (tasks without a nextExecutionAt go last)
      const sorted = [...formatted].toSorted((a, b) => {
        if (!a.nextExecutionAt && !b.nextExecutionAt) {
          return 0;
        }
        if (!a.nextExecutionAt) {
          return 1;
        }
        if (!b.nextExecutionAt) {
          return -1;
        }
        return (
          new Date(a.nextExecutionAt).getTime() -
          new Date(b.nextExecutionAt).getTime()
        );
      });

      logger.vibe("🚀 Task queue retrieved", { count: sorted.length });
      return success({ tasks: sorted, totalTasks });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch task queue", parsedError);
      return fail({
        message: t("errors.fetchQueue"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const cronQueueRepository = new CronQueueRepositoryImpl();
