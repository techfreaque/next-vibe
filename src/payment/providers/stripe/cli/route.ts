/**
 * CLI Stripe API Route
 * Route handler for Stripe CLI operations
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { CliStripeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, t, logger }) =>
      CliStripeRepository.processStripe(data, user, t, logger),
  },
});
