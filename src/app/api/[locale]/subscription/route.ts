/**
 * Subscription API Route Handlers
 * Next.js API route handlers with validation and business logic
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { SubscriptionRepository } from "./repository";

export const { GET, POST, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
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
  [Methods.POST]: {
    email: undefined, // Email integration to be implemented when needed
    handler: async ({ data, user, locale, logger }) => {
      return await SubscriptionRepository.createSubscription(
        data,
        user.id,
        locale,
        logger,
      );
    },
  },
  [Methods.PUT]: {
    email: undefined, // Email integration to be implemented when needed
    handler: async ({ data, user, locale, logger }) => {
      return await SubscriptionRepository.updateSubscription(
        data,
        user.id,
        locale,
        logger,
      );
    },
  },
  [Methods.DELETE]: {
    email: undefined, // Email integration to be implemented when needed
    handler: async ({ data, user, locale, logger }) => {
      logger.debug("Canceling subscription", {
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        reason: data.reason,
        userId: user?.id,
      });

      // Delegate to repository for business logic and data access
      return await SubscriptionRepository.cancelSubscription(
        data,
        user.id,
        logger,
        locale,
      );
    },
  },
});
