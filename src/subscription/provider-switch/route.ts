/**
 * Subscription Provider Switch Route
 * GET/POST /api/[locale]/subscription/provider-switch
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { ProviderSwitchRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ user, logger, t }) =>
      ProviderSwitchRepository.getOffer(user, logger, t),
  },
  [Methods.POST]: {
    handler: ({ user, locale, logger, t }) =>
      ProviderSwitchRepository.startSwitch(user, locale, logger, t),
  },
});
