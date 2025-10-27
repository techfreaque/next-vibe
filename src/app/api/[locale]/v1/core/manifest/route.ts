/**
 * Manifest API Route
 * Handles web app manifest generation
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import manifestEndpoints from "./definition";
import { manifestRepository } from "./repository";

// Constants for manifest values (non-translatable)
const MANIFEST_CONSTANTS = {
  CACHE_CONTROL: "public, max-age=3600",
  CONTENT_TYPE: "application/manifest+json",
} as const;

/**
 * Export handlers using endpointsHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: manifestEndpoints,
  [Methods.GET]: {
    handler: async ({ locale, logger }) => {
      const result = await manifestRepository.generateManifest(locale, logger);

      if (!result.success) {
        return result;
      }

      // Return the manifest with appropriate headers for web app manifest
      return {
        ...result,
        headers: {
          "Content-Type": MANIFEST_CONSTANTS.CONTENT_TYPE,
          "Cache-Control": MANIFEST_CONSTANTS.CACHE_CONTROL,
        },
      };
    },
  },
});
