/**
 * Cron Bulk Action Repository
 * Applies a bulk action to multiple cron tasks
 */

import "server-only";

import { and, eq, inArray, or } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  cronTasks,
  dbUserIdToOwner,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import type { TaskOwner } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { scopedTranslation as executeTranslation } from "@/app/api/[locale]/system/unified-interface/tasks/execute/i18n";
import { TaskExecuteRepository } from "@/app/api/[locale]/system/unified-interface/tasks/execute/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { createTaskEmitters } from "@/app/api/[locale]/system/unified-interface/tasks/cron/emitter";

import type {
  CronBulkRequestOutput,
  CronBulkResponseOutput,
} from "./definition";
import type { CronBulkT } from "./i18n";

export class CronBulkRepository {
  static async executeBulkAction(
    data: CronBulkRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    t: CronBulkT,
    logger: EndpointLogger,
    abortSignal: AbortSignal,
  ): Promise<ResponseType<CronBulkResponseOutput>> {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    const userId = !user.isPublic ? user.id : null;

    const { ids, action } = data;

    // Resolve all requested IDs to canonical DB rows
    // Fetch rows where id OR shortId matches any of the requested IDs
    interface ResolvedRow {
      id: string;
      shortId: string;
      owner: TaskOwner;
    }
    let resolvedRows: ResolvedRow[] = [];
    try {
      const rawRows = await db
        .select({
          id: cronTasks.id,
          shortId: cronTasks.shortId,
          userId: cronTasks.userId,
        })
        .from(cronTasks)
        .where(or(inArray(cronTasks.id, ids), inArray(cronTasks.shortId, ids)));
      resolvedRows = rawRows.map((row) => ({
        id: row.id,
        shortId: row.shortId,
        owner: dbUserIdToOwner(row.userId),
      }));
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to resolve task IDs for bulk action", {
        error: parsedError.message,
        action,
        count: ids.length,
      });
      return fail({
        message: t("post.errors.fetchFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // Build lookup: requested id (canonical or shortId) → resolved row
    const rowByRequestedId = new Map<string, ResolvedRow>();
    for (const row of resolvedRows) {
      // If the requested id matches canonical id, map it
      if (ids.includes(row.id)) {
        rowByRequestedId.set(row.id, row);
      }
      // If the requested id matches shortId, map that too
      if (ids.includes(row.shortId)) {
        rowByRequestedId.set(row.shortId, row);
      }
    }

    let succeeded = 0;
    const errors: CronBulkResponseOutput["errors"] = [];

    if (action === "delete") {
      const allowedIds: string[] = [];

      for (const requestedId of ids) {
        const row = rowByRequestedId.get(requestedId);

        if (!row) {
          errors.push({ id: requestedId, message: "Task not found" });
          continue;
        }

        if (
          !isAdmin &&
          (row.owner.type === "system" ||
            (row.owner.type === "user" && row.owner.userId !== userId))
        ) {
          errors.push({
            id: requestedId,
            message: "Not authorized to delete this task",
          });
          continue;
        }

        allowedIds.push(row.id);
      }

      if (allowedIds.length > 0) {
        try {
          await db.delete(cronTasks).where(inArray(cronTasks.id, allowedIds));
          succeeded = allowedIds.length;
          logger.info("Bulk deleted cron tasks", { count: succeeded });

          // Emit task-removed per deleted task
          const { emitTaskList, emitTaskQueue } = createTaskEmitters(
            logger,
            user,
          );
          for (const deletedId of allowedIds) {
            const removedPayload = { tasks: [{ id: deletedId }] };
            emitTaskList("task-removed", removedPayload);
            emitTaskQueue("task-removed", removedPayload);
          }
        } catch (error) {
          const parsedError = parseError(error);
          logger.error("Bulk delete failed", { error: parsedError.message });
          for (const id of allowedIds) {
            errors.push({ id, message: parsedError.message });
          }
        }
      }
    } else if (action === "enable" || action === "disable") {
      const enabled = action === "enable";
      const allowedIds: string[] = [];

      for (const requestedId of ids) {
        const row = rowByRequestedId.get(requestedId);

        if (!row) {
          errors.push({ id: requestedId, message: "Task not found" });
          continue;
        }

        if (
          !isAdmin &&
          (row.owner.type === "system" ||
            (row.owner.type === "user" && row.owner.userId !== userId))
        ) {
          errors.push({
            id: requestedId,
            message: `Not authorized to ${action} this task`,
          });
          continue;
        }

        allowedIds.push(row.id);
      }

      if (allowedIds.length > 0) {
        try {
          const whereClause = isAdmin
            ? inArray(cronTasks.id, allowedIds)
            : and(
                inArray(cronTasks.id, allowedIds),
                eq(cronTasks.userId, userId as string),
              );

          await db
            .update(cronTasks)
            .set({ enabled, updatedAt: new Date() })
            .where(whereClause);
          succeeded = allowedIds.length;
          logger.info(`Bulk ${action}d cron tasks`, { count: succeeded });

          // Emit task-updated per toggled task
          const { emitTaskList, emitTaskQueue } = createTaskEmitters(
            logger,
            user,
          );
          for (const toggledId of allowedIds) {
            const updatedPayload = {
              tasks: [{ id: toggledId, enabled }],
            };
            emitTaskList("task-updated", updatedPayload);
            emitTaskQueue("task-updated", updatedPayload);
          }
        } catch (error) {
          const parsedError = parseError(error);
          logger.error(`Bulk ${action} failed`, { error: parsedError.message });
          for (const id of allowedIds) {
            errors.push({ id, message: parsedError.message });
          }
        }
      }
    } else if (action === "run") {
      const { t: executeT } = executeTranslation.scopedT(locale);

      for (const requestedId of ids) {
        const row = rowByRequestedId.get(requestedId);

        if (!row) {
          errors.push({ id: requestedId, message: "Task not found" });
          continue;
        }

        try {
          const result = await TaskExecuteRepository.executeTask(
            { taskId: row.id },
            user,
            locale,
            logger,
            executeT,
            abortSignal,
          );
          if (result.success) {
            succeeded++;
          } else {
            errors.push({ id: requestedId, message: result.message });
          }
        } catch (error) {
          const parsedError = parseError(error);
          errors.push({ id: requestedId, message: parsedError.message });
        }
      }
    }

    return success({
      succeeded,
      failed: errors.length,
      errors,
    });
  }
}
