/**
 * Onboarding Status API Route Handler
 * Production-ready endpoint for retrieving comprehensive onboarding status
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { onboardingRepository } from "../repository";
import statusDefinition from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: statusDefinition,
  [Methods.GET]: {
    email: undefined, // No emails for status requests
    handler: async ({ user, logger }) => {
      const userId = authRepository.requireUserId(user);
      return await onboardingRepository.getOnboardingStatus(userId, logger);
    },
  },
});
