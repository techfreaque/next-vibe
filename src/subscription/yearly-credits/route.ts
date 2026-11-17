/**
 * Yearly Credits - Route (daily task: this month's credits for yearly plans)
 * Server-only.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { YearlyCreditsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ logger, locale, t }) =>
      YearlyCreditsRepository.grantCurrentMonth(logger, locale, t),
  },
});
