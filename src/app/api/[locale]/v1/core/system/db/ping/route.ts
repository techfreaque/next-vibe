/**
 * Database Ping Route Handler
 * Handles POST requests for database connectivity checks
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import pingEndpoints from "./definition";
import { databasePingRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: pingEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) => {
      return databasePingRepository.pingDatabase(data, logger);
    },
  },
});
