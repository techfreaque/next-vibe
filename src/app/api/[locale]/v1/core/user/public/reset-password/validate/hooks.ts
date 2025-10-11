/**
 * Hooks for password reset token validation
 */

import { useToast } from "next-vibe-ui/ui";

import { useApiQuery } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/query";
import { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { envClient } from "@/config/env-client";
import type { InferApiQueryReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/types";
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
export function useResetPasswordValidate(logger: EndpointLogger, token: string) {
  const { toast } = useToast();
  const { t, locale } = useTranslation();

  return useApiQuery({
    endpoint: resetPasswordValidateEndpoint.GET,
    logger,
    options: {
      // Only run the query if we have a token
      enabled: !!token,
      onError: ({ error }: { error: { message: string } }) => {
        toast({
          title: t("auth.resetPassword.errors.title"),
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });
}
