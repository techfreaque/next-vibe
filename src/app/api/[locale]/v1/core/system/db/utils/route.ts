/**
 * Database Utils API Route Handler
 * Handles requests for database utility operations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import dbUtilsHealthEndpoint from "./definition";
import { dbUtilsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: dbUtilsHealthEndpoint,
  [Methods.GET]: {
    handler: async ({ data, logger }) => {
      return await dbUtilsRepository.checkHealth(data, logger);
    },
  },
});
