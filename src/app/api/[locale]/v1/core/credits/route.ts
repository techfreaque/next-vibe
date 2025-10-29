/**
 * Credit Balance API Route Handler
 * /api/v1/core/agent/chat/credits
 */

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";

import definitions from "./definition";
import { creditRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ user, logger }) => {
      return await creditRepository.getCreditBalanceForUser(
        user.id,
        user.leadId,
        logger,
      );
    },
  },
});
