/**
 * Campaign Starter Route Handler
 * POST: save config + run, GET: read config
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CampaignStarterRepository } from "./repository";

export const { POST, GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, t, logger, platform }) =>
      CampaignStarterRepository.run(
        data,
        data.timezone,
        user,
        t,
        logger,
        platform,
      ),
  },
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, t, logger }) =>
      CampaignStarterRepository.getConfig(user, data.timezone, t, logger),
  },
});
