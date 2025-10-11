/**
 * Enhanced Template Stats Route Handlers
 * Next.js API route handlers for enhanced template statistics
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { enhancedTemplateStatsRepository } from "./repository";

/**
 * Handler that supports both Next.js, CLI and tRPC
 */
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ data, auth, locale, logger }) => {
      return await enhancedTemplateStatsRepository.getStats(
        data,
        auth,
        locale,
        logger,
      );
    },
  },
});
