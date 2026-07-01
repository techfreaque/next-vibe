/**
 * Newsletter Status API Route
 * Get newsletter subscription status for an email
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { NewsletterStatusRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, t, logger }) =>
      NewsletterStatusRepository.getStatus(data, t, logger),
  },
});
