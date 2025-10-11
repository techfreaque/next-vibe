/**
 * Run tests Route
 * API route for run tests
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

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
