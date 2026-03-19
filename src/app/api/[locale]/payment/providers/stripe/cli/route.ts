/**
 * CLI Stripe API Route
 * Route handler for Stripe CLI operations
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { CliStripeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, t, logger }) => {
      return CliStripeRepository.processStripe(data, user, t, logger);
    },
  },
});
