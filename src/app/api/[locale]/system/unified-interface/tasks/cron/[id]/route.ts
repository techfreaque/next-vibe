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
      return await CronTasksRepository.updateTask(
        urlPathParams.id,
        data,
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
