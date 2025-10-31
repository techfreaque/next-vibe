/**
 * Generate Expo Indexes Route
 * API route for generating Expo Router index files from Next.js pages
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import generateEndpoints from "./definition";
import { generateExpoIndexesRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: generateEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      logger.debug("Generate Expo indexes started");
      return generateExpoIndexesRepository.generate(data, user, locale);
    },
  },
});
