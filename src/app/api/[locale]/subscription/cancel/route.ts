/**
 * Subscription Cancel API Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { SubscriptionRepository } from "../repository";
import definitions from "./definition";

export const { DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.DELETE]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) =>
      SubscriptionRepository.cancelSubscription(data, user.id, logger, locale),
  },
});
