/**
 * Emulate Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeEmulate, filterUndefinedArgs } from "../shared/repository";
import emulateEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: emulateEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executeEmulate(
        {
          toolName: "emulate",
          args: filterUndefinedArgs({
            cpuThrottlingRate: data.cpuThrottlingRate,
            networkConditions: data.networkConditions,
          }),
        },
        logger,
      );
    },
  },
});
