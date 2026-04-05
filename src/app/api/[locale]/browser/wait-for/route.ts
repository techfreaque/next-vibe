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
    handler: ({ data, t, logger, user, request }) =>
      WaitForRepository.waitFor(data, request?.headers.get("authorization") ?? user.id ?? user.leadId, t, logger),
  },
});
