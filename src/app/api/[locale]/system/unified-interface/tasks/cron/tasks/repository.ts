/**
 * Cron Tasks Repository
 * Data access layer for cron tasks listing and management functionality
 */

import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNull,
  or,
} from "drizzle-orm";
import { nanoid } from "nanoid";
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
import { CronTasksRepository } from "../../cron/repository";
import {
  CronTaskEnabledFilter,
  CronTaskHiddenFilter,
  CronTaskPriority,
  CronTaskStatus,
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
import type { CronTasksT } from "./i18n";

/**
 * Cron Tasks Repository Implementation
 */
export class CronTasksListRepository {
  /**
   * Database error message pattern for unique constraint violations
   */
  private static readonly UNIQUE_CONSTRAINT_ERROR = "unique constraint";

  /**
   * Translate task displayName and description using the endpoint's scoped translation.
   * System tasks store scoped translation keys (e.g. "taskSync.name") as displayName/description.
   * Falls back to the raw DB value if the endpoint can't be resolved or translation fails.
   */
  private static async translateTaskFields(
    task: CronTaskResponseType,
    locale: CountryLanguage,
  ): Promise<CronTaskResponseType> {
    const endpoint = await getEndpoint(task.routeId);
    if (!endpoint) {
      return task;
    }

    const { t } = endpoint.scopedTranslation.scopedT(locale);
    const translatedName = t(task.displayName);
    const translatedDesc = task.description ? t(task.description) : null;

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
  private static formatTaskResponse(
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

  static async getTasks(
    data: CronTaskListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    t: CronTasksT,
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

      // Server-side search filter - applied after base filters, not counted in status counts
      const searchTerm = data.search?.trim();
      const searchCondition = searchTerm
        ? or(
            ilike(cronTasks.displayName, `%${searchTerm}%`),
            ilike(cronTasks.routeId, `%${searchTerm}%`),
            ilike(cronTasks.description, `%${searchTerm}%`),
            ilike(cronTasks.category, `%${searchTerm}%`),
          )
        : undefined;

      const fullWhereClause =
        whereClause && searchCondition
          ? and(whereClause, searchCondition)
          : (searchCondition ?? whereClause);

      // Get total count (separate query before applying limit/offset)
      const [countRow] = await db
        .select({ total: count(cronTasks.id) })
        .from(cronTasks)
        .where(fullWhereClause);
      const totalTasks = countRow?.total ?? 0;

      // Re-derive base conditions without status for counting all statuses
      const countConditions = [];
      if (!isAdmin) {
        const userId = !user.isPublic ? user.id : null;
        if (userId) {
          countConditions.push(eq(cronTasks.userId, userId));
        } else {
          countConditions.push(isNull(cronTasks.id));
        }
      }
      if (data.hidden === CronTaskHiddenFilter.HIDDEN) {
        countConditions.push(eq(cronTasks.hidden, true));
      } else if (!data.hidden || data.hidden === CronTaskHiddenFilter.VISIBLE) {
        countConditions.push(eq(cronTasks.hidden, false));
      }
      if (data.priority && data.priority.length > 0) {
        countConditions.push(inArray(cronTasks.priority, data.priority));
      }
      if (data.category && data.category.length > 0) {
        countConditions.push(inArray(cronTasks.category, data.category));
      }
      const countBaseWhere =
        countConditions.length > 0 ? and(...countConditions) : undefined;

      const makeStatusWhere = (
        statusCond: Parameters<typeof and>[0],
      ): Parameters<typeof and>[0][] =>
        countBaseWhere ? [countBaseWhere, statusCond] : [statusCond];

      const [
        countAll,
        countRunning,
        countCompleted,
        countFailed,
        countPending,
        countDisabled,
      ] = await Promise.all([
        db
          .select({ n: count(cronTasks.id) })
          .from(cronTasks)
          .where(countBaseWhere)
          .then(([r]) => r?.n ?? 0),
        db
          .select({ n: count(cronTasks.id) })
          .from(cronTasks)
          .where(
            and(
              ...makeStatusWhere(
                eq(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING),
              ),
            ),
          )
          .then(([r]) => r?.n ?? 0),
        db
          .select({ n: count(cronTasks.id) })
          .from(cronTasks)
          .where(
            and(
              ...makeStatusWhere(
                eq(cronTasks.lastExecutionStatus, CronTaskStatus.COMPLETED),
              ),
            ),
          )
          .then(([r]) => r?.n ?? 0),
        db
          .select({ n: count(cronTasks.id) })
          .from(cronTasks)
          .where(
            and(
              ...makeStatusWhere(
                or(
                  eq(cronTasks.lastExecutionStatus, CronTaskStatus.FAILED),
                  eq(cronTasks.lastExecutionStatus, CronTaskStatus.ERROR),
                ),
              ),
            ),
          )
          .then(([r]) => r?.n ?? 0),
        db
          .select({ n: count(cronTasks.id) })
          .from(cronTasks)
          .where(
            and(
              ...makeStatusWhere(
                eq(cronTasks.lastExecutionStatus, CronTaskStatus.PENDING),
              ),
            ),
          )
          .then(([r]) => r?.n ?? 0),
        db
          .select({ n: count(cronTasks.id) })
          .from(cronTasks)
          .where(and(...makeStatusWhere(eq(cronTasks.enabled, false))))
          .then(([r]) => r?.n ?? 0),
      ]);

      const countsByStatus = {
        all: countAll,
        running: countRunning,
        completed: countCompleted,
        failed: countFailed,
        pending: countPending,
        disabled: countDisabled,
      };

      // Counts by hidden visibility - independent of the current hidden filter
      // so all 3 visibility tabs can show accurate counts simultaneously
      const baseCountConditions = [];
      if (!isAdmin) {
        const userId = !user.isPublic ? user.id : null;
        if (userId) {
          baseCountConditions.push(eq(cronTasks.userId, userId));
        } else {
          baseCountConditions.push(isNull(cronTasks.id));
        }
      }
      if (data.priority && data.priority.length > 0) {
        baseCountConditions.push(inArray(cronTasks.priority, data.priority));
      }
      if (data.category && data.category.length > 0) {
        baseCountConditions.push(inArray(cronTasks.category, data.category));
      }
      const baseCountWhere =
        baseCountConditions.length > 0
          ? and(...baseCountConditions)
          : undefined;

      const [countHiddenVisible, countHiddenHidden, countHiddenAll] =
        await Promise.all([
          db
            .select({ n: count(cronTasks.id) })
            .from(cronTasks)
            .where(
              baseCountWhere
                ? and(baseCountWhere, eq(cronTasks.hidden, false))
                : eq(cronTasks.hidden, false),
            )
            .then(([r]) => r?.n ?? 0),
          db
            .select({ n: count(cronTasks.id) })
            .from(cronTasks)
            .where(
              baseCountWhere
                ? and(baseCountWhere, eq(cronTasks.hidden, true))
                : eq(cronTasks.hidden, true),
            )
            .then(([r]) => r?.n ?? 0),
          db
            .select({ n: count(cronTasks.id) })
            .from(cronTasks)
            .where(baseCountWhere)
            .then(([r]) => r?.n ?? 0),
        ]);

      const countsByHidden = {
        visible: countHiddenVisible,
        hidden: countHiddenHidden,
        all: countHiddenAll,
      };

      // Server-side sort
      const sortOrder = ((): ReturnType<typeof asc> => {
        switch (data.sort) {
          case "name_asc":
            return asc(cronTasks.displayName);
          case "name_desc":
            return desc(cronTasks.displayName);
          case "schedule":
            return asc(cronTasks.schedule);
          case "last_run_desc":
            return desc(cronTasks.lastExecutedAt);
          case "executions_desc":
            return desc(cronTasks.executionCount);
          default:
            return asc(cronTasks.displayName);
        }
      })();

      // Execute query with pagination
      const tasks = await db
        .select()
        .from(cronTasks)
        .where(fullWhereClause)
        .orderBy(sortOrder)
        .limit(limit)
        .offset(offset);

      logger.info("Retrieved tasks from database", { count: tasks.length });

      // Batch-load last execution summaries for all tasks
      const summaries = await CronTasksRepository.fetchLastExecutionSummaries(
        tasks.map((task) => task.id),
      );

      // Format tasks with computed fields and translate displayName/description
      const formattedTasks = await Promise.all(
        tasks.map(async (task) => {
          const formatted = CronTasksListRepository.formatTaskResponse(
            task,
            logger,
          );
          formatted.lastExecutionError = summaries.get(task.id) ?? null;
          return CronTasksListRepository.translateTaskFields(formatted, locale);
        }),
      );

      const response: CronTaskListResponseOutput = {
        tasks: formattedTasks,
        totalTasks,
        countsByStatus,
        countsByHidden,
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

  static async createTask(
    data: CronTaskCreateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    t: CronTasksT,
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

      // Public (unauthenticated) users must never create tasks - tasks without
      // a userId run as the system ADMIN user, which would be a privilege escalation.
      // Auth is enforced at the route level but we guard here as a safety net.
      if (user.isPublic) {
        return fail({
          message: t("errors.createCronTask"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const userId = user.id;
      const isAdmin = user.roles.includes(UserPermissionRole.ADMIN);

      // Validate targetInstance - everyone can set it, but only to instances
      // they own (i.e. have an active remote connection for). This prevents
      // a customer from routing tasks to another user's instance, which would
      // execute as ADMIN on the remote (synced tasks have no userId locally).
      let resolvedTargetInstance: string | null = null;
      if (data.targetInstance) {
        if (isAdmin) {
          resolvedTargetInstance = data.targetInstance;
        } else {
          const { RemoteConnectionRepository } =
            await import("@/app/api/[locale]/user/remote-connection/repository");
          const conn =
            await RemoteConnectionRepository.getConnectionForInstance(
              userId,
              data.targetInstance,
            );
          if (!conn) {
            return fail({
              message: t("errors.targetInstanceForbidden"),
              errorType: ErrorResponseTypes.FORBIDDEN,
            });
          }
          // Use the canonical remoteInstanceId so task-sync routes it correctly.
          resolvedTargetInstance = conn.remoteInstanceId ?? data.targetInstance;
        }
      }

      // Prepare task data for insertion
      const fullId = data.id || crypto.randomUUID();
      // shortId: caller-provided ids (system slugs) are already short - mirror them.
      // Generated UUIDs get a compact nanoid(8) scoped per user.
      const shortId = data.id ? data.id : nanoid(8);
      const taskData = {
        id: fullId,
        shortId,
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
        hidden: data.hidden ?? false,
        version: "1.0.0",
        taskInput: data.taskInput,
        runOnce: data.runOnce ?? false,
        targetInstance: resolvedTargetInstance,
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
      const formatted = CronTasksListRepository.formatTaskResponse(
        createdTask,
        logger,
      );
      const response: CronTaskCreateResponseOutput = {
        task: await CronTasksListRepository.translateTaskFields(
          formatted,
          locale,
        ),
      };

      logger.vibe("🚀 Successfully created cron task");
      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron task", parsedError);

      // Check for unique constraint violation (system tasks with same routeId)
      if (
        parsedError.message?.includes(
          CronTasksListRepository.UNIQUE_CONSTRAINT_ERROR,
        )
      ) {
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
