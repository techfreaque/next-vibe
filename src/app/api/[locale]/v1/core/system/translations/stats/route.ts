/**
 * Translation Management API Route Handler
 * Handles GET and POST requests for translation statistics and reorganization operations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

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
