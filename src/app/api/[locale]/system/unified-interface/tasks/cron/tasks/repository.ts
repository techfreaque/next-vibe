/**
 * Cron Tasks Repository
 * Data access layer for cron tasks listing and management functionality
 */

import "server-only";

import { and, count, desc, eq, inArray, isNull } from "drizzle-orm";
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
import { getFullPath } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import { calculateNextExecutionTime } from "@/app/api/[locale]/system/unified-interface/tasks/cron-formatter";
import type { NotificationTarget } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { cronTasks } from "../../cron/db";
import {
  CronTaskEnabledFilter,
  CronTaskHiddenFilter,
  CronTaskPriority,
  TaskCategory,
  TaskCategoryDB,
  TaskOutputMode,
} from "../../enum";
import type {
  CronTaskCreateRequestOutput,
  CronTaskCreateResponseOutput,
  CronTaskListRequestOutput,
  CronTaskListResponseOutput,
  CronTaskResponseType,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

/**
 * Database error message pattern for unique constraint violations
 */
const UNIQUE_CONSTRAINT_ERROR = "unique constraint";

/**
 * Translate task displayName and description using the endpoint's scoped translation.
 * System tasks store scoped translation keys (e.g. "taskSync.name") as displayName/description.
 * Falls back to the raw DB value if the endpoint can't be resolved or translation fails.
 */
async function translateTaskFields(
  task: CronTaskResponseType,
  locale: CountryLanguage,
): Promise<CronTaskResponseType> {
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
 * Format task response with DB fields
 */
function formatTaskResponse(
  task: typeof cronTasks.$inferSelect,
  logger: EndpointLogger,
): CronTaskResponseType {
  const nextExecutionAt = task.enabled
    ? (calculateNextExecutionTime(
        task.schedule,
        task.timezone ?? "UTC",
        logger,
      )?.toISOString() ?? null)
    : null;

  const formatted: CronTaskResponseType = {
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
    lastExecutionError: task.lastExecutionError ?? null,
    lastExecutionDuration: task.lastExecutionDuration ?? null,
    nextExecutionAt,
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
  return formatted;
}

/**
 * Cron Tasks Repository Interface
 */
export interface ICronTasksListRepository {
  getTasks(
    data: CronTaskListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskListResponseOutput>>;

  createTask(
    data: CronTaskCreateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskCreateResponseOutput>>;
}

/**
 * Cron Tasks Repository Implementation
 */
class CronTasksListRepositoryImpl implements ICronTasksListRepository {
  async getTasks(
    data: CronTaskListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskListResponseOutput>> {
    try {
      logger.info("Starting cron tasks retrieval");

      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

      // Build query conditions
      const conditions = [];

      // Filter by user ownership: admin sees all, others see only their own tasks
      if (!isAdmin) {
        const userId = !user.isPublic ? user.id : null;
        if (userId) {
          conditions.push(eq(cronTasks.userId, userId));
        } else {
          // Public users can't see any tasks
          conditions.push(isNull(cronTasks.id));
        }
      }

      if (data.enabled === CronTaskEnabledFilter.ENABLED) {
        conditions.push(eq(cronTasks.enabled, true));
      } else if (data.enabled === CronTaskEnabledFilter.DISABLED) {
        conditions.push(eq(cronTasks.enabled, false));
      }
      // CronTaskEnabledFilter.ALL or undefined → no filter

      // Default: show only visible (non-hidden) tasks; admin can request hidden or all
      if (data.hidden === CronTaskHiddenFilter.HIDDEN) {
        conditions.push(eq(cronTasks.hidden, true));
      } else if (!data.hidden || data.hidden === CronTaskHiddenFilter.VISIBLE) {
        conditions.push(eq(cronTasks.hidden, false));
      }
      // CronTaskHiddenFilter.ALL → no filter (show everything)

      // status filter maps to lastExecutionStatus
      if (data.status && data.status.length > 0) {
        conditions.push(inArray(cronTasks.lastExecutionStatus, data.status));
      }

      if (data.priority && data.priority.length > 0) {
        conditions.push(inArray(cronTasks.priority, data.priority));
      }

      if (data.category && data.category.length > 0) {
        conditions.push(inArray(cronTasks.category, data.category));
      }

      // Handle pagination
      const limit = data.limit ? parseInt(data.limit, 10) : 100;
      const offset = data.offset ? parseInt(data.offset, 10) : 0;

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Get total count (separate query before applying limit/offset)
      const [countRow] = await db
        .select({ total: count(cronTasks.id) })
        .from(cronTasks)
        .where(whereClause);
      const totalTasks = countRow?.total ?? 0;

      // Execute query with pagination
      const tasks = await db
        .select()
        .from(cronTasks)
        .where(whereClause)
        .orderBy(desc(cronTasks.createdAt))
        .limit(limit)
        .offset(offset);

      logger.info("Retrieved tasks from database", { count: tasks.length });

      // Format tasks with computed fields and translate displayName/description
      const formattedTasks = await Promise.all(
        tasks.map(async (task) => {
          const formatted = formatTaskResponse(task, logger);
          return translateTaskFields(formatted, locale);
        }),
      );

      const response: CronTaskListResponseOutput = {
        tasks: formattedTasks,
        totalTasks,
      };

      logger.vibe("🚀 Successfully retrieved cron tasks list");
      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to retrieve cron tasks", parsedError);

      return fail({
        message: t("errors.fetchCronTasks"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async createTask(
    data: CronTaskCreateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskCreateResponseOutput>> {
    try {
      logger.info("Starting cron task creation", { routeId: data.routeId });

      // Validate routeId points to a real endpoint
      const canonicalId = getFullPath(data.routeId) ?? data.routeId;
      const endpoint = await getEndpoint(canonicalId);
      if (!endpoint) {
        logger.warn("Endpoint not found for routeId", {
          routeId: data.routeId,
        });
        return fail({
          message: t("errors.endpointNotFound"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Validate taskInput against the endpoint's request schema
      if (
        data.taskInput &&
        Object.keys(data.taskInput).length > 0 &&
        endpoint.requestSchema
      ) {
        const parsed = endpoint.requestSchema.safeParse(data.taskInput);
        if (!parsed.success) {
          logger.warn("Task input validation failed", {
            routeId: data.routeId,
            errors: parsed.error.issues.map((i) => i.message).join(", "),
          });
          return fail({
            message: t("errors.invalidTaskInput"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      const userId = !user.isPublic ? user.id : null;
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

      // Only admins can set targetInstance — it controls cross-instance task routing
      if (data.targetInstance && !isAdmin) {
        return fail({
          message: t("errors.targetInstanceForbidden"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      // Prepare task data for insertion
      const taskData = {
        id: data.id || crypto.randomUUID(),
        routeId: data.routeId,
        displayName: data.displayName,
        description: data.description || null,
        schedule: data.schedule,
        enabled: data.enabled ?? true,
        priority: data.priority ?? CronTaskPriority.MEDIUM,
        category: data.category ?? TaskCategory.SYSTEM,
        timeout: data.timeout ?? 300000,
        retries: data.retries ?? 3,
        retryDelay: data.retryDelay ?? 5000,
        version: "1.0.0",
        taskInput: data.taskInput,
        runOnce: data.runOnce ?? false,
        targetInstance: isAdmin ? (data.targetInstance ?? null) : null,
        outputMode: data.outputMode ?? TaskOutputMode.STORE_ONLY,
        notificationTargets: [] as NotificationTarget[],
        executionCount: 0,
        successCount: 0,
        errorCount: 0,
        userId,
      };

      logger.debug("Inserting task into database", {
        routeId: taskData.routeId,
        displayName: taskData.displayName,
      });

      // Insert the task into the database
      const [createdTask] = await db
        .insert(cronTasks)
        .values(taskData)
        .returning();

      if (!createdTask) {
        logger.error("Failed to create task - no task returned");
        return fail({
          message: t("errors.createCronTask"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info("Task created successfully", {
        id: createdTask.id,
        routeId: createdTask.routeId,
      });

      // Format the response with translated fields
      const formatted = formatTaskResponse(createdTask, logger);
      const response: CronTaskCreateResponseOutput = {
        task: await translateTaskFields(formatted, locale),
      };

      logger.vibe("🚀 Successfully created cron task");
      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron task", parsedError);

      // Check for unique constraint violation (system tasks with same routeId)
      if (parsedError.message?.includes(UNIQUE_CONSTRAINT_ERROR)) {
        return fail({
          message: t("errors.createCronTask"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      return fail({
        message: t("errors.createCronTask"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const cronTasksListRepository = new CronTasksListRepositoryImpl();
