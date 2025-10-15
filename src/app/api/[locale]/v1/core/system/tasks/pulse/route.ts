/**
 * Pulse Route
 * API routes for pulse health monitoring system
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import endpoints from "./definition";
import { pulseHealthRepository } from "./repository";

export const { POST, GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      return await pulseHealthRepository.executePulse(
        data,
        user,
        locale,
        logger,
      );
    },
  },

  [Methods.GET]: {
    handler: async ({ user, locale, logger }) => {
      return await pulseHealthRepository.getPulseStatus(user, locale, logger);
    },
  },
});
