/**
 * Thread Report Route Handler
 * POST /agent/chat/threads/[threadId]/report
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ThreadReportRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, request, logger, locale }) =>
      ThreadReportRepository.submitReport(
        urlPathParams,
        data,
        user,
        request,
        logger,
        locale,
      ),
  },
});
