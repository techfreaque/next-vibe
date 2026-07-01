/**
 * Subscription Admin Referrals Route Handler
 * Handles GET (dashboard) and POST (payout actions)
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SubscriptionAdminReferralsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, logger, locale }) =>
      SubscriptionAdminReferralsRepository.listReferrals(data, logger, locale),
  },
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger, locale }) =>
      SubscriptionAdminReferralsRepository.processPayoutAction(
        data,
        user,
        logger,
        locale,
      ),
  },
});
