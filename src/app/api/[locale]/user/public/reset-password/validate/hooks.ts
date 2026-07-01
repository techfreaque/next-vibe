/**
 * Hooks for password reset token validation
 */

import { useToast } from "next-vibe/ui/web/hooks/use-toast";

import type { EndpointLogger } from "next-vibe/logger/types";
import { useTranslation } from "next-vibe/core/i18n/core/client";

import resetPasswordValidateEndpoint from "./definition";
import { useApiQuery } from "../../../../system/platforms/react/hooks/use-api-query";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { scopedTranslation } from "./i18n";

/**
 * Hook for validating a password reset token
 *
 * This hook provides a query for validating a password reset token.
 * It checks if the token is valid and returns the result.
 *
 * Features:
 * - Automatic token validation
 * - Loading state tracking
 * - Error handling with toast notifications
 *
 * @param token - The password reset token from the URL
 * @returns Query result with token validation status
 */
export function useResetPasswordValidate(
  logger: EndpointLogger,
  token: string,
  user: JwtPayloadType,
): ReturnType<typeof useApiQuery<typeof resetPasswordValidateEndpoint.GET>> {
  const { toast } = useToast();
  const { locale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale);

  return useApiQuery({
    endpoint: resetPasswordValidateEndpoint.GET,
    requestData: { tokenInput: { token } },
    logger,
    user,
    options: {
      // Only run the query if we have a token
      enabled: !!token,
      onError: ({ error }) => {
        toast({
          title: t("errors.title"),
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });
}
