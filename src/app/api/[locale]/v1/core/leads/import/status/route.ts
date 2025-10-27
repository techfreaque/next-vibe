/**
 * Import Jobs Management API Routes
 * Comprehensive CRUD operations for import jobs
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

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
