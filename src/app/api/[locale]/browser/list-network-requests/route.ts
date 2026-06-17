/**
 * ListNetworkRequests Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import listNetworkRequestsEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: listNetworkRequestsEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
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
        streamContext.threadId,
      ),
  },
});
