/**
 * Database Utils API Route Handler
 * Handles requests for database utility operations
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import dbUtilsHealthEndpoint from "./definition";
import { DbUtilsRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: dbUtilsHealthEndpoint,
  [Methods.GET]: {
    handler: async ({ data, t, logger }) =>
      DbUtilsRepository.checkHealth(data, t, logger),
  },
});
