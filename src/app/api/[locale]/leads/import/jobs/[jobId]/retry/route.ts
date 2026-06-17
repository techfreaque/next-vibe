import "server-only";

/**
 * Import Job Retry Action API Route
 * POST /api/[locale]/leads/import/jobs/[jobId]/retry
 */
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { LeadsImportJobRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ user, urlPathParams, logger, locale }) =>
      LeadsImportJobRepository.retryJob(
        user.id,
        urlPathParams.jobId,
        logger,
        locale,
      ),
  },
});
