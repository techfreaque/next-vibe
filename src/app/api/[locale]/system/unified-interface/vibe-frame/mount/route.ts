/**
 * Vibe Frame Config — Route
 *
 * Public POST endpoint. The embed script (always cross-origin) passes identity
 * (leadId + authToken) in the POST body. No session cookie required.
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { VibeFrameConfigRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, locale, logger }) => {
      return VibeFrameConfigRepository.config({ data, locale, logger });
    },
  },
});
