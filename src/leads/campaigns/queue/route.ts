import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
/**
 * Campaign Queue API Route Handler
 */
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CampaignQueueRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      CampaignQueueRepository.getQueue(data, logger, t),
  },
});
