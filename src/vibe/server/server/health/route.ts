/**
 * Server Health Check Route
 * Handles health check requests
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { HealthCheckRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, locale, logger, t }) =>
      HealthCheckRepository.checkHealth(data, logger, t, locale),
  },
});
