/**
 * WaitFor Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import waitForEndpoints from "./definition";
import { WaitForRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: waitForEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      WaitForRepository.waitFor(
        data,
        t,
        logger,
        platform,
        streamContext.threadId,
      ),
  },
});
