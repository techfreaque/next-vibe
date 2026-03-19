/**
 * Setup Uninstall Route
 * API route for CLI global uninstallation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import uninstallEndpoints from "./definition";
import { SetupUninstallRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: uninstallEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger, t }) => {
      logger.info("Setup uninstall operation started", {
        verbose: data.verbose,
      });
      return SetupUninstallRepository.uninstallCli(data, user, t);
    },
  },
});
