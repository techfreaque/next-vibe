/**
 * POS Dashboard API Route Handler
 */
import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { PosDashboardRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ user, logger, locale }) =>
      PosDashboardRepository.getDashboard(user.id, logger, locale),
  },
});
