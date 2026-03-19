/**
 * Import Job Stop Action API Route
 * POST /api/[locale]/leads/import/jobs/[jobId]/stop
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { LeadsImportRepository } from "../../../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ user, urlPathParams, logger, locale }) =>
      LeadsImportRepository.stopJob(
        user.id,
        urlPathParams.jobId,
        logger,
        locale,
      ),
  },
});
