/**
 * Side Tasks API Route
 * Route handler for side task operations
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { sideTasksRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: () => sideTasksRepository.getStatus(),
  },
  [Methods.POST]: {
    handler: ({ data, logger }) => sideTasksRepository.handleAction(data, logger),
  },
});
