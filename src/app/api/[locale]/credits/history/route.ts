/**
 * Credit History API Route Handler
 * /api/agent/chat/credits/history
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { creditRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ data, user, logger }) => {
      return await creditRepository.getTransactions(
        user.id,
        data.limit,
        data.offset,
        logger,
      );
    },
  },
});
