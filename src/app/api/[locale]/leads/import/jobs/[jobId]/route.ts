/**
 * Import Job Management API Routes
 * Individual job operations (update, delete)
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { leadsImportRepository } from "../../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: async ({ user, data, urlPathParams, logger }) => {
      return await leadsImportRepository.updateImportJobFormatted(
        user.id,
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
      return await leadsImportRepository.deleteImportJobFormatted(
        user.id,
        urlPathParams.jobId,
        logger,
      );
    },
  },
});
