/**
 * Import Jobs Management API Routes
 * Comprehensive CRUD operations for import jobs
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { LeadsImportRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, data, logger, t }) => {
      return await LeadsImportRepository.listImportJobsFormatted(
        user.id,
        {
          status: data.filters.status,
          limit: data.filters.limit || 50,
          offset: data.filters.offset || 0,
        },
        logger,
        t,
      );
    },
  },
});
