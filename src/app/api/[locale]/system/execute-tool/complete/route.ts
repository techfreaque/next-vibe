/**
 * Task Report Route Handler
 * Validates API key, applies execution result to local task record.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { endpoints } from "./definition";
import { TaskReportRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, locale, streamContext }) =>
      TaskReportRepository.processReport(
        data,
        logger,
        locale,
        streamContext.abortSignal,
      ),
  },
});
