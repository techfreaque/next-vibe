/**
 * Email Agent Classification API Route Handler
 * Handles POST requests for manually triggering email classification
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { emailAgentClassificationRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger }) => {
      return await emailAgentClassificationRepository.triggerClassification(
        data,
        logger,
        user.id,
      );
    },
  },
});
