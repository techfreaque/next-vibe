/**
 * Logout API Hooks
 *
 * Hooks for interacting with the Logout API.
 * Most of the implementation details are handled by the next-vibe package.
 */

import { useTranslation } from "next-vibe/core/i18n/core/client";
import { scopedTranslation as authScopedTranslation } from "next-vibe/identity/auth/i18n";
import { AuthClientRepository } from "next-vibe/identity/auth/repository-client";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { apiClient } from "next-vibe/platforms/react/hooks/store";
import { useToast } from "next-vibe/ui/hooks/use-toast";
import { assignUrl } from "next-vibe/ui/lib/location";
import { useCallback } from "react";

import definitions from "@/app/api/[locale]/credits/definition";

import { useApiMutation } from "../../../system/platforms/react/hooks/use-api-mutation";
import logoutEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

/****************************
 * MUTATION HOOKS
 ****************************/

/**
 * Hook for logout functionality
 *
 * Features:
 * - Handles token removal
 * - Provides success notifications
 * - Redirects to login page with page refresh
 * - Refreshes user state
 *
 * @returns Logout function
 */
export function useLogout(
  logger: EndpointLogger,
  user: JwtPayloadType,
): () => void {
  const { toast } = useToast();
  const { locale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale);
  const { t: authT } = authScopedTranslation.scopedT(locale);

  const logout = useApiMutation(logoutEndpoints.POST, logger, user, {
    onSuccess: async () => {
      toast({
        title: t("success.title"),
        description: t("success.description"),
        variant: "default",
      });

      // remove react native token - web token is already cleared by server
      await AuthClientRepository.removeAuthToken(logger, authT);
      // Invalidate credits queries to trigger refetch with new auth state
      await apiClient.refetchEndpoint(definitions.GET, logger);

      // Use assignUrl for full page refresh
      // eslint-disable-next-line react-compiler/react-compiler
      assignUrl(`/${locale}/user/login`);
    },
    onError: async () => {
      // Even if the API call fails, we still want to log the user out locally
      toast({
        title: t("success.title"),
        description: t("success.description"),
        variant: "default",
      });
      // remove react native token - web token is already cleared by server
      await AuthClientRepository.removeAuthToken(logger, authT);

      // Invalidate credits queries to trigger refetch with new auth state
      await apiClient.refetchEndpoint(definitions.GET, logger);

      // Use assignUrl for full page refresh
      assignUrl(`/${locale}/user/login`);
    },
  });

  return useCallback((): void => {
    logout.mutate({});
  }, [logout]);
}
