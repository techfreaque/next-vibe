/**
 * ListNetworkRequests Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import listNetworkRequestsEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: listNetworkRequestsEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, toolExecutionContext }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          toolName: BrowserTool.LIST_NETWORK_REQUESTS,
          args: BrowserSharedRepository.filterUndefinedArgs({
            pageIdx: data.pageIdx,
            pageSize: data.pageSize,
            resourceTypes: data.resourceTypes,
            includePreservedRequests: data.includePreservedRequests,
          }),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        toolExecutionContext.threadId,
      ),
  },
});
