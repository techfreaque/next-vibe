/**
 * Referral Links - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ReferralLinksRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ user, logger, t }) =>
      ReferralLinksRepository.list(user, logger, t),
  },
  [Methods.POST]: {
    handler: ({ data, user, logger, t }) =>
      ReferralLinksRepository.create(data, user, logger, t),
  },
});
