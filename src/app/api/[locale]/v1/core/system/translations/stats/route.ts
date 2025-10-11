/**
 * Translation Management API Route Handler
 * Handles GET and POST requests for translation statistics and reorganization operations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { translationReorganizeRepository } from "../reorganize/repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ locale, logger }) => {
      return await translationReorganizeRepository.getTranslationStats(
        locale,
        logger,
      );
    },
  },
});
