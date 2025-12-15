/**
 * GetNetworkRequest Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import {
  executeGetNetworkRequest,
  filterUndefinedArgs,
} from "../shared/repository";
import getNetworkRequestEndpoints, {
  type GetNetworkRequestResponseOutput,
} from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: getNetworkRequestEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      executeGetNetworkRequest<GetNetworkRequestResponseOutput>(
        {
          toolName: "get-network-request",
          args: filterUndefinedArgs({
            reqid: data.reqid,
          }),
        },
        logger,
      ),
  },
});
