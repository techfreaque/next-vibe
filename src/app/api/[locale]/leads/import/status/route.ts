/**
 * Import Jobs Management API Routes
 * Comprehensive CRUD operations for import jobs
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { authRepository } from "@/app/api/[locale]/user/auth/repository";

import { leadsImportRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, data, logger }) => {
      const userId = authRepository.requireUserId(user);
      return await leadsImportRepository.listImportJobsFormatted(
        userId,
        {
          status: data.filters.status,
          limit: data.filters.limit || 50,
          offset: data.filters.offset || 0,
        },
        logger,
      );
    },
  },
});
