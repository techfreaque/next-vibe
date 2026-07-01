/**
 * Leads Dashboard Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import leadsDashboardDefinitions from "./definition";
import { LeadsDashboardRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: leadsDashboardDefinitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ logger, t }) =>
      LeadsDashboardRepository.getDashboard(logger, t),
  },
});
