/**
 * Import Job Management API Routes
 * Individual job operations (update, delete)
 */

import { scopedTranslation as importScopedTranslation } from "@/app/api/[locale]/import/i18n";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { leadsImportRepository } from "../../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ user, urlPathParams, logger, locale }) => {
      const { t } = importScopedTranslation.scopedT(locale);
      return await leadsImportRepository.getImportJobFormatted(
        user.id,
        urlPathParams.jobId,
        logger,
        t,
      );
    },
  },
  [Methods.PATCH]: {
    handler: async ({ user, data, urlPathParams, logger, locale }) => {
      const { t } = importScopedTranslation.scopedT(locale);
      return await leadsImportRepository.updateImportJobFormatted(
        user.id,
        {
          jobId: urlPathParams.jobId,
          ...data.settings,
        },
        logger,
        t,
      );
    },
  },
  [Methods.DELETE]: {
    handler: async ({ user, urlPathParams, logger, locale }) => {
      const { t } = importScopedTranslation.scopedT(locale);
      return await leadsImportRepository.deleteImportJobFormatted(
        user.id,
        urlPathParams.jobId,
        logger,
        t,
      );
    },
  },
});
