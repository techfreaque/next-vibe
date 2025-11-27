/**
 * Tasks Types API Route
 * Route handler for task type operations
 */

import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/handler";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { taskTypesRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({
      data,
      user,
      locale,
      logger,
    }: ApiHandlerProps<
      (typeof endpoints)["GET"]["types"]["RequestOutput"],
      (typeof endpoints)["GET"]["types"]["UrlVariablesOutput"],
      (typeof endpoints)["GET"]["allowedRoles"]
    >) => taskTypesRepository.getTypes(data, user, locale, logger),
  },
});
