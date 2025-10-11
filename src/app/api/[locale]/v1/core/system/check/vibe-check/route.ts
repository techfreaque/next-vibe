/**
 * Vibe Check Route Handler
 * Handles POST requests for comprehensive code quality checks
 */

import "server-only";

import { endpointsHandler } from "../../unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "../../unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import vibeCheckEndpoints from "./definition";
import { vibeCheckRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeCheckEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger }) => {
      return vibeCheckRepository.execute(data, locale, logger);
    },
  },
});
