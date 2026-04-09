/**
 * Lead Magnet Capture Route Handler
 */

import "server-only";

import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";

import endpoints from "./definition";
import { LeadMagnetCaptureRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, locale }) =>
      LeadMagnetCaptureRepository.submitCapture(data, locale),
  },
});
