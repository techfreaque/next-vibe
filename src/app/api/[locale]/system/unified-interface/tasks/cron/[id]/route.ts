/**
 * Individual Cron Task Route Handler
 * Handles GET, PUT, and DELETE for individual cron tasks
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { CronTasksRepository } from "../repository";
import { endpoints } from "./definition";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ urlPathParams, user, logger }) => {
      return await CronTasksRepository.getTaskById(
        urlPathParams.id,
        user,
        logger,
      );
    },
  },
  [Methods.PUT]: {
    handler: async ({ data, urlPathParams, user, logger }) => {
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
      return await CronTasksRepository.updateTask(
        urlPathParams.id,
        updates,
        user,
        logger,
      );
    },
  },
  [Methods.DELETE]: {
    handler: async ({ urlPathParams, user, logger }) => {
      return await CronTasksRepository.deleteTask(
        urlPathParams.id,
        user,
        logger,
      );
    },
  },
});
