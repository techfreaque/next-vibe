/**
 * Subscription Update API Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { SubscriptionRepository } from "../repository";
import definitions from "./definition";

export const { PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PUT]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) =>
      SubscriptionRepository.updateSubscription(data, user.id, locale, logger),
  },
});
