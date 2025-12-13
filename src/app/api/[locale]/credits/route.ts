/**
 * Credit Balance API Route Handler
 * /api/agent/chat/credits
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { creditRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ user, locale, logger }) => {
      return await creditRepository.getCreditBalanceForUser(user, locale, logger);
    },
  },
});
