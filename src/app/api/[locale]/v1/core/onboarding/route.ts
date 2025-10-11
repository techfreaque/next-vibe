/**
 * Onboarding API Route Handlers
 * Production-ready Next.js API route handlers with comprehensive validation and notifications
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import definitions from "./definition";
import { renderOnboardingMail } from "./email";
import { onboardingRepository } from "./repository";
// SMS is optional and managed separately

export const { GET, POST, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ user, logger }) => {
      const userId = authRepository.requireUserId(user);
      return await onboardingRepository.getOnboarding(userId, user, logger);
    },
  },
  [Methods.POST]: {
    email: [
      {
        render: renderOnboardingMail,
        ignoreErrors: true,
      },
    ],
    handler: async ({ data, user, logger }) => {
      const userId = authRepository.requireUserId(user);
      return await onboardingRepository.updateOnboarding(
        userId,
        data,
        user,
        logger,
      );
    },
  },
  [Methods.PUT]: {
    email: [
      {
        render: renderOnboardingMail,
        ignoreErrors: true,
      },
    ],
    handler: async ({ data, user, logger }) => {
      const userId = authRepository.requireUserId(user);
      return await onboardingRepository.completeOnboarding(
        userId,
        user,
        data,
        logger,
      );
    },
  },
});
