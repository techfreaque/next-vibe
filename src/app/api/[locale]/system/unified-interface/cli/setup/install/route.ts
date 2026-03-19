/**
 * Setup Install Route
 * API route for CLI global installation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import installEndpoints from "./definition";
import { SetupInstallRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: installEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger, t }) => {
      logger.debug("Setup install operation started", {
        force: data.force,
        verbose: data.verbose,
      });
      return SetupInstallRepository.installCli(data, user, t);
    },
  },
});
