/**
 * Side Tasks API Route
 * Route handler for side task operations
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import endpoints from "./definition";
import { sideTasksRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ data, user, locale, logger }) =>
      await sideTasksRepository.getStatus(data, user, locale, logger),
  },
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) =>
      await sideTasksRepository.handleAction(data, user, locale, logger),
  },
});
