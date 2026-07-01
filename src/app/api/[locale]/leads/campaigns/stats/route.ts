import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Campaign Stats API Route Handler
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CampaignStatsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      CampaignStatsRepository.getStats(data, logger, t),
  },
});
