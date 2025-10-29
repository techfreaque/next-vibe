/**
 * Credit Purchase API Route Handler
 * /api/v1/core/agent/chat/credits/purchase
 */

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";

import definitions from "./definition";
import { creditPurchaseRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) =>
      await creditPurchaseRepository.createCheckoutSession(
        data,
        user.id,
        locale,
        logger,
      ),
  },
});
