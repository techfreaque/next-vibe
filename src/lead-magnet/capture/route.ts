/**
 * Lead Magnet Capture Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { LeadMagnetCaptureRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, locale }) =>
      LeadMagnetCaptureRepository.submitCapture(data, locale),
  },
});
