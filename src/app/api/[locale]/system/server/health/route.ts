/**
 * Server Health Check Route
 * Handles health check requests
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { HealthCheckRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, locale, logger, t }) => {
      return HealthCheckRepository.checkHealth(data, logger, t, locale);
    },
  },
});
