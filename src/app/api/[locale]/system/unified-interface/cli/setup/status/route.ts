/**
 * Setup Status Route
 * API route for checking CLI installation status
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import statusEndpoints from "./definition";
import { setupStatusRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: statusEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      logger.debug("Setup status check started");
      return setupStatusRepository.getStatus(data, user, locale);
    },
  },
});
