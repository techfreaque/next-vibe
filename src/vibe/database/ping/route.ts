/**
 * Database Ping Route Handler
 * Handles POST requests for database connectivity checks
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import pingEndpoints from "./definition";
import { DatabasePingRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: pingEndpoints,
  [Methods.POST]: {
    handler: ({ data, t, logger }) =>
      DatabasePingRepository.pingDatabase(data, t, logger),
  },
});
