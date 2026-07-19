/**
 * Referral API Route Handlers
 * Next.js API route handlers with validation and business logic
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ReferralRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger, locale }) =>
      ReferralRepository.createReferralCode(user.id, data, logger, locale),
  },
});
