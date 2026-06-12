/**
 * Run tests Route
 * API route for run tests
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import testEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: testEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).TestRepository.execute(data, logger, t),
  },
});
