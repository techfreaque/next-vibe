/**
 * Credit History API Route Handler
 * /api/v1/core/agent/chat/credits/history
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { creditRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ data, user }) => {
      return await creditRepository.getTransactions(
        user.id,
        data.limit,
        data.offset,
      );
    },
  },
});
