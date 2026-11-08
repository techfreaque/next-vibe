/**
 * Campaign Links - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CampaignLinksRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ logger, t }) => CampaignLinksRepository.list(logger, t),
  },
  [Methods.POST]: {
    handler: ({ data, user, logger, t }) =>
      CampaignLinksRepository.create(data, user, logger, t),
  },
});
