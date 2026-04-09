/**
 * ListConsoleMessages Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import listConsoleMessagesEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: listConsoleMessagesEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, user, request }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          sessionId:
            request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.LIST_CONSOLE_MESSAGES,
          args: BrowserSharedRepository.filterUndefinedArgs({
            pageIdx: data.pageIdx,
            pageSize: data.pageSize,
            types: data.types,
            includePreservedMessages: data.includePreservedMessages,
          }),
        },
        t,
        logger,
      ),
  },
});
