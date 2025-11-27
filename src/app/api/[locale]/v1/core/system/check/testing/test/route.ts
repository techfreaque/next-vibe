/**
 * Run tests Route
 * API route for run tests
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import testEndpoints from "./definition";
import { testRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: testEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return testRepository.execute(data, user, locale, logger);
    },
  },
});
