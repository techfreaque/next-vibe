/**
 * Hooks for password reset token validation
 */

import { useToast } from "next-vibe-ui/hooks/use-toast";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTranslation } from "@/i18n/core/client";

import resetPasswordValidateEndpoint from "./definition";
import { useApiQuery } from "../../../../system/unified-interface/react/hooks/use-api-query";
import type { JwtPayloadType } from "../../../auth/types";

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
  const { t } = useTranslation();

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
          title: t("app.api.user.public.resetPassword.validate.errors.title"),
          description: t(error.message),
          variant: "destructive",
        });
      },
    },
  });
}
