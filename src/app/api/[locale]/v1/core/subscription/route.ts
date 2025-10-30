/**
 * Subscription API Route Handlers
 * Next.js API route handlers with validation and business logic
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import definitions from "./definition";
import { subscriptionRepository } from "./repository";

export const { GET, POST, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, logger }) => {
      const userId = authRepository.requireUserId(user);
      return await subscriptionRepository.getSubscription(userId, logger);
    },
  },
  [Methods.POST]: {
    email: undefined, // Email integration to be implemented when needed
    handler: async ({ data, user, locale, logger }) => {
      const userId = authRepository.requireUserId(user);
      return await subscriptionRepository.createSubscription(
        data,
        userId,
        locale,
        logger,
      );
    },
  },
  [Methods.PUT]: {
    email: undefined, // Email integration to be implemented when needed
    handler: async ({ data, user, locale, logger }) => {
      const userId = authRepository.requireUserId(user);
      return await subscriptionRepository.updateSubscription(
        data,
        userId,
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

      const userId = authRepository.requireUserId(user);

      // Delegate to repository for business logic and data access
      return await subscriptionRepository.cancelSubscription(
        data,
        userId,
        logger,
        locale,
      );
    },
  },
});
