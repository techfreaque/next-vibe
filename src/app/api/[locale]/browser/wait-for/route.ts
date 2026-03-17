/**
 * WaitFor Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import waitForEndpoints from "./definition";
import { WaitForRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: waitForEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      WaitForRepository.waitFor(data, t, logger),
  },
});
