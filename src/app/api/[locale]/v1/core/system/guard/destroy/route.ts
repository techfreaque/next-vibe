/**
 * Guard Destroy Route Handler
 * Handles POST requests for destroying guard environments
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import guardDestroyEndpoints from "./definition";
import { guardDestroyRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: guardDestroyEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      return guardDestroyRepository.destroyGuard(data, user, locale, logger);
    },
  },
});
