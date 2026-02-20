/**
 * Campaign Starter Configuration API Route Handler
 * Handles GET and PUT requests for campaign starter configuration
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CampaignStarterConfigRepository } from "./repository";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ user, logger }) => {
      return await CampaignStarterConfigRepository.getConfig(user, logger);
    },
  },
  [Methods.PUT]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return await CampaignStarterConfigRepository.updateConfig(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
