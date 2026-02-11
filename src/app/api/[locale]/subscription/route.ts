/**
 * Subscription API Route Handler
 * Handles GET (read) for subscription overview
 * Create, update, and cancel are in separate subdirectories
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definition from "./definition";
import { SubscriptionRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: { GET: definition.GET },
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, logger, locale }) => {
      return await SubscriptionRepository.getSubscription(
        user.id,
        logger,
        locale,
      );
    },
  },
});
