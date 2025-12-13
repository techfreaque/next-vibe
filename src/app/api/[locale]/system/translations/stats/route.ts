/**
 * Translation Management API Route Handler
 * Handles GET and POST requests for translation statistics and reorganization operations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { translationReorganizeRepository } from "../reorganize/repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ logger }) => {
      return await translationReorganizeRepository.getTranslationStats(logger);
    },
  },
});
