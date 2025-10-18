/**
 * Credit Purchase API Route Handler
 * /api/v1/core/agent/chat/credits/purchase
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { creditPurchaseRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      return await creditPurchaseRepository.createCheckoutSession(
        data,
        user.id,
        locale,
        logger,
      );
    },
  },
});
