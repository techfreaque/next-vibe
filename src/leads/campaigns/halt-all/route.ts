/**
 * Halt All Campaigns Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { HaltAllCampaignsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      HaltAllCampaignsRepository.haltAll(data, logger, t),
  },
});
