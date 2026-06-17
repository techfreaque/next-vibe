/**
 * Emulate Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
