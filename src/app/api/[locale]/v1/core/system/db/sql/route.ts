/**
 * Execute SQL query Route
 * API route for execute sql query
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import sqlEndpoints from "./definition";
import { sqlRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: sqlEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger }) => {
      return sqlRepository.execute(data, logger);
    },
  },
});
