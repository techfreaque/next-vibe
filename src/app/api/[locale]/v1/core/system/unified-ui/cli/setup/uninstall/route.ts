/**
 * Setup Uninstall Route
 * API route for CLI global uninstallation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import uninstallEndpoints from "./definition";
import { setupUninstallRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: uninstallEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      logger.info("Setup uninstall operation started", {
        verbose: data.verbose,
      });
      return setupUninstallRepository.uninstallCli(data, user, locale);
    },
  },
});
