/**
 * Template Export Route Handlers
 * Next.js API route handlers for template export operations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { templateExportRepository } from "./repository";

/**
 * Handler that supports both Next.js, CLI and tRPC
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      return await templateExportRepository.exportTemplates(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
