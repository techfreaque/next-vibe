/**
 * Translation Management API Route Handler
 * Handles GET and POST requests for translation statistics and reorganization operations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { translationReorganizeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, locale, logger }) => {
      return await translationReorganizeRepository.reorganizeTranslations(
        data,
        locale,
        logger,
      );
    },
  },
});
