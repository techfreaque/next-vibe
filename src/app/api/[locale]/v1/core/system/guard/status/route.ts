/**
 * Guard Status Route Handler
 * Handles GET requests for checking guard status
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import guardStatusEndpoints from "./definition";
import { guardStatusRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: guardStatusEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) => {
      return guardStatusRepository.getStatus(data, user, locale, logger);
    },
  },
});
