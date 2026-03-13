/**
 * Error Groups Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { ErrorGroupsRepository } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, t, logger }) =>
      ErrorGroupsRepository.getGroups(data, t, logger),
  },
  [Methods.PATCH]: {
    handler: ({ data, t, logger }) =>
      ErrorGroupsRepository.updateGroupStatus(data, t, logger),
  },
});
