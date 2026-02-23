/**
 * Import Job Stop Action API Route
 * POST /api/[locale]/leads/import/jobs/[jobId]/stop
 */

import { scopedTranslation as importScopedTranslation } from "@/app/api/[locale]/import/i18n";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { importRepository } from "../../../../../import/repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ user, urlPathParams, logger, locale }) => {
      const { t } = importScopedTranslation.scopedT(locale);
      return await importRepository.stopJob(
        user.id,
        urlPathParams.jobId,
        logger,
        t,
      );
    },
  },
});
