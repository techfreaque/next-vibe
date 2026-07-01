/**
 * POS Dashboard API Route Handler
 */
import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { PosDashboardRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ user, logger, locale }) =>
      PosDashboardRepository.getDashboard(user.id, logger, locale),
  },
});
