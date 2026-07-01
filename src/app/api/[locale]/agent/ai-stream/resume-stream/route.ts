/**
 * Resume Stream Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { endpoints } from "./definition";
import { ResumeStreamRepository } from "./repository";

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
