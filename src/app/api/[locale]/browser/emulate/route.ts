/**
 * Emulate Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executeEmulate, filterUndefinedArgs } from "../shared/repository";
import emulateEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: emulateEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeEmulate(
        {
          toolName: BrowserTool.EMULATE,
          args: filterUndefinedArgs({
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
