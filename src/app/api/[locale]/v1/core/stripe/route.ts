/**
 * CLI Stripe API Route
 * Route handler for Stripe CLI operations
 */

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";

import endpoints from "./definition";
import { cliStripeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return cliStripeRepository.processStripe(data, user, locale, logger);
    },
  },
});
