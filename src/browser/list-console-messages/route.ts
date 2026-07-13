/**
 * ListConsoleMessages Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import listConsoleMessagesEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: listConsoleMessagesEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          toolName: BrowserTool.LIST_CONSOLE_MESSAGES,
          args: BrowserSharedRepository.filterUndefinedArgs({
            pageIdx: data.pageIdx,
            pageSize: data.pageSize,
            types: data.types,
            includePreservedMessages: data.includePreservedMessages,
          }),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        streamContext.threadId,
      ),
  },
});
