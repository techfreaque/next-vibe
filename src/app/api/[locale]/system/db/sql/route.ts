/**
 * Execute SQL query Route
 * API route for execute sql query
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import sqlEndpoints from "./definition";
import { SqlRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: sqlEndpoints,
  [Methods.POST]: {
    handler: ({ data, t, logger }) => {
      return SqlRepository.execute(data, t, logger);
    },
  },
});
