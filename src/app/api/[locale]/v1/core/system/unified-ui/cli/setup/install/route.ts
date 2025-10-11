/**
 * Setup Install Route
 * API route for CLI global installation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

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
