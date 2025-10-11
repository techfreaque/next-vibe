/**
 * Basic Stream API Route Handler
 * Handles POST requests for basic streaming functionality
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import definitions from "./definition";
import { basicStreamRepository } from "./repository";

/**
 * Allow streaming responses up to 30 seconds
 */
export const maxDuration = 30;

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) => {
      const userId = authRepository.requireUserId(user);

      // Stream the response
      return basicStreamRepository.streamMessages(data, logger, userId, locale);
    },
  },
});
