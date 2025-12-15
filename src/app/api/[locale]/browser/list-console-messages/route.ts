/**
 * ListConsoleMessages Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import listConsoleMessagesEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: listConsoleMessagesEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      executeMCPTool(
        {
          toolName: "list-console-messages",
          args: filterUndefinedArgs({
            pageIdx: data.pageIdx,
            pageSize: data.pageSize,
            types: data.types,
            includePreservedMessages: data.includePreservedMessages,
          }),
        },
        logger,
      ),
  },
});
