/**
 * Subscription Admin Purchases Route Handler
 * Handles GET requests for listing credit pack purchases
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SubscriptionAdminPurchasesRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, logger, locale }) =>
      SubscriptionAdminPurchasesRepository.listPurchases(data, logger, locale),
  },
});
