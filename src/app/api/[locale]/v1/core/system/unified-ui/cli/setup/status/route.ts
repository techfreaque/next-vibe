/**
 * Setup Status Route
 * API route for checking CLI installation status
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

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
