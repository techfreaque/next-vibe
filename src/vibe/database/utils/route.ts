/**
 * Database Utils API Route Handler
 * Handles requests for database utility operations
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import dbUtilsHealthEndpoint from "./definition";
import { DbUtilsRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: dbUtilsHealthEndpoint,
  [Methods.GET]: {
    handler: async ({ data, t, logger }) =>
      DbUtilsRepository.checkHealth(data, t, logger),
  },
});
