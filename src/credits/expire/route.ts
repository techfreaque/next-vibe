/**
 * Credit Expiration Route Handler
 * Called by cron to expire old subscription credits
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CreditExpireRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ logger, t }) => CreditExpireRepository.expire(logger, t),
  },
});
