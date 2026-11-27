/**
 * Plan Move Notice Route
 * POST /api/[locale]/subscription/provider-switch/notify (admin only)
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { PlanMoveNoticeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      PlanMoveNoticeRepository.run(data, logger, t),
  },
});
