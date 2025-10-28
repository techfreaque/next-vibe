/**
 * Help List Route Handler
 * Handles POST requests for listing all available CLI commands
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import helpListEndpoints from "./definition";
import { helpListRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: helpListEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger }) => {
      return helpListRepository.execute(data, locale, logger);
    },
  },
});
