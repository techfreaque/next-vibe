/**
 * Cron Tasks List API Route Handlers
 * Handles GET and POST requests for listing and creating cron tasks
 */

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import { endpoints } from "./definition";
import { CronTasksListRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ data, user, locale, t, logger }) =>
      CronTasksListRepository.getTasks(data, user, locale, t, logger),
  },
  [Methods.POST]: {
    handler: async ({ data, user, locale, t, logger }) =>
      CronTasksListRepository.createTask(data, user, locale, t, logger),
  },
});
