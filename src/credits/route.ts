/**
 * Credit Balance API Route Handler
 * /api/agent/chat/credits
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CreditRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ user, locale, logger, t }) =>
      CreditRepository.getCreditBalanceForUser(user, locale, logger, t),
  },
});
