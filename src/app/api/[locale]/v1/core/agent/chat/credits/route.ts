/**
 * Credit Balance API Route Handler
 * /api/v1/core/agent/chat/credits
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { creditRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ user }) => {
      return await creditRepository.getBalance(user.id);
    },
  },
});
