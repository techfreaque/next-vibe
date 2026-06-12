/**
 * Leads Dashboard Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
