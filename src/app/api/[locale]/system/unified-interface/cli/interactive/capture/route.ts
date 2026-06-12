/**
 * Interactive Capture Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { InteractiveRepository } from "../repository";
import captureEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: captureEndpoints,
  [Methods.POST]: {
    handler: ({ data, t }) =>
      InteractiveRepository.capture(t, data.pid ?? null),
  },
});
