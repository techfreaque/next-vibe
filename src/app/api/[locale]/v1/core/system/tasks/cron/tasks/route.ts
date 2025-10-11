/**
 * Cron Tasks List API Route Handlers
 * Migrated from side-tasks-old/cron/tasks/route.ts
 * Handles GET requests for listing cron tasks
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { endpoints } from "./definition";
import { cronTasksListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ data, user, locale, logger }) => {
      return await cronTasksListRepository.getTasks(data, user, locale, logger);
    },
  },
});
