/**
 * Emulate Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import emulateEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: emulateEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeEmulate(
        {
          toolName: BrowserTool.EMULATE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            networkConditions: data.networkConditions,
            cpuThrottlingRate: data.cpuThrottlingRate,
            geolocation: data.geolocation,
            userAgent: data.userAgent,
            colorScheme: data.colorScheme,
            viewport: data.viewport,
          }),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        streamContext.threadId,
      ),
  },
});
