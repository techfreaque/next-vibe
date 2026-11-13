/**
 * Newsletter Credit Bonus API Route
 * GET/POST /api/[locale]/newsletter/credit-bonus
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { NewsletterCreditBonusRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ user, logger, t }) =>
      NewsletterCreditBonusRepository.getOffer(user, logger, t),
  },
  [Methods.POST]: {
    handler: ({ user, locale, logger, t }) =>
      NewsletterCreditBonusRepository.claim(user, locale, logger, t),
  },
});
