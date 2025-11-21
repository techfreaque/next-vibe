import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/shared/enums";
import { getLanguageFromLocale } from "@/i18n/core/language-utils";
import { translateKey } from "@/i18n/core/translation-utils";

import { loginRepository } from "../repository";
import loginOptionsDefinitions from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: loginOptionsDefinitions,
  [Methods.GET]: {
    handler: async ({ data, logger, locale }) => {
      const email = data.email;
      const language = getLanguageFromLocale(locale);
      const optionsResult = await loginRepository.getLoginOptions(
        logger,
        locale,
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
            message: translateKey(
              "app.api.v1.core.user.public.login.options.messages.successMessage",
              language,
            ),
            forUser: email,
            loginMethods: {
              password: {
                enabled: options.allowPasswordAuth,
                passwordDescription: translateKey(
                  "app.api.v1.core.user.public.login.options.messages.passwordAuthDescription",
                  language,
                ),
              },
              social: {
                enabled: options.allowSocialAuth,
                socialDescription: translateKey(
                  "app.api.v1.core.user.public.login.options.messages.socialAuthDescription",
                  language,
                ),
                providers:
                  options.socialProviders?.map((provider) => ({
                    name: provider.name,
                    id: provider.providers[0] || "unknown",
                    enabled: provider.enabled,
                    description: translateKey(
                      "app.api.v1.core.user.public.login.options.messages.continueWithProvider",
                      language,
                      { provider: translateKey(provider.name, language) },
                    ),
                  })) || [],
              },
            },
            security: {
              maxAttempts: options.maxAttempts,
              requireTwoFactor: options.requireTwoFactor,
              securityDescription: options.requireTwoFactor
                ? translateKey(
                    "app.api.v1.core.user.public.login.options.messages.twoFactorRequired",
                    language,
                  )
                : translateKey(
                    "app.api.v1.core.user.public.login.options.messages.standardSecurity",
                    language,
                  ),
            },
            recommendations: [
              options.allowPasswordAuth
                ? translateKey(
                    "app.api.v1.core.user.public.login.options.messages.tryPasswordFirst",
                    language,
                  )
                : translateKey(
                    "app.api.v1.core.user.public.login.options.messages.useSocialLogin",
                    language,
                  ),
              translateKey(
                "app.api.v1.core.user.public.login.options.messages.socialLoginFaster",
                language,
              ),
            ],
          },
        },
      };
    },
  },
});
