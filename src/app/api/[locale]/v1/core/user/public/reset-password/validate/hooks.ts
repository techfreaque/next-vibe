/**
 * Hooks for password reset token validation
 */

import { useToast } from "@/packages/next-vibe-ui/web/hooks/use-toast";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { useApiQuery } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { useTranslation } from "@/i18n/core/client";

import { resetPasswordValidateEndpoint } from "./definition";

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
): ReturnType<typeof useApiQuery<typeof resetPasswordValidateEndpoint.GET>> {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useApiQuery({
    endpoint: resetPasswordValidateEndpoint.GET,
    requestData: { tokenInput: { token } },
    logger,
    options: {
      // Only run the query if we have a token
      enabled: !!token,
      onError: ({ error }) => {
        toast({
          title: t(
            "app.api.v1.core.user.public.resetPassword.validate.errors.title",
          ),
          description: t(error.message),
          variant: "destructive",
        });
      },
    },
  });
}
