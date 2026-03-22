/**
 * Email Campaigns Route Handler
 * POST: run email campaigns (called by cron)
 * GET: read email campaigns configuration
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { EmailCampaignsRepository } from "./repository";

export const { POST, GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t }) =>
      EmailCampaignsRepository.run(data, user, logger, t),
  },
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, t, logger }) =>
      EmailCampaignsRepository.getConfig(user, t, logger),
  },
});
