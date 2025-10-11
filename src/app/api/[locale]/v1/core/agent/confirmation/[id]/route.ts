/**
 * Human Confirmation API Route Handler
 * Handles POST requests for responding to human confirmation requests
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { humanConfirmationRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, urlVariables, user, logger }) => {
      return await humanConfirmationRepository.respondToConfirmation(
        urlVariables.id,
        data,
        logger,
        user?.id,
      );
    },
  },
});
