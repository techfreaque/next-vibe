/**
 * Database Utils API Route Handler
 * Handles requests for database utility operations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import dbUtilsHealthEndpoint from "./definition";
import { DbUtilsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: dbUtilsHealthEndpoint,
  [Methods.GET]: {
    handler: async ({ data, t, logger }) => {
      return await DbUtilsRepository.checkHealth(data, t, logger);
    },
  },
});
