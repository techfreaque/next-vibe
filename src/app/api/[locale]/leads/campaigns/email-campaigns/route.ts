/**
 * Email Campaigns Route Handler
 * POST: run email campaigns (called by cron)
 * GET: read email campaigns configuration
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
