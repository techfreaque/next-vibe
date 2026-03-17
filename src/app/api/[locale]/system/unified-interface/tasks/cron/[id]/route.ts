/**
 * Individual Cron Task Route Handler
 * Handles GET, PUT, and DELETE for individual cron tasks
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { scopedTranslation as tasksScopedTranslation } from "@/app/api/[locale]/system/unified-interface/tasks/i18n";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CronTasksRepository } from "../repository";
import { endpoints } from "./definition";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ urlPathParams, user, locale, logger }) => {
      const { t: tasksT } = tasksScopedTranslation.scopedT(locale);
      return await CronTasksRepository.getTaskById(
        urlPathParams.id,
        user,
        locale,
        tasksT,
        logger,
      );
    },
  },
  [Methods.PUT]: {
    handler: async ({ data, urlPathParams, user, locale, logger }) => {
      const updates: Partial<
        Parameters<typeof CronTasksRepository.updateTask>[1]
      > = {};
      if (data.displayName !== undefined) {
        updates.displayName = data.displayName;
      }
      if (data.description !== undefined) {
        updates.description = data.description;
      }
      if (data.schedule !== undefined) {
        updates.schedule = data.schedule;
      }
      if (data.enabled !== undefined) {
        updates.enabled = data.enabled;
      }
      if (data.priority !== undefined) {
        updates.priority = data.priority;
      }
      if (data.outputMode !== undefined) {
        updates.outputMode = data.outputMode;
      }
      if (data.timeout !== undefined) {
        updates.timeout = data.timeout;
      }
      if (data.retries !== undefined) {
        updates.retries = data.retries;
      }
      if (data.retryDelay !== undefined) {
        updates.retryDelay = data.retryDelay;
      }
      if (data.hidden !== undefined) {
        updates.hidden = data.hidden;
      }
      if (data.taskInput !== undefined) {
        updates.taskInput = data.taskInput;
      }
      if (data.runOnce !== undefined) {
        updates.runOnce = data.runOnce;
      }
      if (data.targetInstance !== undefined) {
        // Only admins can set targetInstance — it controls cross-instance task routing
        const isAdmin =
          !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
        if (!isAdmin) {
          const { t: tasksT } = tasksScopedTranslation.scopedT(locale);
          return {
            success: false as const,
            message: tasksT("errors.repositoryUpdateTaskForbidden"),
            errorType: {
              errorKey: "errorTypes.forbidden" as const,
              errorCode: 403 as const,
            },
          };
        }
        updates.targetInstance = data.targetInstance;
      }
      const { t: tasksT } = tasksScopedTranslation.scopedT(locale);
      return await CronTasksRepository.updateTask(
        urlPathParams.id,
        updates,
        user,
        locale,
        tasksT,
        logger,
      );
    },
  },
  [Methods.DELETE]: {
    handler: async ({ urlPathParams, user, locale, logger }) => {
      const { t: tasksT } = tasksScopedTranslation.scopedT(locale);
      return await CronTasksRepository.deleteTask(
        urlPathParams.id,
        user,
        tasksT,
        logger,
      );
    },
  },
});
