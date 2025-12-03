/**
 * NewPage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import newPageEndpoints from "./definition";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: newPageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return executeMCPTool(
        {
          toolName: "new-page",
          args: filterUndefinedArgs({
            url: data.url,
            timeout: data.timeout,
          }),
        },
        user,
        logger,
        locale,
      );
    },
  },
});
