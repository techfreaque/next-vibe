/**
 * Credit Purchase API Route Handler
 * /api/agent/chat/credits/purchase
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CreditPurchaseRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      return await CreditPurchaseRepository.createCheckoutSession(
        data,
        user.id,
        locale,
        logger,
      );
    },
  },
});
