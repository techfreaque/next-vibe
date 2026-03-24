/**
 * Campaign Starter Route Handler
 * POST: save config + run, GET: read config
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
