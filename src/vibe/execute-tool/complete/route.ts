/**
 * Task Report Route Handler
 * Validates API key, applies execution result to local task record.
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import { endpoints } from "./definition";
import { TaskReportRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, locale, user, toolExecutionContext }) =>
      TaskReportRepository.processReport(
        data,
        user,
        logger,
        locale,
        toolExecutionContext.abortSignal,
      ),
  },
});
