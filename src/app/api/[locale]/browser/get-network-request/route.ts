/**
 * GetNetworkRequest Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import getNetworkRequestEndpoints from "./definition";
import { GetNetworkRequestRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: getNetworkRequestEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      GetNetworkRequestRepository.getNetworkRequest(data, t, logger),
  },
});
