/**
 * Guard Status Route Handler
 * Handles GET requests for checking guard status
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import guardStatusEndpoints from "./definition";
import { guardStatusRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: guardStatusEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) => {
      return guardStatusRepository.getStatus(data, logger);
    },
  },
});
