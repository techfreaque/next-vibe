/**
 * Setup Install Route
 * API route for CLI global installation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import installEndpoints from "./definition";
import { setupInstallRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: installEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      logger.debug("Setup install operation started", {
        force: data.force,
        verbose: data.verbose,
      });
      return setupInstallRepository.installCli(data, user, locale);
    },
  },
});
