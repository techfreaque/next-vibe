/**
 * ListNetworkRequests Tool - Route Handler
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import listNetworkRequestsEndpoints, {
  type ListNetworkRequestsResponseOutput,
} from "./definition";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: listNetworkRequestsEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({
      data,
      logger,
    }): Promise<ResponseType<ListNetworkRequestsResponseOutput>> => {
      return executeMCPTool(
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
      );
    },
  },
});
