/**
 * Database Ping Route Handler
 * Handles POST requests for database connectivity checks
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import pingEndpoints from "./definition";
import { DatabasePingRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: pingEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) => {
      return DatabasePingRepository.pingDatabase(data, logger);
    },
  },
});
