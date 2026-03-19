/**
 * Setup Status Route
 * API route for checking CLI installation status
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import statusEndpoints from "./definition";
import { SetupStatusRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: statusEndpoints,
  [Methods.POST]: {
    handler: ({ user, logger, t }) => {
      logger.debug("Setup status check started");
      return SetupStatusRepository.getStatus(user, t);
    },
  },
});
