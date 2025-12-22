/**
 * Cron Tasks List API Route Handlers
 * Migrated from side-tasks-old/cron/tasks/route.ts
 * Handles GET and POST requests for listing and creating cron tasks
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { cronTasksListRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ data, logger }) => {
      return await cronTasksListRepository.getTasks(data, logger);
    },
  },
  [Methods.POST]: {
    handler: async ({ data, logger }) => {
      return await cronTasksListRepository.createTask(data, logger);
    },
  },
});
