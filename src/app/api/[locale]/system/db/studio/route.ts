/**
 * Open database studio Route
 * API route for open database studio
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import studioEndpoints from "./definition";
import { StudioRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: studioEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) => {
      return StudioRepository.execute(data, logger);
    },
  },
});
