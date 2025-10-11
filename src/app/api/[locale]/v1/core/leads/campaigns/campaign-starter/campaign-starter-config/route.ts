/**
 * Campaign Starter Configuration API Route Handler
 * Handles GET and PUT requests for campaign starter configuration
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import definitions from "./definition";
import { campaignStarterConfigRepository } from "./repository";

/**
 * Export handlers using endpointHandler
 */
export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async () => {
      return await campaignStarterConfigRepository.getConfig();
    },
  },
  [Methods.PUT]: {
    email: undefined,
    handler: async ({ data }) => {
      return await campaignStarterConfigRepository.updateConfig(data);
    },
  },
});
