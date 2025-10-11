import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { loginRepository } from "../repository";
import loginOptionsDefinitions from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: loginOptionsDefinitions,
  [Methods.GET]: {
    handler: async ({ data, logger }) => {
      const email = data.email;
      const optionsResult = await loginRepository.getLoginOptions(
        logger,
        email,
      );

      if (!optionsResult.success) {
        return optionsResult;
      }

      const options = optionsResult.data;

      // Transform to match definition structure
      return {
        success: true,
        data: {
          response: {
            success: true,
            message: "Login options retrieved successfully",
            forUser: email,
            loginMethods: {
              password: {
                enabled: options.allowPasswordAuth,
                description: "Log in with your email and password",
              },
              social: {
                enabled: options.allowSocialAuth,
                description: "Log in with your social media accounts",
                providers:
                  options.socialProviders?.map((provider) => ({
                    name: provider.name,
                    id: provider.providers[0] || "unknown",
                    enabled: provider.enabled,
                    description: `Continue with ${provider.name}`,
                  })) || [],
              },
            },
            security: {
              maxAttempts: options.maxAttempts,
              requireTwoFactor: options.requireTwoFactor,
              description: options.requireTwoFactor
                ? "Enhanced security: 2FA required"
                : "Standard security requirements",
            },
            recommendations: [
              options.allowPasswordAuth
                ? "Try password login first"
                : "Use social login",
              "Social login is faster for new users",
            ],
          },
        },
      };
    },
  },
});
