/**
 * Email Agent Status API Route Handler
 * Handles GET requests for retrieving email agent processing status
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { emailAgentStatusRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ urlVariables, logger }) => {
      return await emailAgentStatusRepository.getProcessingStatus(
        urlVariables,
        logger,
      );
    },
  },
  [Methods.POST]: {
    handler: async ({ data, logger }) => {
      return await emailAgentStatusRepository.getProcessingStatus(data, logger);
    },
  },
});
