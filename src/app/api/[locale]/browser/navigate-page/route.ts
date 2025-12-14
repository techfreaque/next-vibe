/**
 * NavigatePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import navigatePageEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: navigatePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executeMCPTool(
        {
          toolName: "navigate-page",
          args: filterUndefinedArgs({
            type: data.type,
            url: data.url,
            ignoreCache: data.ignoreCache,
            timeout: data.timeout,
          }),
        },
        logger,
      );
    },
  },
});
