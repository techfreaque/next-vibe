/**
 * Admin Add Credits Route Handler
 * Adds credit packs to a user account (admin only)
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { AdminAddCreditsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      AdminAddCreditsRepository.addCredits(data, logger, locale),
  },
});
