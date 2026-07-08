/**
 * Resume Stream Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { ResumeStreamRepository } from "../repository/resume";
import { endpoints } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t, streamContext }) =>
      ResumeStreamRepository.resume(
        data,
        user,
        locale,
        logger,
        t,
        streamContext.abortSignal,
        streamContext.subAgentDepth,
      ),
  },
});
