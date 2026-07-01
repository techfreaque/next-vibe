import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Import Job Management API Routes
 * Individual job operations (update, delete)
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

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
