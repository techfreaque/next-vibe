/**
 * Subscription Admin Purchases Route Handler
 * Handles GET requests for listing credit pack purchases
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
