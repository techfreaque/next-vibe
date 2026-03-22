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
    handler: ({ data, user, t, logger }) =>
      CampaignStarterRepository.run(data, user, t, logger),
  },
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, t, logger }) =>
      CampaignStarterRepository.getConfig(user, t, logger),
  },
});
