/**
 * Setup Update Route
 * API route for CLI update (uninstall + reinstall)
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import updateEndpoints from "./definition";
import { setupUpdateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: updateEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      logger.info("Setup update operation started", { verbose: data.verbose });
      return setupUpdateRepository.updateCli(data, user, locale);
    },
  },
});
