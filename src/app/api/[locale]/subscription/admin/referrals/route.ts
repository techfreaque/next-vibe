/**
 * Subscription Admin Referrals Route Handler
 * Handles GET (dashboard) and POST (payout actions)
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { SubscriptionAdminReferralsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, logger, locale }) => {
      return await SubscriptionAdminReferralsRepository.listReferrals(
        data,
        logger,
        locale,
      );
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger, locale }) => {
      return await SubscriptionAdminReferralsRepository.processPayoutAction(
        data,
        user,
        logger,
        locale,
      );
    },
  },
});
