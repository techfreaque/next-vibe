/**
 * WaitFor Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeWaitFor, filterUndefinedArgs } from "../shared/repository";
import waitForEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: waitForEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executeWaitFor(
        {
          toolName: "wait-for",
          args: filterUndefinedArgs({
            text: data.text,
            timeout: data.timeout,
          }),
        },
        logger,
      );
    },
  },
});
