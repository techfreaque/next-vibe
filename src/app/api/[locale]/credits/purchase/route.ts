/**
 * Credit Purchase API Route Handler
 * /api/agent/chat/credits/purchase
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CreditPurchaseRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger, t }) =>
      CreditPurchaseRepository.createCheckoutSession(
        data,
        user.id,
        locale,
        logger,
        t,
      ),
  },
});
