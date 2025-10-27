/**
 * Verify database schema Route
 * API route for verify database schema
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import schemaVerifyEndpoints from "./definition";
import { schemaVerifyRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: schemaVerifyEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return schemaVerifyRepository.execute(data, user, locale, logger);
    },
  },
});
