/**
 * Build the application Route
 * API route for build the application
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import buildEndpoints from "./definition";
import { buildRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: buildEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return buildRepository.execute(data, user, locale, logger);
    },
  },
});
