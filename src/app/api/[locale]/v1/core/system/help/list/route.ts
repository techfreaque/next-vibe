/**
 * Help List Route Handler
 * Handles POST requests for listing all available CLI commands
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import helpListEndpoints from "./definition";
import { helpListRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: helpListEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return helpListRepository.execute(data, user, locale, logger);
    },
  },
});
