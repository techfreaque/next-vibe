/**
 * Subscription Checkout API Route
 * Creates Stripe checkout sessions for subscription plans
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { BillingInterval } from "../enum";
import endpoints from "./definition";
import { subscriptionCheckoutRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      logger.info("Creating subscription checkout session", {
        planId: data.planId,
        billingInterval: data.billingInterval,
        userId: user?.id,
        locale,
      });

      // Ensure required fields have defaults
      const requestData = {
        ...data,
        billingInterval: data.billingInterval ?? BillingInterval.MONTHLY,
      };

      // Delegate to repository for business logic and data access
      return await subscriptionCheckoutRepository.createCheckoutSession(
        requestData,
        user,
        locale,
        logger,
      );
    },
  },
});
