import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Import Job Retry Action API Route
 * POST /api/[locale]/leads/import/jobs/[jobId]/retry
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

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
