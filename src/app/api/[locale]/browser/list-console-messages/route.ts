/**
 * ListConsoleMessages Tool - Route Handler
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import listConsoleMessagesEndpoints, {
  type ListConsoleMessagesResponseOutput,
} from "./definition";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: listConsoleMessagesEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({
      data,
      logger,
    }): Promise<ResponseType<ListConsoleMessagesResponseOutput>> => {
      return executeMCPTool(
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
      );
    },
  },
});
