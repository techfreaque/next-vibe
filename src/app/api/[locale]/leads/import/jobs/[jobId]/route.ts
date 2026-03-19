/**
 * Import Job Management API Routes
 * Individual job operations (update, delete)
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { LeadsImportRepository } from "../../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ user, urlPathParams, logger, locale }) =>
      LeadsImportRepository.getImportJobFormatted(
        user.id,
        urlPathParams.jobId,
        logger,
        locale,
      ),
  },
  [Methods.PATCH]: {
    handler: ({ user, data, urlPathParams, logger, locale }) =>
      LeadsImportRepository.updateImportJobFormatted(
        user.id,
        {
          jobId: urlPathParams.jobId,
          ...data.settings,
        },
        logger,
        locale,
      ),
  },
  [Methods.DELETE]: {
    handler: ({ user, urlPathParams, logger, locale }) =>
      LeadsImportRepository.deleteImportJobFormatted(
        user.id,
        urlPathParams.jobId,
        logger,
        locale,
      ),
  },
});
