/**
 * Import Jobs Management API Routes
 * Comprehensive CRUD operations for import jobs
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { importRepository } from "../../../import/repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, urlPathParams, logger }) => {
      const userId = authRepository.requireUserId(user);
      const response = await importRepository.listImportJobs(
        userId,
        urlPathParams.filters,
        logger,
      );

      // Wrap response in jobs object to match definition
      if (response.success) {
        return {
          success: true,

          data: { jobs: { items: response.data } },
        };
      }
      return response;
    },
  },
});
