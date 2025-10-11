/**
 * Server Start Route Handler
 * Handles POST requests for starting the production server
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import startEndpoints from "./definition";
import { serverStartRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: startEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return serverStartRepository.startServer(data, user, locale, logger);
    },
  },
});
