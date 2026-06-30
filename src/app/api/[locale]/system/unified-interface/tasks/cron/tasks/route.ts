/**
 * Cron Tasks List API Route Handlers
 * Handles GET and POST requests for listing and creating cron tasks
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
