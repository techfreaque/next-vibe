/**
 * GetNetworkRequest Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
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
    handler: ({ data, t, logger }) =>
      executeGetNetworkRequest<GetNetworkRequestResponseOutput>(
        {
          toolName: BrowserTool.GET_NETWORK_REQUEST,
          args: filterUndefinedArgs({
            reqid: data.reqid,
            requestFilePath: data.requestFilePath,
            responseFilePath: data.responseFilePath,
          }),
        },
        t,
        logger,
      ),
  },
});
