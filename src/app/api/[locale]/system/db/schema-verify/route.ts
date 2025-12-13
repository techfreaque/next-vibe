/**
 * Verify database schema Route
 * API route for verify database schema
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import schemaVerifyEndpoints from "./definition";
import { schemaVerifyRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: schemaVerifyEndpoints,
  [Methods.POST]: {
    handler: ({ data, locale, logger }) => {
      return schemaVerifyRepository.execute(data, locale, logger);
    },
  },
});
