/**
 * Individual Cron Task Route Handler
 * Handles GET, PUT, DELETE for individual cron tasks
 */

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import { CronTasksRepository } from "../repository";
import { endpoints } from "./definition";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, locale, logger }) =>
      CronTasksRepository.getTaskById(urlPathParams.id, user, locale, logger),
  },
  [Methods.PUT]: {
    handler: ({ data, urlPathParams, user, locale, logger }) =>
      CronTasksRepository.patchTask(
        urlPathParams.id,
        data,
        user,
        locale,
        logger,
      ),
  },
  [Methods.DELETE]: {
    handler: ({ urlPathParams, user, locale, logger }) =>
      CronTasksRepository.deleteTask(urlPathParams.id, user, locale, logger),
  },
});
