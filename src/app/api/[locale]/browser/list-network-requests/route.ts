/**
 * ListNetworkRequests Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import listNetworkRequestsEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: listNetworkRequestsEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      executeMCPTool(
        {
          toolName: "list-network-requests",
          args: filterUndefinedArgs({
            pageIdx: data.pageIdx,
            pageSize: data.pageSize,
            resourceTypes: data.resourceTypes,
            includePreservedRequests: data.includePreservedRequests,
          }),
        },
        logger,
      ),
  },
});
