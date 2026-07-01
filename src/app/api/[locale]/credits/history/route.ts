/**
 * Credit History API Route Handler
 * /api/agent/chat/credits/history
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { CreditRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger, t }) =>
      CreditRepository.getTransactionHistory(data, user, logger, t, locale),
  },
});
