/**
 * ListPages Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import listPagesEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: listPagesEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ logger }) => {
      return executeMCPTool(
        {
          toolName: "list-pages",
          args: filterUndefinedArgs({}),
        },
        logger,
      );
    },
  },
});
