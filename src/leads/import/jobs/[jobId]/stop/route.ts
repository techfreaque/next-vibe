import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Import Job Stop Action API Route
 * POST /api/[locale]/leads/import/jobs/[jobId]/stop
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

import { LeadsImportJobRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ user, urlPathParams, logger, locale }) =>
      LeadsImportJobRepository.stopJob(
        user.id,
        urlPathParams.jobId,
        logger,
        locale,
      ),
  },
});
