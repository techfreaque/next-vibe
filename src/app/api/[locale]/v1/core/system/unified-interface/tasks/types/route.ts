/**
 * Tasks Types API Route
 * Route handler for task type operations
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { taskTypesRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      taskTypesRepository.getTypes(data, user, locale, logger),
  }
});
