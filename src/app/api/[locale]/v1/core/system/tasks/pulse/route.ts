/**
 * Pulse Route
 * API routes for pulse health monitoring system
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";

import endpoints from "./definition";
import { pulseHealthRepository } from "./repository";

export const { POST, GET, tools } = endpointsHandler({
  endpoints,
  POST: async ({ data, user, locale, logger }) => {
    return await pulseHealthRepository.executePulse(data, user, locale, logger);
  },

  GET: async ({ user, locale, logger }) => {
    return await pulseHealthRepository.getPulseStatus(user, locale, logger);
  },
});
