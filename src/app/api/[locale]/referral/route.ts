/**
 * Referral API Route Handlers
 * Next.js API route handlers with validation and business logic
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ReferralRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger }) => {
      return await ReferralRepository.createReferralCode(user.id, data, logger);
    },
  },
});
