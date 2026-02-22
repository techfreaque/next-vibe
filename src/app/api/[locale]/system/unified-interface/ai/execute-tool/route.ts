/**
 * Route Execute Route
 * POST /api/[locale]/system/unified-interface/ai/execute-tool
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import executeDefinition from "./definition";
import { RouteExecuteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: executeDefinition,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) =>
      RouteExecuteRepository.execute(data, user, locale, logger),
  },
});
