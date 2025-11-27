/**
 * Import Job Management API Routes
 * Individual job operations (update, delete)
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { leadsImportRepository } from "../../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: async ({ user, data, urlPathParams, logger }) => {
      const userId = authRepository.requireUserId(user);
      return await leadsImportRepository.updateImportJobFormatted(
        userId,
        {
          jobId: urlPathParams.jobId,
          ...data.settings,
        },
        logger,
      );
    },
  },
  [Methods.DELETE]: {
    handler: async ({ user, urlPathParams, logger }) => {
      const userId = authRepository.requireUserId(user);
      return await leadsImportRepository.deleteImportJobFormatted(
        userId,
        urlPathParams.jobId,
        logger,
      );
    },
  },
});
