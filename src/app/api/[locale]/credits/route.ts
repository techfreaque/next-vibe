/**
 * Credit Balance API Route Handler
 * /api/agent/chat/credits
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CreditRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ user, locale, logger, t }) =>
      CreditRepository.getCreditBalanceForUser(user, locale, logger, t),
  },
});
