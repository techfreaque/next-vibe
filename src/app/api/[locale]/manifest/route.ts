/**
 * Manifest API Route
 * GET /api/[locale]/manifest
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import manifestEndpoints from "./definition";
import { ManifestRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: manifestEndpoints,
  [Methods.GET]: {
    handler: ({ locale, logger }) => ManifestRepository.generateManifest(locale, logger),
  },
});
