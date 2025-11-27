/**
 * Server Health Check Route
 * Handles health check requests
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ data, user, locale, logger }) => {
      // Lazy import to avoid creating connections during route discovery
      const { healthCheckRepository } = await import("./repository");
      return await healthCheckRepository.checkHealth(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
