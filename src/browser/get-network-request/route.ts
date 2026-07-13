/**
 * GetNetworkRequest Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import getNetworkRequestEndpoints from "./definition";
import { GetNetworkRequestRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: getNetworkRequestEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      GetNetworkRequestRepository.getNetworkRequest(
        data,
        t,
        logger,
        platform,
        streamContext.threadId,
      ),
  },
});
