/**
 * Open database studio Route
 * API route for open database studio
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import studioEndpoints from "./definition";
import { studioRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: studioEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) => {
      return studioRepository.execute(data, logger);
    },
  },
});
