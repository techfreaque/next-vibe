/**
 * Emulate Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import emulateEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: emulateEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, user, request }) =>
      BrowserSharedRepository.executeEmulate(
        {
          sessionId: request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.EMULATE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            networkConditions: data.networkConditions,
            cpuThrottlingRate: data.cpuThrottlingRate,
            geolocation: data.geolocation,
            userAgent: data.userAgent,
            colorScheme: data.colorScheme,
            viewport: data.viewport,
          }),
        },
        t,
        logger,
      ),
  },
});
